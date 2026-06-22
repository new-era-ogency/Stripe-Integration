import Stripe from "stripe"
import { getStripe } from "@/lib/stripe/client"
import type { SubscriptionPlanConfig } from "@/config/plans"
import type { SubscriptionTier } from "@/lib/subscription"

export type CheckoutMetadata = {
  supabase_user_id: string
  tier: SubscriptionTier
  plan: string
  credits: string
}

export async function createSubscriptionCheckoutSession(params: {
  planConfig: SubscriptionPlanConfig
  userId: string
  customerEmail?: string | null
  successUrl: string
  cancelUrl: string
}) {
  const stripe = getStripe()
  const price = await stripe.prices.retrieve(params.planConfig.priceId)

  if (!price.active) {
    throw new Error(
      `Stripe price ${params.planConfig.priceId} is inactive. Activate it in the Stripe Dashboard.`
    )
  }

  if (price.type !== "recurring") {
    throw new Error(
      `${params.planConfig.envVar} must be a recurring subscription price.`
    )
  }

  const metadata: CheckoutMetadata = {
    supabase_user_id: params.userId,
    tier: params.planConfig.tier,
    plan: params.planConfig.id,
    credits: String(params.planConfig.credits),
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: params.planConfig.priceId, quantity: 1 }],
    client_reference_id: params.userId,
    customer_email: params.customerEmail ?? undefined,
    metadata,
    subscription_data: {
      metadata,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })
}

/** @deprecated Use createSubscriptionCheckoutSession */
export async function createStarterCheckoutSession(params: {
  planConfig: { priceId: string; credits: number }
  userId: string
  customerEmail?: string | null
  successUrl: string
  cancelUrl: string
}) {
  return createSubscriptionCheckoutSession({
    planConfig: {
      id: "pro",
      tier: "pro",
      name: "Pro",
      envVar: "STRIPE_PRICE_STARTER",
      priceId: params.planConfig.priceId,
      credits: params.planConfig.credits,
    },
    userId: params.userId,
    customerEmail: params.customerEmail,
    successUrl: params.successUrl,
    cancelUrl: params.cancelUrl,
  })
}

export function getStripeErrorMessage(error: unknown): string {
  if (error instanceof Stripe.errors.StripeError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Failed to create checkout session"
}

export function checkoutSessionQualifiesForCredits(
  session: Stripe.Checkout.Session
): boolean {
  if (session.payment_status === "paid") {
    return true
  }

  if (session.mode === "subscription" && session.status === "complete") {
    return session.payment_status !== "unpaid"
  }

  return false
}

export function parseCreditsFromMetadata(
  metadata: Stripe.Metadata | null | undefined,
  sourceId: string
): { userId: string; credits: number; tier: SubscriptionTier | null; plan: string | null } {
  const userId = metadata?.supabase_user_id?.trim()
  const creditsRaw = metadata?.credits
  const tier = metadata?.tier
  const plan = metadata?.plan

  if (!userId || !creditsRaw) {
    throw new Error(`Missing credit metadata for ${sourceId}`)
  }

  const credits = Number.parseInt(creditsRaw, 10)
  if (!Number.isFinite(credits) || credits <= 0) {
    throw new Error(`Invalid credits metadata for ${sourceId}`)
  }

  const normalizedTier =
    tier === "pro" || tier === "pro_max"
      ? tier
      : tier === "starter"
        ? "starter"
        : null

  return {
    userId,
    credits,
    tier: normalizedTier,
    plan: plan ?? null,
  }
}
