import type {
  FeatureAccessResult,
  SubscriptionFeature,
  SubscriptionFlags,
  SubscriptionRecord,
  SubscriptionStatus,
  SubscriptionTier,
} from "@/lib/subscription/types"

export type {
  FeatureAccessResult,
  PaidPlanId,
  SubscriptionFeature,
  SubscriptionFlags,
  SubscriptionRecord,
  SubscriptionStatus,
  SubscriptionTier,
} from "@/lib/subscription/types"

const TIER_RANK: Record<SubscriptionTier, number> = {
  starter: 0,
  pro: 1,
  pro_max: 2,
}

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<SubscriptionStatus>([
  "active",
  "trialing",
  "past_due",
])

const FEATURE_MIN_TIER: Record<SubscriptionFeature, SubscriptionTier> = {
  deep_pack: "pro",
  brand_voice: "pro",
  telegram_publish: "pro",
  shorts: "pro",
  generation_history: "pro",
  premium_model: "pro_max",
  viral_shorts_finder: "pro_max",
}

export function normalizeSubscriptionTier(
  value: string | null | undefined
): SubscriptionTier {
  if (value === "pro" || value === "pro_max") {
    return value
  }

  return "starter"
}

export function normalizeSubscriptionStatus(
  value: string | null | undefined
): SubscriptionStatus | null {
  if (!value) {
    return null
  }

  const statuses: SubscriptionStatus[] = [
    "active",
    "trialing",
    "past_due",
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired",
    "paused",
  ]

  return statuses.includes(value as SubscriptionStatus)
    ? (value as SubscriptionStatus)
    : null
}

export function toSubscriptionRecord(row: {
  tier?: string | null
  credits?: number | null
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  stripe_price_id?: string | null
  subscription_status?: string | null
  subscription_period_end?: string | null
}): SubscriptionRecord {
  return {
    tier: normalizeSubscriptionTier(row.tier),
    credits: row.credits ?? 0,
    stripeCustomerId: row.stripe_customer_id ?? null,
    stripeSubscriptionId: row.stripe_subscription_id ?? null,
    stripePriceId: row.stripe_price_id ?? null,
    subscriptionStatus: normalizeSubscriptionStatus(row.subscription_status),
    subscriptionPeriodEnd: row.subscription_period_end ?? null,
  }
}

export function getSubscriptionFlags(
  tier: SubscriptionTier,
  subscriptionStatus: SubscriptionStatus | null = null
): SubscriptionFlags {
  const isProMax = tier === "pro_max"
  const isPro = tier === "pro" || isProMax
  const isStarter = tier === "starter"
  const hasActiveSubscription =
    isPro &&
    subscriptionStatus !== null &&
    ACTIVE_SUBSCRIPTION_STATUSES.has(subscriptionStatus)

  return {
    tier,
    isStarter,
    isPro,
    isProMax,
    isPaid: isPro,
    hasActiveSubscription,
  }
}

export function compareSubscriptionTiers(
  current: SubscriptionTier,
  required: SubscriptionTier
): number {
  return TIER_RANK[current] - TIER_RANK[required]
}

export function hasMinimumTier(
  current: SubscriptionTier,
  required: SubscriptionTier
): boolean {
  return compareSubscriptionTiers(current, required) >= 0
}

export { getGenerationLimitsForTier, TIER_GENERATION_LIMITS } from "@/lib/subscription/limits"
export type { GenerationLimits } from "@/lib/subscription/limits"

export function requireFeature(
  flags: SubscriptionFlags,
  feature: SubscriptionFeature
): FeatureAccessResult {
  const minTier = FEATURE_MIN_TIER[feature]

  return {
    feature,
    minTier,
    allowed: hasMinimumTier(flags.tier, minTier),
  }
}
