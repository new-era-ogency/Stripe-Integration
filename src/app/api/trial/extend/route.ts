import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { extendUserTrial } from "@/lib/trial/extend-trial"
import { trialExtendSchema } from "@/lib/trial/validation"

const TRIAL_EXTEND_RATE_LIMIT = {
  limit: 10,
  windowMs: 15 * 60 * 1000,
} as const

function isRpcBusinessError(message: string): boolean {
  return (
    message.includes("already claimed") ||
    message.includes("Paid users cannot extend trial") ||
    message.includes("Maximum trial extension") ||
    message.includes("Days granted must be") ||
    message.includes("Action type is required") ||
    message.includes("User id is required") ||
    message.includes("User not found")
  )
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message
    return typeof message === "string" ? message : null
  }

  return null
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user } = auth

  const rateLimit = checkRateLimit(
    `trial-extend:${user.id}`,
    TRIAL_EXTEND_RATE_LIMIT
  )

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    )
  }

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, trialExtendSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { actionType } = parsed.data
    const result = await extendUserTrial(user.id, actionType)

    return NextResponse.json({
      success: true,
      message: "Trial extended successfully",
      actionType: result.actionType,
      trialEndAt: result.trialEndAt,
      daysGranted: result.daysGranted,
    })
  } catch (error) {
    const message = getErrorMessage(error)

    if (message) {
      if (isRpcBusinessError(message)) {
        return NextResponse.json({ error: message }, { status: 400 })
      }

      console.error("Trial extend RPC error:", error)
      return NextResponse.json({ error: message }, { status: 400 })
    }

    console.error("Trial extend error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
