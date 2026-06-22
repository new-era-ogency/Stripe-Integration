export type SubscriptionTier = "starter" | "pro" | "pro_max"

export type PaidPlanId = "pro" | "pro_max"

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused"

export type SubscriptionFeature =
  | "deep_pack"
  | "brand_voice"
  | "telegram_publish"
  | "shorts"
  | "generation_history"
  | "premium_model"
  | "viral_shorts_finder"

export type SubscriptionRecord = {
  tier: SubscriptionTier
  credits: number
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  subscriptionStatus: SubscriptionStatus | null
  subscriptionPeriodEnd: string | null
}

export type SubscriptionFlags = {
  tier: SubscriptionTier
  isStarter: boolean
  isPro: boolean
  isProMax: boolean
  isPaid: boolean
  hasActiveSubscription: boolean
}

export type FeatureAccessResult = {
  allowed: boolean
  minTier: SubscriptionTier
  feature: SubscriptionFeature
}
