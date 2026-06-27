import { TRIAL_PRO_PERIOD_DAYS } from "@/lib/trial/types"

const MS_PER_DAY = 24 * 60 * 60 * 1000
const CLOCK_SKEW_MS = MS_PER_DAY

export function addTrialPeriodDays(
  from: Date = new Date(),
  days: number = TRIAL_PRO_PERIOD_DAYS
): Date {
  return new Date(from.getTime() + days * MS_PER_DAY)
}

export function computeDaysRemaining(
  expiresAt: Date | string | null | undefined,
  now: Date = new Date()
): number {
  if (!expiresAt) {
    return 0
  }

  const end = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt

  if (Number.isNaN(end.getTime())) {
    return 0
  }

  const msRemaining = end.getTime() - now.getTime()
  return msRemaining <= 0 ? 0 : Math.ceil(msRemaining / MS_PER_DAY)
}

export function isTrialPeriodActive(
  expiresAt: Date | string | null | undefined,
  now: Date = new Date()
): boolean {
  return computeDaysRemaining(expiresAt, now) > 0
}

export type TrialExpiresValidation =
  | {
      ok: true
      expiresAt: Date
      daysRemaining: number
    }
  | {
      ok: false
      error: string
      code: "TRIAL_EXPIRED" | "INVALID_TRIAL"
    }

/**
 * Validates anonymous demo trial timestamps from localStorage.
 * Caps future expiry to the configured Pro trial length (+ skew).
 */
export function validateClientTrialExpiresAt(
  trialExpiresAt: string,
  now: Date = new Date()
): TrialExpiresValidation {
  const expiresAt = new Date(trialExpiresAt)

  if (Number.isNaN(expiresAt.getTime())) {
    return {
      ok: false,
      error: "Invalid trial expiration timestamp.",
      code: "INVALID_TRIAL",
    }
  }

  if (expiresAt.getTime() <= now.getTime()) {
    return {
      ok: false,
      error: "Trial period expired.",
      code: "TRIAL_EXPIRED",
    }
  }

  const maxAllowed =
    now.getTime() + TRIAL_PRO_PERIOD_DAYS * MS_PER_DAY + CLOCK_SKEW_MS

  if (expiresAt.getTime() > maxAllowed) {
    return {
      ok: false,
      error: "Invalid trial expiration timestamp.",
      code: "INVALID_TRIAL",
    }
  }

  return {
    ok: true,
    expiresAt,
    daysRemaining: computeDaysRemaining(expiresAt, now),
  }
}

export function formatTrialDaysLabel(daysRemaining: number): string {
  if (daysRemaining <= 0) {
    return "Trial period expired"
  }

  if (daysRemaining === 1) {
    return "Pro Trial Active — 1 Day Remaining"
  }

  return `Pro Trial Active — ${daysRemaining} Days Remaining`
}
