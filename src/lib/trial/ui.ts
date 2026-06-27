import { computeDaysRemaining, isTrialPeriodActive } from "@/lib/trial/period"
import { BASE_TRIAL_DAYS } from "@/lib/trial/types"
import type { AccountStatus } from "@/lib/trial/types"

function normalizeAccountStatus(value: string | null | undefined): AccountStatus {
  if (
    value === "trial" ||
    value === "active" ||
    value === "past_due" ||
    value === "canceled"
  ) {
    return value
  }

  return "trial"
}

export type TrialUiState = {
  isValid: boolean
  daysRemaining: number
  totalTrialDays: number
  accountStatus: AccountStatus
  trialStartAt: string | null
  trialEndAt: string | null
  trialExtendedDays: number
  claimedActions: string[]
}

export function computeTotalTrialDays(
  trialStartAt: string | null,
  trialEndAt: string | null
): number {
  if (!trialStartAt || !trialEndAt) {
    return BASE_TRIAL_DAYS
  }

  const start = new Date(trialStartAt).getTime()
  const end = new Date(trialEndAt).getTime()
  const spanDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  return Math.max(BASE_TRIAL_DAYS, spanDays)
}

export function getTrialUrgencyClass(daysRemaining: number): string {
  if (daysRemaining <= 1) {
    return "text-red-400"
  }

  if (daysRemaining < 3) {
    return "text-amber-400"
  }

  return "text-violet-300"
}

export function getTrialProgressPercent(
  daysRemaining: number,
  totalTrialDays: number
): number {
  if (totalTrialDays <= 0) {
    return 0
  }

  const usedDays = Math.max(0, totalTrialDays - daysRemaining)
  return Math.min(100, Math.max(0, (usedDays / totalTrialDays) * 100))
}

export function buildTrialUiState(input: {
  accountStatus?: string | null
  trialStartAt?: string | null
  trialEndAt?: string | null
  trialExtendedDays?: number | null
  claimedActions?: string[]
}): TrialUiState {
  const accountStatus = normalizeAccountStatus(input.accountStatus)
  const trialStartAt = input.trialStartAt ?? null
  const trialEndAt = input.trialEndAt ?? null
  const trialExtendedDays = input.trialExtendedDays ?? 0
  const claimedActions = input.claimedActions ?? []
  const daysRemaining =
    accountStatus === "trial" && !trialEndAt
      ? BASE_TRIAL_DAYS
      : computeDaysRemaining(trialEndAt)
  const isValid =
    accountStatus === "active" ||
    (accountStatus === "trial" &&
      (isTrialPeriodActive(trialEndAt) || !trialEndAt))

  return {
    isValid,
    daysRemaining,
    totalTrialDays: computeTotalTrialDays(trialStartAt, trialEndAt),
    accountStatus,
    trialStartAt,
    trialEndAt,
    trialExtendedDays,
    claimedActions,
  }
}
