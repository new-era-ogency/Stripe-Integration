import Stripe from "stripe"
import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { getStarterPlanConfig } from "@/config/plans"
import {
  createStarterCheckoutSession,
  getStripeErrorMessage,
} from "@/lib/stripe/checkout"
import { checkoutRequestSchema } from "@/lib/validation"

export const runtime = "nodejs"

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user } = auth

  try {
    const body = await request.json().catch(() => ({}))
    const parsed = parseJsonBody(body, checkoutRequestSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const planConfig = getStarterPlanConfig()
    if (!planConfig) {
      console.error("Checkout unavailable: STRIPE_PRICE_STARTER is missing or invalid")
      return NextResponse.json(
        {
          error:
            "Checkout is not configured. Set STRIPE_PRICE_STARTER to your €19 Stripe price ID.",
          code: "PLAN_NOT_CONFIGURED",
        },
        { status: 503 }
      )
    }

    const appUrl = getAppUrl()
    const session = await createStarterCheckoutSession({
      planConfig,
      userId: user.id,
      customerEmail: user.email,
      successUrl: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/pricing?checkout=canceled`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    const message = getStripeErrorMessage(error)
    const status =
      error instanceof Stripe.errors.StripeInvalidRequestError ? 400 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
