export type {
  AccountStatus,
  TrialCheckResult,
  TrialRecord,
  ViralActionRecord,
  ViralActionType,
} from "@/lib/trial/types"

export {
  computeDaysRemaining,
  formatTrialDaysLabel,
  isTrialPeriodActive,
  validateClientTrialExpiresAt,
} from "@/lib/trial/period"

export {
  BASE_TRIAL_DAYS,
  MAX_DAYS_PER_VIRAL_ACTION,
  MAX_TRIAL_EXTENSION_DAYS,
  TRIAL_PRO_PERIOD_DAYS,
  VIRAL_ACTION_REWARDS,
} from "@/lib/trial/types"

export {
  checkTrialStatus,
  getTrialRecord,
  isTrialCurrentlyValid,
} from "@/lib/trial/check-trial-status"

export { extendUserTrial } from "@/lib/trial/extend-trial"
export type { ExtendTrialResult } from "@/lib/trial/extend-trial"

export {
  computeTotalTrialDays,
  getTrialProgressPercent,
  getTrialUrgencyClass,
} from "@/lib/trial/ui"
export type { TrialUiState } from "@/lib/trial/ui"
