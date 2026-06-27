import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
import {
  badRequestResponse,
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
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

  try {
    const parsed = await parseRequestJsonBody(request, transcriptRequestSchema)

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

    if (rawTranscript.length > 500_000) {
      return badRequestResponse("Transcript exceeds maximum length")
    }

    return NextResponse.json({ rawTranscript })
  } catch (error) {
    return internalErrorResponse("transcript", error, { userId: user.id })
  }
}
