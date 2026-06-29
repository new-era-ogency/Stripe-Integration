import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
import {
  badRequestResponse,
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit } from "@/lib/api/security"
import {
  extractYouTubeVideoId,
  transcriptRequestSchema,
} from "@/lib/validation"

const TRANSCRIPT_EXTRACTION_ERROR =
  "Failed to extract YouTube transcript. Please ensure the video has captions enabled or try pasting the raw text instead."

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

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    const rawTranscript = transcript.map((item) => item.text).join(" ").trim()

    if (!rawTranscript) {
      return NextResponse.json({ error: TRANSCRIPT_EXTRACTION_ERROR }, { status: 422 })
    }

    if (rawTranscript.length > 500_000) {
      return badRequestResponse("Transcript exceeds maximum length")
    }

    return NextResponse.json({ rawTranscript })
  } catch (error) {
    console.error("YouTube parse error:", error)

    return NextResponse.json(
      { error: TRANSCRIPT_EXTRACTION_ERROR },
      { status: 422 }
    )
  }
}
