import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import { DEFAULT_USER_CREDITS } from "@/lib/credits"
import { ensureProfileSchema } from "@/lib/validation"

function mapProfileError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes("username is already taken")) {
    return "That username is already taken. Try another one."
  }

  if (lower.includes("username must be")) {
    return message
  }

  if (lower.includes("username already set")) {
    return "Your username is already set."
  }

  return "Failed to save profile."
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  const rateLimited = enforceRateLimit(
    `ensure-profile:${user.id}`,
    RATE_LIMITS.ensureProfile,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  const parsed = await parseRequestJsonBody(request, ensureProfileSchema)

  if (parsed instanceof NextResponse) {
    return parsed
  }

  const usernameFromBody = parsed.data.username

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("credits, username")
      .eq("id", user.id)
      .maybeSingle()

    if (fetchError) {
      return internalErrorResponse("ensure-profile", fetchError, {
        userId: user.id,
      })
    }

    if (existing) {
      if (usernameFromBody && !existing.username) {
        const { error: setUsernameError } = await supabase.rpc("set_username", {
          p_username: usernameFromBody,
        })

        if (setUsernameError) {
          console.error("Error setting username:", setUsernameError)
          return NextResponse.json(
            { error: mapProfileError(setUsernameError.message) },
            { status: 400 }
          )
        }

        return NextResponse.json({
          credits: existing.credits,
          username: usernameFromBody,
          created: false,
        })
      }

      return NextResponse.json({
        credits: existing.credits,
        username: existing.username,
        created: false,
      })
    }

    let username = usernameFromBody

    if (!username) {
      const metadataUsername = user.user_metadata?.username
      if (
        typeof metadataUsername === "string" &&
        ensureProfileSchema.shape.username.safeParse(metadataUsername).success
      ) {
        username = metadataUsername
      }
    }

    const { data: created, error: insertError } = await supabase
      .from("users")
      .insert({
        id: user.id,
        credits: DEFAULT_USER_CREDITS,
        ...(username ? { username } : {}),
      })
      .select("credits, username")
      .single()

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      const message = insertError.message.toLowerCase()
      if (message.includes("unique") || message.includes("duplicate")) {
        return NextResponse.json(
          { error: "That username is already taken. Try another one." },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      credits: created.credits,
      username: created.username,
      created: true,
    })
  } catch (error) {
    return internalErrorResponse("ensure-profile", error, { userId: user.id })
  }
}
