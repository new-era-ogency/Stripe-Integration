import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import { isProTier, normalizeTelegramChannelId } from "@/lib/profile"
import { userSettingsSchema } from "@/lib/validation"

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  const rateLimited = enforceRateLimit(
    `user-settings:${user.id}`,
    RATE_LIMITS.userSettings,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, userSettingsSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("tier")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      return internalErrorResponse("user-settings", profileError, {
        userId: user.id,
      })
    }

    if (!isProTier(profile?.tier)) {
      return NextResponse.json(
        { error: "Pro tier required to update settings" },
        { status: 403 }
      )
    }

    let brandVoice: string | null | undefined
    let tgChannelId: string | null | undefined

    if (parsed.data.brandVoice !== undefined) {
      const { data: savedVoice, error: voiceError } = await supabase.rpc(
        "update_brand_voice",
        { p_brand_voice: parsed.data.brandVoice ?? "" }
      )

      if (voiceError) {
        return internalErrorResponse("user-settings", voiceError, {
          userId: user.id,
          field: "brandVoice",
        })
      }

      brandVoice = savedVoice || null
    }

    if (parsed.data.tgChannelId !== undefined) {
      const { data: savedChannel, error: channelError } = await supabase.rpc(
        "update_tg_channel_id",
        { p_tg_channel_id: parsed.data.tgChannelId ?? "" }
      )

      if (channelError) {
        return internalErrorResponse("user-settings", channelError, {
          userId: user.id,
          field: "tgChannelId",
        })
      }

      tgChannelId = normalizeTelegramChannelId(savedChannel || null)
    }

    return NextResponse.json({
      brandVoice,
      tgChannelId,
      tier: profile.tier,
    })
  } catch (error) {
    return internalErrorResponse("user-settings", error, { userId: user.id })
  }
}
