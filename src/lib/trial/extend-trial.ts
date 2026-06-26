import type { ViralActionType } from "@/lib/trial/types"
import { MAX_DAYS_PER_VIRAL_ACTION, VIRAL_ACTION_REWARDS } from "@/lib/trial/types"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export type ExtendTrialResult = {
  trialEndAt: string
  daysGranted: number
  actionType: string
}

/**
 * Grants bonus trial days and logs the viral action (service role only).
 * Each action_type can only be claimed once per user.
 */
export async function extendUserTrial(
  userId: string,
  actionType: ViralActionType | string,
  daysGranted?: number
): Promise<ExtendTrialResult> {
  const days = daysGranted ?? VIRAL_ACTION_REWARDS[actionType as ViralActionType]

  if (!days || days <= 0 || days > MAX_DAYS_PER_VIRAL_ACTION) {
    throw new Error(
      `Days granted must be between 1 and ${MAX_DAYS_PER_VIRAL_ACTION}`
    )
  }

  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase.rpc("extend_user_trial", {
    p_user_id: userId,
    p_days: days,
    p_action_type: actionType,
  })

  if (error) {
    throw error
  }

  return {
    trialEndAt: data as string,
    daysGranted: days,
    actionType,
  }
}
