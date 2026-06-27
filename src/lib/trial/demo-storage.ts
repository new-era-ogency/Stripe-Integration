import {
  addTrialPeriodDays,
  computeDaysRemaining,
  isTrialPeriodActive,
} from "@/lib/trial/period"
import { TRIAL_PRO_PERIOD_DAYS } from "@/lib/trial/types"

export const TRIAL_EXPIRES_STORAGE_KEY = "pulseflow_trial_expires_at"
const LEGACY_COUNT_STORAGE_KEY = "pulseflow_trial_preview_count"

export function readTrialExpiresAt(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return localStorage.getItem(TRIAL_EXPIRES_STORAGE_KEY)
}

export function writeTrialExpiresAt(isoTimestamp: string): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(TRIAL_EXPIRES_STORAGE_KEY, isoTimestamp)
}

function migrateLegacyCountStorage(): void {
  if (typeof window === "undefined") {
    return
  }

  const legacy = localStorage.getItem(LEGACY_COUNT_STORAGE_KEY)

  if (legacy === null) {
    return
  }

  localStorage.removeItem(LEGACY_COUNT_STORAGE_KEY)

  const parsed = Number.parseInt(legacy, 10)

  if (Number.isFinite(parsed) && parsed <= 0) {
    writeTrialExpiresAt(new Date().toISOString())
    return
  }

  writeTrialExpiresAt(addTrialPeriodDays().toISOString())
}

/** Starts or resumes the anonymous 30-day Pro trial window in localStorage. */
export function initTrialExpiresAt(): string {
  if (typeof window === "undefined") {
    return addTrialPeriodDays().toISOString()
  }

  migrateLegacyCountStorage()

  const existing = readTrialExpiresAt()

  if (existing && !Number.isNaN(Date.parse(existing))) {
    return existing
  }

  const expiresAt = addTrialPeriodDays().toISOString()
  writeTrialExpiresAt(expiresAt)
  return expiresAt
}

export function getTrialDaysRemaining(): number {
  const expiresAt = initTrialExpiresAt()
  return computeDaysRemaining(expiresAt)
}

export function isLocalTrialActive(): boolean {
  const expiresAt = initTrialExpiresAt()
  return isTrialPeriodActive(expiresAt)
}

export { TRIAL_PRO_PERIOD_DAYS }
