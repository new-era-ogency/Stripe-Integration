export const TRIAL_PREVIEW_STORAGE_KEY = "pulseflow_trial_preview_count"
export const DEFAULT_TRIAL_PREVIEWS = 3

export function readTrialPreviewCount(): number {
  if (typeof window === "undefined") {
    return DEFAULT_TRIAL_PREVIEWS
  }

  const raw = localStorage.getItem(TRIAL_PREVIEW_STORAGE_KEY)

  if (raw === null) {
    return DEFAULT_TRIAL_PREVIEWS
  }

  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function writeTrialPreviewCount(count: number): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(
    TRIAL_PREVIEW_STORAGE_KEY,
    String(Math.max(0, Math.floor(count)))
  )
}

export function initTrialPreviewCount(): number {
  if (typeof window === "undefined") {
    return DEFAULT_TRIAL_PREVIEWS
  }

  const raw = localStorage.getItem(TRIAL_PREVIEW_STORAGE_KEY)

  if (raw === null) {
    writeTrialPreviewCount(DEFAULT_TRIAL_PREVIEWS)
    return DEFAULT_TRIAL_PREVIEWS
  }

  return readTrialPreviewCount()
}
