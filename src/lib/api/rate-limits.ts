import type { RateLimitOptions } from "@/lib/api/rate-limit"
import { OPENROUTER_FREE_TIER_REQUESTS_PER_MINUTE } from "@/lib/ai/models"

const OPENROUTER_FREE_TIER_WINDOW_MS = 60 * 1000
const OPENROUTER_FREE_TIER_LIMIT = Math.max(
  1,
  OPENROUTER_FREE_TIER_REQUESTS_PER_MINUTE - 2
)

export const RATE_LIMITS = {
  feedback: { limit: 8, windowMs: 60 * 60 * 1000 },
  trialPreview: { limit: 10, windowMs: OPENROUTER_FREE_TIER_WINDOW_MS },
  trialExtend: { limit: 10, windowMs: 15 * 60 * 1000 },
  transcript: { limit: 30, windowMs: 60 * 60 * 1000 },
  generateContent: { limit: 10, windowMs: OPENROUTER_FREE_TIER_WINDOW_MS },
  ensureProfile: { limit: 20, windowMs: 60 * 60 * 1000 },
  checkout: { limit: 15, windowMs: 60 * 60 * 1000 },
  telegramShare: { limit: 30, windowMs: 60 * 60 * 1000 },
  userSettings: { limit: 30, windowMs: 60 * 60 * 1000 },
  deductCredit: { limit: 60, windowMs: 60 * 60 * 1000 },
  agent: { limit: 18, windowMs: OPENROUTER_FREE_TIER_WINDOW_MS },
  /** Shared OpenRouter API key budget (free tier: 20 req/min). */
  openRouterFreeTier: {
    limit: OPENROUTER_FREE_TIER_LIMIT,
    windowMs: OPENROUTER_FREE_TIER_WINDOW_MS,
  },
} as const satisfies Record<string, RateLimitOptions>
