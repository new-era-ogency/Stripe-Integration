import { NextResponse } from "next/server"
import { parseJsonBody } from "@/lib/api/parse-body"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { feedbackRequestSchema } from "@/lib/validation"

export const dynamic = "force-dynamic"

const FEEDBACK_RATE_LIMIT = {
  limit: 8,
  windowMs: 60 * 60 * 1000,
} as const

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown"
  )
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(`feedback:${ip}`, FEEDBACK_RATE_LIMIT)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many feedback submissions. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    )
  }

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, feedbackRequestSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { rating, comment, contact, metadata } = parsed.data
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase.from("user_feedback").insert({
      rating,
      comment,
      contact: contact?.trim() || null,
      metadata: {
        ...metadata,
        ip,
        userAgent: request.headers.get("user-agent") ?? null,
      },
    })

    if (error) {
      console.error("Feedback insert error:", error)
      return NextResponse.json(
        { error: "Failed to save feedback. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
