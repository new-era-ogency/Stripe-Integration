import type Stripe from "stripe"
import {
  fulfillCheckoutSession,
  fulfillPaidInvoice,
} from "@/lib/stripe/fulfillment"
import { getStripe } from "@/lib/stripe/client"

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session)
      break
    case "invoice.paid":
      await fulfillPaidInvoice(event.data.object as Stripe.Invoice)
      break
    default:
      break
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
