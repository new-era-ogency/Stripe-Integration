import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"

export async function POST() {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  const rateLimited = enforceRateLimit(
    `deduct-credit:${user.id}`,
    RATE_LIMITS.deductCredit,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const { data, error } = await supabase.rpc("deduct_credit")

    if (error) {
      return internalErrorResponse("deduct-credit", error, { userId: user.id })
    }

    const result = data[0]

    if (!result.success) {
      const status =
        result.message === "Unauthorized."
          ? 401
          : result.message === "Insufficient credits."
            ? 402
            : 400

      return NextResponse.json(
        {
          error:
            status === 402
              ? "Insufficient credits."
              : status === 401
                ? "Unauthorized."
                : "Unable to deduct credit.",
        },
        { status }
      )
    }

    return NextResponse.json({ newCredits: result.new_credits })
  } catch (error) {
    return internalErrorResponse("deduct-credit", error, { userId: user.id })
  }
}
