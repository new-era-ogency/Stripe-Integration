import type {
  ContentSourceInput,
  ResolvedTranscript,
  TranscriptResolvePhase,
} from "@/lib/content-sources/types"
import { OpenAiByokError } from "@/lib/openai/client-key"
import { transcribeAudioWithWhisper } from "@/lib/openai/whisper-transcribe"
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

async function fetchYouTubeTranscript(videoUrl: string): Promise<string> {
  const response = await fetch("/api/transcript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrl }),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      error?: string
    }
    throw new Error(errorData.error || "Failed to fetch YouTube transcript")
  }

  const data = (await response.json()) as { rawTranscript?: string }
  const rawTranscript = data.rawTranscript?.trim()

  if (!rawTranscript) {
    throw new Error("YouTube transcript was empty.")
  }

  return rawTranscript
}

async function fetchArticleTextFromUrl(url: string): Promise<string> {
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
    const response = await fetch(parsed.toString(), {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
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
  } catch {
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

export async function resolveTranscriptFromSource(
  source: ContentSourceInput,
  onPhaseChange?: (phase: TranscriptResolvePhase) => void
): Promise<ResolvedTranscript> {
  switch (source.type) {
    case "youtube": {
      onPhaseChange?.("fetching")
      const rawTranscript = await fetchYouTubeTranscript(source.url)
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

      onPhaseChange?.("fetching")
      const rawTranscript = await fetchArticleTextFromUrl(source.url)

      return {
        rawTranscript,
        sourceLabel: source.url.trim(),
      }
    }

    case "media": {
      onPhaseChange?.("transcribing")
      try {
        const rawTranscript = await transcribeAudioWithWhisper(source.file)
        return {
          rawTranscript: assertMinTextLength(rawTranscript, "Transcript"),
          sourceLabel: `media:${source.file.name}`,
        }
      } catch (error) {
        if (error instanceof OpenAiByokError) {
          throw error
        }
        throw error
      }
    }

    default: {
      const _exhaustive: never = source
      throw new Error(`Unsupported source type: ${String(_exhaustive)}`)
    }
  }
}
