import { NextResponse } from "next/server"
import {
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import { isProTier, normalizeTelegramChannelId } from "@/lib/profile"
import { sendTelegramChannelMessage } from "@/lib/telegram/publish"
import { telegramShareSchema } from "@/lib/validation"

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  const rateLimited = enforceRateLimit(
    `telegram-share:${user.id}`,
    RATE_LIMITS.telegramShare,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, telegramShareSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("tier, credits, tg_channel_id")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      return internalErrorResponse("telegram-share", profileError, {
        userId: user.id,
      })
    }

    if (!profile || !isProTier(profile.tier)) {
      return NextResponse.json(
        { error: "Pro tier required to publish to Telegram" },
        { status: 403 }
      )
    }

    const channelId = normalizeTelegramChannelId(profile.tg_channel_id)
    if (!channelId) {
      return NextResponse.json(
        {
          error:
            "Telegram channel not connected. Add your channel ID in the Telegram tab.",
          code: "TG_CHANNEL_MISSING",
        },
        { status: 400 }
      )
    }

    const result = await sendTelegramChannelMessage({
      channelId,
      text: parsed.data.text,
    })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      chatId: result.chatId,
    })
  } catch (error) {
    return internalErrorResponse("telegram-share", error, { userId: user.id })
  }
}
