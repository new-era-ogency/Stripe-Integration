import { NextResponse } from "next/server"
import {
  handleStripeWebhookEvent,
  verifyStripeWebhook,
} from "@/lib/stripe/webhook-handlers"

export const runtime = "nodejs"

/**
 * Canonical Stripe webhook endpoint.
 * Configure in Stripe Dashboard: POST /api/webhook/stripe
 *
 * Events handled:
 * - checkout.session.completed
 * - invoice.paid
 * - customer.subscription.updated
 * - customer.subscription.deleted
 */
export async function POST(request: Request) {
  let eventId: string | undefined
  let eventType: string | undefined

  try {
    const event = await verifyStripeWebhook(request)
    eventId = event.id
    eventType = event.type

    await handleStripeWebhookEvent(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[stripe webhook] handler failed:", {
      eventId,
      eventType,
      error,
    })

    if (error instanceof Error) {
      if (error.message.includes("STRIPE_WEBHOOK_SECRET")) {
        return NextResponse.json(
          { error: "Webhook not configured" },
          { status: 500 }
        )
      }

      if (error.message.includes("stripe-signature")) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
