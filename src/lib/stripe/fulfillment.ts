import type Stripe from "stripe"
import {
  getMonthlyCreditsForTier,
  resolvePlanFromPriceId,
} from "@/config/plans"
import {
  checkoutSessionQualifiesForCredits,
  parseCreditsFromMetadata,
} from "@/lib/stripe/checkout"
import { getStripe } from "@/lib/stripe/client"
import {
  buildSyncParamsFromSubscription,
  downgradeUserToStarter,
  getPrimaryPriceIdFromSubscription,
  getSubscriptionPeriodEndIso,
  getUserIdFromStripeMetadata,
  syncUserSubscription,
} from "@/lib/stripe/subscription-sync"
import type { SubscriptionTier } from "@/lib/subscription"
import { normalizeSubscriptionStatus } from "@/lib/subscription"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

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
    return rpcGranted === true
  }

  const rpcMissing =
    rpcError.message.includes("Could not find the function") ||
    rpcError.message.includes("grant_credits_from_checkout")

  if (!rpcMissing) {
    console.error("[stripe] grant_credits_from_checkout RPC error:", rpcError)
    throw rpcError
  }

  console.warn(
    "[stripe] grant_credits_from_checkout RPC missing — using admin fallback"
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
    })

    if (insertError) {
      throw insertError
    }

    return true
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ credits: profile.credits + params.credits })
    .eq("id", params.userId)

  if (updateError) {
    throw updateError
  }

  return true
}

async function retrieveCheckoutSubscription(
  session: Stripe.Checkout.Session
): Promise<Stripe.Subscription | null> {
  const subscriptionRef = session.subscription

  if (!subscriptionRef) {
    return null
  }

  const stripe = getStripe()
  const subscriptionId =
    typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id

  return stripe.subscriptions.retrieve(subscriptionId)
}

function resolveTierForCheckoutSession(params: {
  session: Stripe.Checkout.Session
  metadataTier: SubscriptionTier | null
  subscription: Stripe.Subscription | null
}): SubscriptionTier {
  if (params.subscription) {
    const priceId = getPrimaryPriceIdFromSubscription(params.subscription)
    const plan = resolvePlanFromPriceId(priceId)
    if (plan) {
      return plan.tier
    }
  }

  if (params.metadataTier === "pro" || params.metadataTier === "pro_max") {
    return params.metadataTier
  }

  if (params.subscription) {
    const syncParams = buildSyncParamsFromSubscription(params.subscription)
    if (syncParams) {
      return syncParams.tier
    }
  }

  console.warn(
    `[stripe] Could not resolve tier for checkout session ${params.session.id} — defaulting to pro`
  )

  return "pro"
}

function resolveRenewalCredits(params: {
  stripePriceId: string | null
  tier: SubscriptionTier
  subscription: Stripe.Subscription
}): number {
  const fromPrice = resolvePlanFromPriceId(params.stripePriceId)
  if (fromPrice) {
    return fromPrice.credits
  }

  try {
    const parsed = parseCreditsFromMetadata(
      params.subscription.metadata,
      `subscription ${params.subscription.id}`
    )
    return parsed.credits
  } catch {
    return getMonthlyCreditsForTier(params.tier)
  }
}

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (!checkoutSessionQualifiesForCredits(session)) {
    console.info(
      `[stripe] checkout.session.completed skipped — payment incomplete (session ${session.id})`
    )
    return { fulfilled: false as const, reason: "payment_incomplete" as const }
  }

  const stripe = getStripe()
  let subscription = await retrieveCheckoutSubscription(session)

  let userId: string
  let credits: number
  let metadataTier: SubscriptionTier | null = null

  try {
    const parsed = parseCreditsFromMetadata(
      session.metadata,
      `session ${session.id}`
    )
    userId = parsed.userId
    credits = parsed.credits
    metadataTier = parsed.tier
  } catch (metadataError) {
    if (!session.client_reference_id) {
      console.error(
        `[stripe] checkout.session.completed missing metadata (session ${session.id})`,
        metadataError
      )
      throw metadataError
    }

    userId = session.client_reference_id

    if (subscription) {
      const priceId = getPrimaryPriceIdFromSubscription(subscription)
      const plan = resolvePlanFromPriceId(priceId)
      credits = plan?.credits ?? getMonthlyCreditsForTier(plan?.tier ?? "pro")
      metadataTier = plan?.tier ?? "pro"
    } else {
      credits = getMonthlyCreditsForTier("pro")
      metadataTier = "pro"
    }

    console.warn(
      `[stripe] checkout.session.completed using fallback metadata for session ${session.id}`
    )
  }

  if (!subscription && session.mode === "subscription") {
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["subscription"],
    })
    subscription = await retrieveCheckoutSubscription(expanded)
  }

  const tier = resolveTierForCheckoutSession({
    session,
    metadataTier,
    subscription,
  })

  const granted = await grantCreditsFromStripeEvent({
    eventId: `checkout_session_${session.id}`,
    eventType: "checkout.session.completed",
    userId,
    credits,
  })

  if (subscription) {
    const syncParams = buildSyncParamsFromSubscription(subscription)
    if (syncParams) {
      await syncUserSubscription({ ...syncParams, tier })
    } else {
      await syncUserSubscription({
        userId,
        tier,
        stripeCustomerId:
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null,
        stripeSubscriptionId: subscription.id,
        stripePriceId: getPrimaryPriceIdFromSubscription(subscription),
        subscriptionStatus: normalizeSubscriptionStatus(subscription.status),
        subscriptionPeriodEnd: getSubscriptionPeriodEndIso(subscription),
      })
    }
  } else {
    await syncUserSubscription({
      userId,
      tier,
      stripeCustomerId:
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null,
      subscriptionStatus: "active",
    })
  }

  console.info("[stripe] checkout.session.completed fulfilled:", {
    sessionId: session.id,
    userId,
    tier,
    credits,
    granted,
  })

  return { fulfilled: true as const, granted, credits, userId, tier }
}

export async function fulfillPaidInvoice(invoice: Stripe.Invoice) {
  if (invoice.status !== "paid") {
    return { fulfilled: false as const, reason: "not_paid" as const }
  }

  const billingReason = invoice.billing_reason

  if (billingReason !== "subscription_create" && billingReason !== "subscription_cycle") {
    console.info(
      `[stripe] invoice.paid ignored — billing_reason=${billingReason ?? "none"} (invoice ${invoice.id})`
    )
    return { fulfilled: false as const, reason: "ignored_billing_reason" as const }
  }

  const stripe = getStripe()
  const subscriptionRef = getInvoiceSubscriptionId(invoice)

  if (!subscriptionRef) {
    console.error(`[stripe] invoice.paid missing subscription (invoice ${invoice.id})`)
    return { fulfilled: false as const, reason: "no_subscription" as const }
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionRef)
  const syncParams = buildSyncParamsFromSubscription(subscription)

  if (!syncParams) {
    return { fulfilled: false as const, reason: "missing_user_metadata" as const }
  }

  await syncUserSubscription(syncParams)

  if (billingReason === "subscription_create") {
    console.info(
      `[stripe] invoice.paid subscription_create — credits handled by checkout (invoice ${invoice.id})`
    )
    return {
      fulfilled: true as const,
      granted: false,
      credits: 0,
      userId: syncParams.userId,
      tier: syncParams.tier,
      reason: "initial_invoice_sync_only" as const,
    }
  }

  const credits = resolveRenewalCredits({
    stripePriceId: syncParams.stripePriceId ?? null,
    tier: syncParams.tier,
    subscription,
  })

  const granted = await grantCreditsFromStripeEvent({
    eventId: `invoice_${invoice.id}`,
    eventType: "invoice.paid",
    userId: syncParams.userId,
    credits,
  })

  console.info("[stripe] invoice.paid renewal fulfilled:", {
    invoiceId: invoice.id,
    userId: syncParams.userId,
    tier: syncParams.tier,
    credits,
    granted,
  })

  return {
    fulfilled: true as const,
    granted,
    credits,
    userId: syncParams.userId,
    tier: syncParams.tier,
  }
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const syncParams = buildSyncParamsFromSubscription(subscription)

  if (!syncParams) {
    return { handled: false as const, reason: "missing_user_metadata" as const }
  }

  await syncUserSubscription(syncParams)

  console.info("[stripe] customer.subscription.updated:", {
    subscriptionId: subscription.id,
    userId: syncParams.userId,
    tier: syncParams.tier,
    status: syncParams.subscriptionStatus,
    priceId: syncParams.stripePriceId,
  })

  return {
    handled: true as const,
    userId: syncParams.userId,
    tier: syncParams.tier,
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const userId = getUserIdFromStripeMetadata(subscription.metadata)

  if (!userId) {
    console.error(
      `[stripe] customer.subscription.deleted missing supabase_user_id (subscription ${subscription.id})`
    )
    return { handled: false as const, reason: "missing_user_metadata" as const }
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null

  await downgradeUserToStarter({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
  })

  console.info("[stripe] customer.subscription.deleted — downgraded to starter:", {
    subscriptionId: subscription.id,
    userId,
  })

  return { handled: true as const, userId }
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
