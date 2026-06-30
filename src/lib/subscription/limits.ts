import { PRODUCTION_OPENROUTER_MODEL } from "@/lib/ai/models"
import type { SubscriptionTier } from "@/lib/subscription/types"

export type GenerationLimits = {
  tier: SubscriptionTier
  maxOutputTokens: number
  starterMaxOutputTokens: number
  modelId: string
}

export const TIER_GENERATION_LIMITS: Record<SubscriptionTier, GenerationLimits> = {
  starter: {
    tier: "starter",
    maxOutputTokens: 2_000,
    starterMaxOutputTokens: 2_000,
    modelId: PRODUCTION_OPENROUTER_MODEL,
  },
  pro: {
    tier: "pro",
    maxOutputTokens: 6_000,
    starterMaxOutputTokens: 2_000,
    modelId: PRODUCTION_OPENROUTER_MODEL,
  },
  pro_max: {
    tier: "pro_max",
    maxOutputTokens: 12_000,
    starterMaxOutputTokens: 2_000,
    modelId: PRODUCTION_OPENROUTER_MODEL,
  },
}

export function getGenerationLimitsForTier(
  tier: SubscriptionTier
): GenerationLimits {
  return TIER_GENERATION_LIMITS[tier]
}
