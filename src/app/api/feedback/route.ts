import { NextResponse } from "next/server"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import {
  enforceRateLimit,
  getClientIp,
  internalErrorResponse,
  sanitizeFeedbackMetadata,
} from "@/lib/api/security"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { feedbackRequestSchema } from "@/lib/validation"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimited = enforceRateLimit(`feedback:${ip}`, RATE_LIMITS.feedback, {
    ip,
  })

  if (rateLimited) {
    return rateLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, feedbackRequestSchema)

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
        ...sanitizeFeedbackMetadata(metadata),
        ip,
        userAgent: (request.headers.get("user-agent") ?? "").slice(0, 500),
      },
    })

    if (error) {
      return internalErrorResponse("feedback", error, { ip })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return internalErrorResponse("feedback", error, { ip })
  }
}
