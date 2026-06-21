import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { isProTier, normalizeTelegramChannelId } from "@/lib/profile"
import { userSettingsSchema } from "@/lib/validation"

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, userSettingsSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("tier")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching profile tier:", profileError)
      return NextResponse.json(
        { error: "Failed to load profile" },
        { status: 500 }
      )
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
        console.error("Error saving brand voice:", voiceError)
        return NextResponse.json(
          { error: voiceError.message || "Failed to save brand voice" },
          { status: 500 }
        )
      }

      brandVoice = savedVoice || null
    }

    if (parsed.data.tgChannelId !== undefined) {
      const { data: savedChannel, error: channelError } = await supabase.rpc(
        "update_tg_channel_id",
        { p_tg_channel_id: parsed.data.tgChannelId ?? "" }
      )

      if (channelError) {
        console.error("Error saving Telegram channel:", channelError)
        return NextResponse.json(
          { error: channelError.message || "Failed to save Telegram channel" },
          { status: 500 }
        )
      }

      tgChannelId = normalizeTelegramChannelId(savedChannel || null)
    }

    return NextResponse.json({
      brandVoice,
      tgChannelId,
      tier: profile.tier,
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
