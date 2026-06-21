import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
import {
  badRequestResponse,
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import {
  extractYouTubeVideoId,
  transcriptRequestSchema,
} from "@/lib/validation"

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, transcriptRequestSchema)
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
    console.error("Error fetching transcript:", error)
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    )
  }
}
