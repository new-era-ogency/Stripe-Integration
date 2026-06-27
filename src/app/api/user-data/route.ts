import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { DEFAULT_USER_CREDITS } from "@/lib/credits"
import {
  buildDashboardUserData,
  fetchClaimedViralActions,
  fetchUserGenerationsWithFallback,
  fetchUserProfileWithFallback,
  formatSupabaseError,
} from "@/lib/dashboard/user-data-loader"
import { toGenerationHistoryItem } from "@/lib/generations"
import type { UserTier } from "@/lib/profile"
import { checkTrialStatus } from "@/lib/trial"
import { buildTrialUiState, computeTotalTrialDays } from "@/lib/trial/ui"

export async function GET() {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    let profile = await fetchUserProfileWithFallback(supabase, user.id)

    if (!profile) {
      const { data: created, error: insertError } = await supabase
        .from("users")
        .insert({ id: user.id, credits: DEFAULT_USER_CREDITS })
        .select("credits, tier")
        .single()

      if (insertError) {
        console.error(
          "Error creating user profile:",
          formatSupabaseError(insertError)
        )
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }

      profile = created
    }

    const [generations, claimedActions] = await Promise.all([
      fetchUserGenerationsWithFallback(supabase, user.id),
      fetchClaimedViralActions(supabase, user.id),
    ])

    let trialStatus
    try {
      trialStatus = await checkTrialStatus(user.id, { supabase })
    } catch (trialError) {
      console.error("Error checking trial status:", trialError)
      trialStatus = buildTrialUiState({
        accountStatus: profile.account_status,
        trialStartAt: profile.trial_start_at,
        trialEndAt: profile.trial_end_at,
        trialExtendedDays: profile.trial_extended_days,
        claimedActions,
      })
    }

    const dashboardData = buildDashboardUserData(
      profile,
      generations,
      claimedActions
    )

    return NextResponse.json({
      credits: dashboardData.credits,
      tier: dashboardData.tier,
      brandVoice: dashboardData.brandVoice,
      tgChannelId: dashboardData.tgChannelId,
      profile: {
        tier: dashboardData.tier,
        brand_voice: dashboardData.brandVoice,
        tg_channel_id: dashboardData.tgChannelId,
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
      generations: dashboardData.generations,
      history: dashboardData.generations.map(toGenerationHistoryItem),
    })
  } catch (error) {
    console.error("Error fetching user data:", formatSupabaseError(error))
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
