import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
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

  let username: string | undefined
  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, ensureProfileSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }
    username = parsed.data.username
  } catch {
    // Empty body is fine for legacy callers (e.g. sign-in without username).
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("credits, username")
      .eq("id", user.id)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching user profile:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      )
    }

    if (existing) {
      if (username && !existing.username) {
        const { error: setUsernameError } = await supabase.rpc("set_username", {
          p_username: username,
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
          username,
          created: false,
        })
      }

      return NextResponse.json({
        credits: existing.credits,
        username: existing.username,
        created: false,
      })
    }

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
    console.error("Error ensuring user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
