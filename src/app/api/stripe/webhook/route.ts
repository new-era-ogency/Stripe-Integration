import { NextResponse } from "next/server"
import {
  handleStripeWebhookEvent,
  verifyStripeWebhook,
} from "@/lib/stripe/webhook-handlers"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const event = await verifyStripeWebhook(request)
    await handleStripeWebhookEvent(event)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)

    if (error instanceof Error) {
      if (error.message.includes("STRIPE_WEBHOOK_SECRET")) {
        return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
      }
      if (error.message.includes("stripe-signature")) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
