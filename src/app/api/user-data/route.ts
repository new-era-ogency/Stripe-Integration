import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { DEFAULT_USER_CREDITS } from "@/lib/credits"
import {
  getUserGenerations,
  toGenerationHistoryItem,
} from "@/lib/generations"
import type { UserTier } from "@/lib/profile"
import { checkTrialStatus } from "@/lib/trial"
import { computeTotalTrialDays } from "@/lib/trial/ui"

export async function GET() {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    let { data: profile, error: profileError } = await supabase
      .from("users")
      .select("credits, tier, brand_voice, tg_channel_id")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching user credits:", profileError)
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      )
    }

    if (!profile) {
      const { data: created, error: insertError } = await supabase
        .from("users")
        .insert({ id: user.id, credits: DEFAULT_USER_CREDITS })
        .select("credits, tier, brand_voice, tg_channel_id")
        .single()

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }

      profile = created
    }

    const generations = await getUserGenerations(supabase, user.id)
    const trialStatus = await checkTrialStatus(user.id, { supabase })

    const { data: claimedRows } = await supabase
      .from("viral_actions")
      .select("action_type")
      .eq("user_id", user.id)

    const claimedActions = (claimedRows ?? []).map((row) => row.action_type)

    return NextResponse.json({
      credits: profile.credits,
      tier: (profile.tier ?? "starter") as UserTier,
      brandVoice: profile.brand_voice ?? null,
      tgChannelId: profile.tg_channel_id ?? null,
      profile: {
        tier: (profile.tier ?? "starter") as UserTier,
        brand_voice: profile.brand_voice ?? null,
        tg_channel_id: profile.tg_channel_id ?? null,
      },
      trial: {
        isValid: trialStatus.isValid,
        daysRemaining: trialStatus.daysRemaining,
        totalTrialDays: computeTotalTrialDays(
          trialStatus.trialStartAt,
          trialStatus.trialEndAt
        ),
        accountStatus: trialStatus.accountStatus,
        trialStartAt: trialStatus.trialStartAt,
        trialEndAt: trialStatus.trialEndAt,
        trialExtendedDays: trialStatus.trialExtendedDays,
        claimedActions,
      },
      generations,
      history: generations.map(toGenerationHistoryItem),
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
