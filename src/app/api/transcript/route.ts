import { NextResponse } from "next/server"
import {
  badRequestResponse,
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit } from "@/lib/api/security"
import { fetchYouTubeTranscriptServer } from "@/lib/youtube/server-transcript"
import {
  TRANSCRIPT_EXTRACTION_ERROR,
  TRANSCRIPT_OPENROUTER_FALLBACK_CODE,
} from "@/lib/youtube/transcript-constants"
import {
  extractYouTubeVideoId,
  transcriptRequestSchema,
} from "@/lib/validation"

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user } = auth

  const rateLimited = enforceRateLimit(
    `transcript:${user.id}`,
    RATE_LIMITS.transcript,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  const parsed = await parseRequestJsonBody(request, transcriptRequestSchema)

  if (parsed instanceof NextResponse) {
    return parsed
  }

  const { videoUrl } = parsed.data
  const videoId = extractYouTubeVideoId(videoUrl)

  if (!videoId) {
    return badRequestResponse("Invalid YouTube video ID")
  }

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`

  try {
    const result = await fetchYouTubeTranscriptServer(canonicalUrl, videoId)

    if (result.ok) {
      if (result.rawTranscript.length > 500_000) {
        return badRequestResponse("Transcript exceeds maximum length")
      }

      return NextResponse.json({
        rawTranscript: result.rawTranscript,
        source: result.source,
        videoTitle: result.videoTitle,
      })
    }

    if (result.reason === "video_unavailable") {
      return badRequestResponse("YouTube video not found or unavailable")
    }

    console.error("YouTube parse error: all server transcript providers failed", {
      videoId,
      reason: result.reason,
      videoTitle: result.videoTitle,
    })

    return NextResponse.json(
      {
        error: TRANSCRIPT_EXTRACTION_ERROR,
        code: TRANSCRIPT_OPENROUTER_FALLBACK_CODE,
        videoUrl,
        canonicalUrl,
        videoTitle: result.videoTitle,
        hint: "Server transcript fetch was blocked. Your browser can retry extraction via your connected OpenRouter key.",
      },
      { status: 422 }
    )
  } catch (error) {
    console.error("YouTube parse error:", error)

    return NextResponse.json(
      {
        error: TRANSCRIPT_EXTRACTION_ERROR,
        code: TRANSCRIPT_OPENROUTER_FALLBACK_CODE,
        videoUrl,
        canonicalUrl,
        hint: "Server transcript fetch failed unexpectedly. Your browser can retry extraction via your connected OpenRouter key.",
      },
      { status: 422 }
    )
  }
}
