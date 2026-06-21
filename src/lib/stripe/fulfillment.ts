import type Stripe from "stripe"
import {
  checkoutSessionQualifiesForCredits,
  parseCreditsFromMetadata,
} from "@/lib/stripe/checkout"
import { getStripe } from "@/lib/stripe/client"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

const STARTER_CREDITS = 20

export async function grantCreditsFromStripeEvent(params: {
  eventId: string
  eventType: string
  userId: string
  credits: number
}): Promise<boolean> {
  const supabase = createAdminSupabaseClient()

  const { data: rpcGranted, error: rpcError } = await supabase.rpc(
    "grant_credits_from_checkout",
    {
      p_event_id: params.eventId,
      p_event_type: params.eventType,
      p_user_id: params.userId,
      p_credits: params.credits,
    }
  )

  if (!rpcError) {
    if (rpcGranted === true) {
      await upgradeUserToPro(params.userId)
    }
    return rpcGranted === true
  }

  const rpcMissing =
    rpcError.message.includes("Could not find the function") ||
    rpcError.message.includes("grant_credits_from_checkout")

  if (!rpcMissing) {
    throw rpcError
  }

  console.warn(
    "grant_credits_from_checkout RPC missing — using admin fallback. Apply supabase/migrations/20250621000000_stripe_webhooks.sql"
  )

  return grantCreditsAdminFallback(params)
}

async function grantCreditsAdminFallback(params: {
  eventId: string
  eventType: string
  userId: string
  credits: number
}): Promise<boolean> {
  const supabase = createAdminSupabaseClient()

  const { error: eventInsertError } = await supabase
    .from("stripe_events")
    .insert({ id: params.eventId, type: params.eventType })

  if (eventInsertError) {
    if (eventInsertError.code === "23505") {
      return false
    }

    const tableMissing =
      eventInsertError.code === "42P01" ||
      eventInsertError.message.includes("stripe_events")

    if (!tableMissing) {
      throw eventInsertError
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", params.userId)
    .maybeSingle()

  if (profileError) {
    throw profileError
  }

  if (!profile) {
    const { error: insertError } = await supabase.from("users").insert({
      id: params.userId,
      credits: params.credits,
      tier: "pro",
    })

    if (insertError) {
      throw insertError
    }

    return true
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ credits: profile.credits + params.credits, tier: "pro" })
    .eq("id", params.userId)

  if (updateError) {
    throw updateError
  }

  return true
}

async function upgradeUserToPro(userId: string) {
  const supabase = createAdminSupabaseClient()
  const { error } = await supabase.rpc("upgrade_user_to_pro", {
    p_user_id: userId,
  })

  if (error) {
    await supabase.from("users").update({ tier: "pro" }).eq("id", userId)
  }
}

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (!checkoutSessionQualifiesForCredits(session)) {
    return { fulfilled: false as const, reason: "payment_incomplete" as const }
  }

  let userId: string
  let credits: number

  try {
    ;({ userId, credits } = parseCreditsFromMetadata(
      session.metadata,
      `session ${session.id}`
    ))
  } catch {
    if (!session.client_reference_id) {
      throw new Error(`Missing credit metadata for session ${session.id}`)
    }

    userId = session.client_reference_id
    credits = STARTER_CREDITS
  }

  const granted = await grantCreditsFromStripeEvent({
    eventId: `checkout_session_${session.id}`,
    eventType: "checkout.session.completed",
    userId,
    credits,
  })

  return { fulfilled: true as const, granted, credits, userId }
}

export async function fulfillPaidInvoice(invoice: Stripe.Invoice) {
  if (invoice.status !== "paid") {
    return { fulfilled: false as const, reason: "not_paid" as const }
  }

  const billingReason = invoice.billing_reason
  if (
    billingReason !== "subscription_create" &&
    billingReason !== "subscription_cycle"
  ) {
    return { fulfilled: false as const, reason: "ignored_billing_reason" as const }
  }

  const stripe = getStripe()
  const subscriptionRef = getInvoiceSubscriptionId(invoice)

  if (!subscriptionRef || typeof subscriptionRef !== "string") {
    return { fulfilled: false as const, reason: "no_subscription" as const }
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionRef)
  const { userId, credits } = parseCreditsFromMetadata(
    subscription.metadata,
    `subscription ${subscription.id}`
  )

  const granted = await grantCreditsFromStripeEvent({
    eventId: `invoice_${invoice.id}`,
    eventType: "invoice.paid",
    userId,
    credits,
  })

  return { fulfilled: true as const, granted, credits, userId }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = invoice as Stripe.Invoice & {
    parent?: { subscription_details?: { subscription?: string | null } }
    subscription?: string | Stripe.Subscription | null
  }

  const fromParent = parent.parent?.subscription_details?.subscription
  if (typeof fromParent === "string") {
    return fromParent
  }

  if (typeof parent.subscription === "string") {
    return parent.subscription
  }

  return null
}

export async function confirmCheckoutSessionForUser(
  sessionId: string,
  authenticatedUserId: string
) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  const sessionUserId =
    session.metadata?.supabase_user_id ?? session.client_reference_id

  if (sessionUserId !== authenticatedUserId) {
    throw new Error("Checkout session does not belong to this user")
  }

  return fulfillCheckoutSession(session)
}
