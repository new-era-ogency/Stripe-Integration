import type { SubscriptionTier } from "@/lib/subscription/types"

export type GenerationLimits = {
  tier: SubscriptionTier
  maxOutputTokens: number
  starterMaxOutputTokens: number
  modelId: string
}

const STARTER_MODEL = "openai/gpt-4o-mini"
const PRO_MODEL = "anthropic/claude-sonnet-4"
const PRO_MAX_MODEL = "anthropic/claude-sonnet-4"

export const TIER_GENERATION_LIMITS: Record<SubscriptionTier, GenerationLimits> = {
  starter: {
    tier: "starter",
    maxOutputTokens: 2_000,
    starterMaxOutputTokens: 2_000,
    modelId: STARTER_MODEL,
  },
  pro: {
    tier: "pro",
    maxOutputTokens: 6_000,
    starterMaxOutputTokens: 2_000,
    modelId: PRO_MODEL,
  },
  pro_max: {
    tier: "pro_max",
    maxOutputTokens: 12_000,
    starterMaxOutputTokens: 2_000,
    modelId: PRO_MAX_MODEL,
  },
}

export function getGenerationLimitsForTier(
  tier: SubscriptionTier
): GenerationLimits {
  return TIER_GENERATION_LIMITS[tier]
}
