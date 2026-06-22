import type Stripe from "stripe"
import {
  fulfillCheckoutSession,
  fulfillPaidInvoice,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "@/lib/stripe/fulfillment"
import { getStripe } from "@/lib/stripe/client"

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  const logPrefix = `[stripe webhook] ${event.type} (${event.id})`

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const result = await fulfillCheckoutSession(session)

      if (!result.fulfilled) {
        console.info(`${logPrefix} skipped:`, result.reason)
        return result
      }

      console.info(`${logPrefix} success:`, {
        userId: result.userId,
        tier: result.tier,
        credits: result.credits,
        granted: result.granted,
      })
      return result
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice
      const result = await fulfillPaidInvoice(invoice)

      if (!result.fulfilled) {
        console.info(`${logPrefix} skipped:`, result.reason)
        return result
      }

      console.info(`${logPrefix} success:`, {
        userId: result.userId,
        tier: result.tier,
        credits: result.credits,
        granted: result.granted,
        reason: "reason" in result ? result.reason : undefined,
      })
      return result
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const result = await handleSubscriptionUpdated(subscription)

      if (!result.handled) {
        console.warn(`${logPrefix} not handled:`, result.reason)
        return result
      }

      console.info(`${logPrefix} success:`, {
        userId: result.userId,
        tier: result.tier,
      })
      return result
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const result = await handleSubscriptionDeleted(subscription)

      if (!result.handled) {
        console.warn(`${logPrefix} not handled:`, result.reason)
        return result
      }

      console.info(`${logPrefix} success:`, { userId: result.userId })
      return result
    }

    default:
      console.debug(`${logPrefix} ignored`)
      return { handled: false as const, reason: "unsupported_event" as const }
  }
}

export async function verifyStripeWebhook(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    throw new Error("Missing stripe-signature header")
  }

  const body = await request.text()
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
