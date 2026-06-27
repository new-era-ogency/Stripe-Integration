import { generateText } from "ai"
import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
import { badRequestResponse } from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { getOpenRouterModel } from "@/lib/ai/openrouter"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { parseThreadChunks } from "@/lib/ai/thread-utils"
import {
  extractYouTubeVideoId,
  trialPreviewRequestSchema,
} from "@/lib/validation"

export const dynamic = "force-dynamic"

const TRIAL_PREVIEW_RATE_LIMIT = {
  limit: 12,
  windowMs: 60 * 60 * 1000,
} as const

const DEMO_THREAD_PROMPT = `${buildSystemPrompt("x", { tier: "starter" })}

Return ONLY a JSON array of 4–5 strings. Each string is one tweet (max 280 characters). No markdown, no commentary.`

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown"
  )
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(
    `trial-preview:${ip}`,
    TRIAL_PREVIEW_RATE_LIMIT
  )

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many preview requests. Try again later or sign up for full access." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    )
  }

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, trialPreviewRequestSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { videoUrl } = parsed.data
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
    })
  } catch (error) {
    console.error("Trial preview error:", error)
    return NextResponse.json(
      { error: "Failed to generate preview thread. Check the URL and try again." },
      { status: 500 }
    )
  }
}
