import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/client"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

async function grantCreditsFromSession(event: Stripe.Event, session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return
  }

  const userId = session.metadata?.supabase_user_id
  const creditsRaw = session.metadata?.credits

  if (!userId || !creditsRaw) {
    throw new Error(`Missing checkout metadata for session ${session.id}`)
  }

  const credits = Number.parseInt(creditsRaw, 10)
  if (!Number.isFinite(credits) || credits <= 0) {
    throw new Error(`Invalid credits metadata for session ${session.id}`)
  }

  const supabase = createAdminSupabaseClient()
  const { data: granted, error } = await supabase.rpc("grant_credits_from_checkout", {
    p_event_id: event.id,
    p_event_type: event.type,
    p_user_id: userId,
    p_credits: credits,
  })

  if (error) {
    throw error
  }

  if (granted === false) {
    console.info("Stripe event already processed:", event.id)
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const body = await request.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await grantCreditsFromSession(
          event,
          event.data.object as Stripe.Checkout.Session
        )
        break
      default:
        break
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
