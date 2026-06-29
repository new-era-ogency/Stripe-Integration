import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import { supabaseRpcErrorResponse } from "@/lib/api/supabase-errors"
import { isProTier } from "@/lib/profile"
import {
  telegramIntegrationErrorResponse,
  validateTelegramChannel,
} from "@/lib/telegram/api"
import { formatTelegramChatIdOrNull } from "@/lib/telegram/channel-id"
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
        return supabaseRpcErrorResponse("user-settings", voiceError, {
          userId: user.id,
          field: "brandVoice",
        })
      }

      brandVoice = savedVoice || null
    }

    if (parsed.data.tgChannelId !== undefined) {
      let formattedChannelId: string | null = null

      try {
        formattedChannelId = parsed.data.tgChannelId
          ? formatTelegramChatIdOrNull(parsed.data.tgChannelId)
          : null
      } catch (error) {
        return telegramIntegrationErrorResponse(error)
      }

      if (formattedChannelId) {
        try {
          await validateTelegramChannel(formattedChannelId)
        } catch (error) {
          return telegramIntegrationErrorResponse(error)
        }
      }

      const { data: savedChannel, error: channelError } = await supabase.rpc(
        "update_tg_channel_id",
        { p_tg_channel_id: formattedChannelId ?? "" }
      )

      if (channelError) {
        return supabaseRpcErrorResponse("user-settings", channelError, {
          userId: user.id,
          field: "tgChannelId",
        })
      }

      tgChannelId = formatTelegramChatIdOrNull(savedChannel || formattedChannelId)
    }

    return NextResponse.json({
      brandVoice,
      tgChannelId,
      tier: profile?.tier ?? "starter",
    })
  } catch (error) {
    return internalErrorResponse("user-settings", error, { userId: user.id })
  }
}
