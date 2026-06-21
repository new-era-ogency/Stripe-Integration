import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { getStripe } from "@/lib/stripe/client"
import { getPlanConfig } from "@/lib/stripe/plans"
import { checkoutRequestSchema } from "@/lib/validation"

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
    const body = await request.json()
    const parsed = parseJsonBody(body, checkoutRequestSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const planConfig = getPlanConfig(parsed.data.plan)
    if (!planConfig) {
      return NextResponse.json(
        { error: "Stripe price is not configured for this plan" },
        { status: 503 }
      )
    }

    const stripe = getStripe()
    const appUrl = getAppUrl()

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata: {
        supabase_user_id: user.id,
        plan: parsed.data.plan,
        credits: String(planConfig.credits),
      },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=canceled`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
