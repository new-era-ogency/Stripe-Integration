import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import { checkTrialStatus } from "@/lib/trial"
import { extendUserTrial } from "@/lib/trial/extend-trial"
import { trialExtendSchema } from "@/lib/trial/validation"

const TRIAL_EXTEND_RATE_LIMIT = RATE_LIMITS.trialExtend

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

  const trial = await checkTrialStatus(user.id, { supabase: auth.supabase })

  if (trial.accountStatus === "active") {
    return NextResponse.json(
      { error: "Paid users cannot extend trial" },
      { status: 400 }
    )
  }

  const rateLimited = enforceRateLimit(
    `trial-extend:${user.id}`,
    TRIAL_EXTEND_RATE_LIMIT,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, trialExtendSchema)

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
      return internalErrorResponse("trial-extend", error, { userId: user.id })
    }

    return internalErrorResponse("trial-extend", error, { userId: user.id })
  }
}
