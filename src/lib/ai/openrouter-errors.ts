import { NextResponse } from "next/server"

export const OPENROUTER_RATE_LIMIT_MESSAGE =
  "AI rate limit reached (20 requests/min on OpenRouter free tier). Please wait and try again."

function extractStatusCode(error: unknown): number | null {
  if (!error || typeof error !== "object") {
    return null
  }

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status
  }

  return null
}

export function isOpenRouterRateLimitError(error: unknown): boolean {
  if (extractStatusCode(error) === 429) {
    return true
  }

  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()

  return (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("429")
  )
}

export function openRouterRateLimitResponse(): NextResponse {
  return NextResponse.json(
    {
      error: OPENROUTER_RATE_LIMIT_MESSAGE,
      code: "OPENROUTER_RATE_LIMIT",
    },
    {
      status: 429,
      headers: { "Retry-After": "60" },
    }
  )
}

export function openRouterErrorResponse(error: unknown): NextResponse | null {
  if (isOpenRouterRateLimitError(error)) {
    return openRouterRateLimitResponse()
  }

  return null
}
