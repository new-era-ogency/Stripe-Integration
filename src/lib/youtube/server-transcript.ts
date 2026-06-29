import { YoutubeTranscript } from "youtube-transcript"
import TranscriptClient from "youtube-transcript-api"

export type TranscriptExtractionSource =
  | "youtube-transcript"
  | "youtube-transcript-io"

export type ServerTranscriptSuccess = {
  ok: true
  rawTranscript: string
  source: TranscriptExtractionSource
  videoTitle?: string
}

export type ServerTranscriptFailure = {
  ok: false
  reason: "video_unavailable" | "no_captions" | "all_providers_failed"
  videoTitle?: string
}

export type ServerTranscriptResult =
  | ServerTranscriptSuccess
  | ServerTranscriptFailure

type NoembedResponse = {
  title?: string
  author_name?: string
  error?: string
}

type TranscriptIoSegment = {
  text?: string
}

type TranscriptIoTrack = {
  transcript?: TranscriptIoSegment[]
}

type TranscriptIoResponse = {
  title?: string
  tracks?: TranscriptIoTrack[]
  playabilityStatus?: {
    status?: string
    reason?: string
  }
}

let transcriptIoClient: TranscriptClient | null = null
let transcriptIoReady: Promise<void> | null = null

async function getTranscriptIoClient(): Promise<TranscriptClient> {
  if (!transcriptIoClient) {
    transcriptIoClient = new TranscriptClient()
    transcriptIoReady = transcriptIoClient.ready
  }

  await transcriptIoReady
  return transcriptIoClient
}

function joinTranscriptSegments(segments: TranscriptIoSegment[]): string {
  return segments
    .map((segment) => segment.text?.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

async function fetchViaYoutubeTranscript(videoId: string): Promise<string | null> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    const rawTranscript = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()

    return rawTranscript || null
  } catch (error) {
    console.warn("YouTube transcript provider failed (youtube-transcript):", error)
    return null
  }
}

async function fetchViaTranscriptIo(
  videoId: string
): Promise<{ rawTranscript: string; videoTitle?: string } | null> {
  try {
    const client = await getTranscriptIoClient()
    const response = (await client.getTranscript(videoId)) as TranscriptIoResponse

    const status = response.playabilityStatus?.status
    const reason = response.playabilityStatus?.reason?.toLowerCase() ?? ""

    if (status === "LOGIN_REQUIRED" || reason.includes("not found")) {
      return null
    }

    const rawTranscript = joinTranscriptSegments(
      (response.tracks ?? []).flatMap((track) => track.transcript ?? [])
    )

    if (!rawTranscript) {
      return null
    }

    return {
      rawTranscript,
      videoTitle: response.title,
    }
  } catch (error) {
    console.warn(
      "YouTube transcript provider failed (youtube-transcript-io):",
      error
    )
    return null
  }
}

/** Validates the video exists via noembed (oEmbed) — does not return captions. */
export async function fetchYouTubeVideoMetadata(
  canonicalUrl: string
): Promise<{ title?: string; authorName?: string } | null> {
  try {
    const response = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(canonicalUrl)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return null
    }

    const body = (await response.json()) as NoembedResponse

    if (body.error) {
      return null
    }

    return {
      title: body.title,
      authorName: body.author_name,
    }
  } catch (error) {
    console.warn("YouTube metadata lookup failed (noembed):", error)
    return null
  }
}

export async function fetchYouTubeTranscriptServer(
  canonicalUrl: string,
  videoId: string
): Promise<ServerTranscriptResult> {
  const metadata = await fetchYouTubeVideoMetadata(canonicalUrl)

  if (!metadata) {
    return { ok: false, reason: "video_unavailable" }
  }

  const primaryTranscript = await fetchViaYoutubeTranscript(videoId)

  if (primaryTranscript) {
    return {
      ok: true,
      rawTranscript: primaryTranscript,
      source: "youtube-transcript",
      videoTitle: metadata.title,
    }
  }

  const secondary = await fetchViaTranscriptIo(videoId)

  if (secondary?.rawTranscript) {
    return {
      ok: true,
      rawTranscript: secondary.rawTranscript,
      source: "youtube-transcript-io",
      videoTitle: secondary.videoTitle ?? metadata.title,
    }
  }

  return {
    ok: false,
    reason: "all_providers_failed",
    videoTitle: metadata.title,
  }
}
