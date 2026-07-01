import type {
  ContentSourceInput,
  ResolvedTranscript,
  TranscriptResolvePhase,
} from "@/lib/content-sources/types"
import {
  fetchWithSignal,
  rethrowIfAborted,
  throwIfAborted,
} from "@/lib/generation/abort"
import { transcribeAudioWithWhisper } from "@/lib/openai/whisper-transcribe"
import { extractYouTubeTranscriptViaOpenRouter } from "@/lib/youtube/extract-transcript-openrouter"
import { TRANSCRIPT_OPENROUTER_FALLBACK_CODE } from "@/lib/youtube/transcript-constants"
import { extractYouTubeVideoId } from "@/lib/validation"

const MIN_TEXT_LENGTH = 40

function assertMinTextLength(text: string, label: string): string {
  const trimmed = text.trim()

  if (trimmed.length < MIN_TEXT_LENGTH) {
    throw new Error(`${label} must be at least ${MIN_TEXT_LENGTH} characters.`)
  }

  return trimmed
}

function htmlToPlainText(html: string): string {
  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  }

  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.body.textContent?.replace(/\s+/g, " ").trim() ?? ""
}

async function fetchYouTubeTranscript(
  videoUrl: string,
  options?: {
    onPhaseChange?: (phase: TranscriptResolvePhase) => void
    signal?: AbortSignal
  }
): Promise<string> {
  throwIfAborted(options?.signal)

  const response = await fetchWithSignal("/api/transcript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrl }),
    signal: options?.signal,
  })

  const data = (await response.json().catch(() => ({}))) as {
    rawTranscript?: string
    error?: string
    code?: string
    canonicalUrl?: string
    videoTitle?: string
  }

  if (response.ok) {
    const rawTranscript = data.rawTranscript?.trim()

    if (!rawTranscript) {
      throw new Error("YouTube transcript was empty.")
    }

    return rawTranscript
  }

  if (
    data.code === TRANSCRIPT_OPENROUTER_FALLBACK_CODE ||
    response.status === 422
  ) {
    options?.onPhaseChange?.("openrouter_extract")
    return extractYouTubeTranscriptViaOpenRouter(
      data.canonicalUrl ?? videoUrl,
      data.videoTitle,
      options?.signal
    )
  }

  throw new Error(data.error || "Failed to fetch YouTube transcript")
}

async function fetchArticleTextFromUrl(
  url: string,
  signal?: AbortSignal
): Promise<string> {
  throwIfAborted(signal)

  let parsed: URL

  try {
    parsed = new URL(url.trim())
  } catch {
    throw new Error("Enter a valid article URL.")
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Article URL must use http or https.")
  }

  try {
    const response = await fetchWithSignal(parsed.toString(), {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
      signal,
    })

    if (!response.ok) {
      throw new Error(`Article fetch failed (${response.status}).`)
    }

    const contentType = response.headers.get("content-type") ?? ""

    if (contentType.includes("text/html")) {
      const html = await response.text()
      const text = htmlToPlainText(html)
      return assertMinTextLength(text, "Fetched article text")
    }

    const text = await response.text()
    return assertMinTextLength(text, "Fetched article text")
  } catch (error) {
    rethrowIfAborted(error, signal)

    throw new Error(
      "Could not fetch this article from your browser (CORS blocked). Paste the article text in the field below and try again."
    )
  }
}

function buildYouTubeSourceLabel(url: string): string {
  const videoId = extractYouTubeVideoId(url)
  return videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : url.trim()
}

export type ResolveTranscriptOptions = {
  onPhaseChange?: (phase: TranscriptResolvePhase) => void
  signal?: AbortSignal
}

export async function resolveTranscriptFromSource(
  source: ContentSourceInput,
  options?: ResolveTranscriptOptions
): Promise<ResolvedTranscript> {
  throwIfAborted(options?.signal)

  switch (source.type) {
    case "youtube": {
      options?.onPhaseChange?.("fetching")
      const rawTranscript = await fetchYouTubeTranscript(source.url, options)
      return {
        rawTranscript,
        sourceLabel: buildYouTubeSourceLabel(source.url),
      }
    }

    case "text": {
      const rawTranscript = assertMinTextLength(source.rawText, "Source text")
      return {
        rawTranscript,
        sourceLabel: "text:input",
      }
    }

    case "article": {
      const pasted = source.pastedText.trim()

      if (pasted) {
        return {
          rawTranscript: assertMinTextLength(pasted, "Article text"),
          sourceLabel: source.url.trim() || "article:pasted",
        }
      }

      if (!source.url.trim()) {
        throw new Error(
          "Paste the article text or enter a URL you can fetch from this browser."
        )
      }

      options?.onPhaseChange?.("fetching")
      const rawTranscript = await fetchArticleTextFromUrl(
        source.url,
        options?.signal
      )

      return {
        rawTranscript,
        sourceLabel: source.url.trim(),
      }
    }

    case "media": {
      options?.onPhaseChange?.("transcribing")
      try {
        const rawTranscript = await transcribeAudioWithWhisper(
          source.file,
          options?.signal
        )
        return {
          rawTranscript: assertMinTextLength(rawTranscript, "Transcript"),
          sourceLabel: `media:${source.file.name}`,
        }
      } catch (error) {
        rethrowIfAborted(error, options?.signal)
        throw error
      }
    }

    default: {
      const _exhaustive: never = source
      throw new Error(`Unsupported source type: ${String(_exhaustive)}`)
    }
  }
}
