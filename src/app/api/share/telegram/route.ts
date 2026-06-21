import { NextResponse } from "next/server"
import {
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { isProTier, normalizeTelegramChannelId } from "@/lib/profile"
import { sendTelegramChannelMessage } from "@/lib/telegram/publish"
import { telegramShareSchema } from "@/lib/validation"

export async function POST(request: Request) {
  // User identity and channel config come only from the authenticated session
  // and database profile — never from client-supplied userId or email.
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, telegramShareSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("tier, credits, tg_channel_id")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching profile for Telegram share:", profileError)
      return NextResponse.json(
        { error: "Failed to load profile" },
        { status: 500 }
      )
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
    console.error("Telegram publish error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to publish to Telegram",
      },
      { status: 500 }
    )
  }
}
