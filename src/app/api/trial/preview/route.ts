import { generateText } from "ai"
import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
import { badRequestResponse } from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import {
  enforceRateLimit,
  getClientIp,
  internalErrorResponse,
} from "@/lib/api/security"
import { getOpenRouterModel } from "@/lib/ai/openrouter"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { parseThreadChunks } from "@/lib/ai/thread-utils"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { checkTrialStatus } from "@/lib/trial"
import { validateClientTrialExpiresAt } from "@/lib/trial/period"
import {
  extractYouTubeVideoId,
  trialPreviewRequestSchema,
} from "@/lib/validation"

export const dynamic = "force-dynamic"

const DEMO_THREAD_PROMPT = `${buildSystemPrompt("x", { tier: "starter" })}

Return ONLY a JSON array of 4–5 strings. Each string is one tweet (max 280 characters). No markdown, no commentary.`

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimited = enforceRateLimit(
    `trial-preview:${ip}`,
    RATE_LIMITS.trialPreview,
    { ip }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, trialPreviewRequestSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { videoUrl, trialExpiresAt } = parsed.data

    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let daysRemaining = 0

    if (user) {
      const trial = await checkTrialStatus(user.id, { supabase })

      if (!trial.isValid && trial.accountStatus !== "active") {
        return NextResponse.json(
          {
            error: "Trial period expired.",
            code: "TRIAL_EXPIRED",
          },
          { status: 403 }
        )
      }

      daysRemaining = trial.daysRemaining
    } else {
      const trialValidation = validateClientTrialExpiresAt(trialExpiresAt)

      if (!trialValidation.ok) {
        return NextResponse.json(
          {
            error: trialValidation.error,
            code: trialValidation.code,
          },
          { status: 403 }
        )
      }

      daysRemaining = trialValidation.daysRemaining
    }

    const videoId = extractYouTubeVideoId(videoUrl)

    if (!videoId) {
      return badRequestResponse("Invalid YouTube video ID")
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    const rawTranscript = transcript.map((item) => item.text).join(" ")

    if (!rawTranscript.trim()) {
      return badRequestResponse("No transcript found for this video")
    }

    const clippedTranscript = rawTranscript.slice(0, 12_000)
    const model = getOpenRouterModel()

    const { text } = await generateText({
      model,
      system: DEMO_THREAD_PROMPT,
      prompt: clippedTranscript,
      maxOutputTokens: 1200,
    })

    const thread = parseThreadChunks(text)

    if (thread.length === 0) {
      return NextResponse.json(
        { error: "Could not parse a thread from the generated output" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      thread,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      daysRemaining,
    })
  } catch (error) {
    return internalErrorResponse("trial-preview", error, { ip })
  }
}
