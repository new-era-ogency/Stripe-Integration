import type Stripe from "stripe"
import { resolvePlanFromPriceId } from "@/config/plans"
import {
  normalizeSubscriptionStatus,
  type SubscriptionStatus,
  type SubscriptionTier,
} from "@/lib/subscription"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export type SyncSubscriptionParams = {
  userId: string
  tier: SubscriptionTier
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripePriceId?: string | null
  subscriptionStatus?: SubscriptionStatus | null
  subscriptionPeriodEnd?: string | null
}

const TERMINAL_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  "canceled",
  "unpaid",
  "incomplete_expired",
])

export function getUserIdFromStripeMetadata(
  metadata: Stripe.Metadata | null | undefined
): string | null {
  const userId = metadata?.supabase_user_id?.trim()
  return userId || null
}

export function getPrimaryPriceIdFromSubscription(
  subscription: Stripe.Subscription
): string | null {
  const item = subscription.items?.data?.[0]
  if (!item?.price) {
    return null
  }

  return typeof item.price === "string" ? item.price : item.price.id
}

function readSubscriptionPeriodEnd(
  subscription: Stripe.Subscription
): number | null {
  const subscriptionRecord = subscription as Stripe.Subscription & {
    current_period_end?: number
  }

  if (typeof subscriptionRecord.current_period_end === "number") {
    return subscriptionRecord.current_period_end
  }

  const item = subscription.items?.data?.[0] as
    | { current_period_end?: number }
    | undefined

  if (typeof item?.current_period_end === "number") {
    return item.current_period_end
  }

  return null
}

export function getSubscriptionPeriodEndIso(
  subscription: Stripe.Subscription
): string | null {
  const periodEnd = readSubscriptionPeriodEnd(subscription)

  if (!periodEnd) {
    return null
  }

  return new Date(periodEnd * 1000).toISOString()
}

export function resolveTierFromStripeSubscription(
  subscription: Stripe.Subscription
): SubscriptionTier {
  if (TERMINAL_SUBSCRIPTION_STATUSES.has(subscription.status)) {
    return "starter"
  }

  const metadataTier = subscription.metadata?.tier
  if (metadataTier === "pro" || metadataTier === "pro_max") {
    return metadataTier
  }

  const priceId = getPrimaryPriceIdFromSubscription(subscription)
  const plan = resolvePlanFromPriceId(priceId)

  if (plan) {
    return plan.tier
  }

  console.warn(
    `[stripe] Unknown price on subscription ${subscription.id}: ${priceId ?? "none"} — defaulting tier to pro`
  )

  return "pro"
}

export function buildSyncParamsFromSubscription(
  subscription: Stripe.Subscription
): SyncSubscriptionParams | null {
  const userId = getUserIdFromStripeMetadata(subscription.metadata)

  if (!userId) {
    console.error(
      `[stripe] Subscription ${subscription.id} missing supabase_user_id metadata`
    )
    return null
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null

  return {
    userId,
    tier: resolveTierFromStripeSubscription(subscription),
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: getPrimaryPriceIdFromSubscription(subscription),
    subscriptionStatus: normalizeSubscriptionStatus(subscription.status),
    subscriptionPeriodEnd: getSubscriptionPeriodEndIso(subscription),
  }
}

export async function syncUserSubscription(
  params: SyncSubscriptionParams
): Promise<void> {
  const supabase = createAdminSupabaseClient()

  const { error } = await supabase.rpc("set_user_subscription", {
    p_user_id: params.userId,
    p_tier: params.tier,
    p_stripe_customer_id: params.stripeCustomerId ?? null,
    p_stripe_subscription_id: params.stripeSubscriptionId ?? null,
    p_stripe_price_id: params.stripePriceId ?? null,
    p_subscription_status: params.subscriptionStatus ?? null,
    p_subscription_period_end: params.subscriptionPeriodEnd ?? null,
  })

  if (error) {
    console.error("[stripe] set_user_subscription failed:", {
      userId: params.userId,
      tier: params.tier,
      message: error.message,
    })
    throw error
  }

  console.info("[stripe] Subscription synced:", {
    userId: params.userId,
    tier: params.tier,
    status: params.subscriptionStatus,
    priceId: params.stripePriceId,
  })
}

export async function downgradeUserToStarter(params: {
  userId: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
}): Promise<void> {
  await syncUserSubscription({
    userId: params.userId,
    tier: "starter",
    stripeCustomerId: params.stripeCustomerId ?? null,
    stripeSubscriptionId: params.stripeSubscriptionId ?? null,
    stripePriceId: null,
    subscriptionStatus: "canceled",
    subscriptionPeriodEnd: null,
  })
}
