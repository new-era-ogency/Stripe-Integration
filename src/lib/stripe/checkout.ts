import Stripe from "stripe"
import { getStripe } from "@/lib/stripe/client"
import type { PlanConfig } from "@/config/plans"

export async function createStarterCheckoutSession(params: {
  planConfig: PlanConfig
  userId: string
  customerEmail?: string | null
  successUrl: string
  cancelUrl: string
}) {
  const stripe = getStripe()
  const price = await stripe.prices.retrieve(params.planConfig.priceId)

  if (!price.active) {
    throw new Error(
      "This Stripe price is inactive. Activate it in the Stripe Dashboard or use a new price ID."
    )
  }

  if (price.type !== "recurring") {
    throw new Error(
      "STRIPE_PRICE_STARTER must be a recurring subscription price. Create a monthly price in Stripe."
    )
  }

  const metadata = {
    supabase_user_id: params.userId,
    plan: "starter",
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
): { userId: string; credits: number } {
  const userId = metadata?.supabase_user_id
  const creditsRaw = metadata?.credits

  if (!userId || !creditsRaw) {
    throw new Error(`Missing credit metadata for ${sourceId}`)
  }

  const credits = Number.parseInt(creditsRaw, 10)
  if (!Number.isFinite(credits) || credits <= 0) {
    throw new Error(`Invalid credits metadata for ${sourceId}`)
  }

  return { userId, credits }
}
