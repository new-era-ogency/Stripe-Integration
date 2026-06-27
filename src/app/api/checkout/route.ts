import Stripe from "stripe"
import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import { resolveCheckoutPlanFromRequest } from "@/config/plans"
import {
  createSubscriptionCheckoutSession,
  getStripeErrorMessage,
} from "@/lib/stripe/checkout"
import type { SubscriptionTier } from "@/lib/subscription"
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

  const rateLimited = enforceRateLimit(
    `checkout:${user.id}`,
    RATE_LIMITS.checkout,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, checkoutRequestSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const planConfig = resolveCheckoutPlanFromRequest({
      plan: parsed.data.plan,
      tier: parsed.data.tier,
      priceId: parsed.data.priceId,
    })

    if (!planConfig) {
      const requested = parsed.data.priceId
        ? `priceId=${parsed.data.priceId}`
        : `plan=${parsed.data.plan ?? parsed.data.tier ?? "pro"}`

      console.error("[stripe checkout] Plan not configured:", {
        requested,
        userId: user.id,
      })

      return NextResponse.json(
        {
          error: parsed.data.priceId
            ? "This Stripe price is not mapped to a PulseFlow plan."
            : parsed.data.plan === "pro_max" || parsed.data.tier === "pro_max"
              ? "Pro Max checkout is not configured. Set STRIPE_PRICE_PRO_MAX."
              : "Pro checkout is not configured. Set STRIPE_PRICE_PRO in your environment.",
          code: "PLAN_NOT_CONFIGURED",
        },
        { status: 503 }
      )
    }

    const tier: SubscriptionTier = planConfig.tier
    const appUrl = getAppUrl()

    const session = await createSubscriptionCheckoutSession({
      planConfig,
      userId: user.id,
      customerEmail: user.email,
      successUrl: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/pricing?checkout=canceled&plan=${planConfig.id}`,
    })

    if (!session.url) {
      console.error("[stripe checkout] Stripe returned session without URL:", {
        sessionId: session.id,
        userId: user.id,
        planId: planConfig.id,
        tier,
      })

      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      )
    }

    console.info("[stripe checkout] Session created:", {
      sessionId: session.id,
      userId: user.id,
      planId: planConfig.id,
      tier,
      priceId: planConfig.priceId,
      credits: planConfig.credits,
    })

    return NextResponse.json({
      url: session.url,
      plan: planConfig.id,
      tier,
      credits: planConfig.credits,
      priceId: planConfig.priceId,
    })
  } catch (error) {
    console.error("[stripe checkout] Error:", { userId: user.id, error })

    const status =
      error instanceof Stripe.errors.StripeInvalidRequestError ? 400 : 500

    if (status === 400) {
      return NextResponse.json(
        { error: getStripeErrorMessage(error) },
        { status: 400 }
      )
    }

    return internalErrorResponse("stripe-checkout", error, { userId: user.id })
  }
}
