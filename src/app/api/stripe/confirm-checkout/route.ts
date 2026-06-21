import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { confirmCheckoutSessionForUser } from "@/lib/stripe/fulfillment"
import { z } from "zod"

export const runtime = "nodejs"

const confirmCheckoutSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
})

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, confirmCheckoutSchema)
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const result = await confirmCheckoutSessionForUser(
      parsed.data.sessionId,
      auth.user.id
    )

    if (!result.fulfilled) {
      return NextResponse.json(
        { error: "Payment is not complete yet. Credits will apply shortly." },
        { status: 409 }
      )
    }

    const { data: profile } = await auth.supabase
      .from("users")
      .select("credits")
      .eq("id", auth.user.id)
      .maybeSingle()

    return NextResponse.json({
      granted: result.granted,
      creditsAdded: result.credits,
      credits: profile?.credits ?? null,
      alreadyProcessed: !result.granted,
    })
  } catch (error) {
    console.error("Confirm checkout error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to confirm checkout",
      },
      { status: 500 }
    )
  }
}
