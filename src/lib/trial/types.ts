export type AccountStatus = "trial" | "active" | "past_due" | "canceled"

export type ViralActionType =
  | "referral_signup"
  | "social_share_linkedin"
  | "social_share_twitter"
  | "social_share_telegram"
  | "invite_colleague"
  | "share_generation_result"

export type TrialRecord = {
  accountStatus: AccountStatus
  trialStartAt: string | null
  trialEndAt: string | null
  trialExtendedDays: number
}

export type TrialCheckResult = {
  isValid: boolean
  daysRemaining: number
  accountStatus: AccountStatus
  trialEndAt: string | null
  trialStartAt: string | null
  trialExtendedDays: number
}

export type ViralActionRecord = {
  id: string
  userId: string
  actionType: ViralActionType | string
  daysGranted: number
  createdAt: string
}

/** Default Pro trial length (must match SQL trigger / migration). */
export const BASE_TRIAL_DAYS = 30
export const TRIAL_PRO_PERIOD_DAYS = BASE_TRIAL_DAYS

/** Max total bonus days a user can earn via viral_actions. */
export const MAX_TRIAL_EXTENSION_DAYS = 30

/** Max days granted per single viral action RPC call. */
export const MAX_DAYS_PER_VIRAL_ACTION = 7

export const VIRAL_ACTION_REWARDS: Record<ViralActionType, number> = {
  referral_signup: 7,
  social_share_linkedin: 3,
  social_share_twitter: 3,
  social_share_telegram: 3,
  invite_colleague: 5,
  share_generation_result: 2,
}
