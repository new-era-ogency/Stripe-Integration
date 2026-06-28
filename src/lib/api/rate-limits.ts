import type { RateLimitOptions } from "@/lib/api/rate-limit"

export const RATE_LIMITS = {
  feedback: { limit: 8, windowMs: 60 * 60 * 1000 },
  trialPreview: { limit: 30, windowMs: 60 * 60 * 1000 },
  trialExtend: { limit: 10, windowMs: 15 * 60 * 1000 },
  transcript: { limit: 30, windowMs: 60 * 60 * 1000 },
  generateContent: { limit: 20, windowMs: 60 * 60 * 1000 },
  ensureProfile: { limit: 20, windowMs: 60 * 60 * 1000 },
  checkout: { limit: 15, windowMs: 60 * 60 * 1000 },
  telegramShare: { limit: 30, windowMs: 60 * 60 * 1000 },
  userSettings: { limit: 30, windowMs: 60 * 60 * 1000 },
  deductCredit: { limit: 60, windowMs: 60 * 60 * 1000 },
  agent: { limit: 20, windowMs: 60 * 60 * 1000 },
} as const satisfies Record<string, RateLimitOptions>
