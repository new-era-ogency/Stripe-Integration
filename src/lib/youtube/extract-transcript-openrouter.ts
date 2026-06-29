import {
  buildOpenRouterByokHeaders,
  OpenAiByokError,
  OPENROUTER_CHAT_COMPLETIONS_URL,
  requireStoredOpenAiKey,
} from "@/lib/openai/client-key"
import { assertByokFetchHostAllowed } from "@/lib/api/byok-security"

/** Web-enabled OpenRouter model for YouTube transcript extraction (BYOK). */
export const BYOK_YOUTUBE_TRANSCRIPT_MODEL = "google/gemini-2.5-flash:online"

const MIN_TRANSCRIPT_LENGTH = 40

const TRANSCRIPT_SYSTEM_PROMPT = `You extract spoken content from YouTube videos for downstream social copy generation.
Return ONLY the transcript as plain text — no markdown, bullet lists, timestamps, or commentary.
Prefer verbatim captions when available. If only partial captions exist, reconstruct the full spoken content faithfully.
If captions are unavailable, produce a dense continuous summary of everything said in the video (not a meta description).`

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
  error?: {
    message?: string
  }
}

function parseOpenRouterError(response: Response, body: OpenRouterChatResponse): string {
  if (body.error?.message) {
    return body.error.message
  }

  return `OpenRouter returned HTTP ${response.status}.`
}

/**
 * Client-side BYOK fallback when server transcript scrapers are blocked (e.g. Vercel IPs).
 * Uses the user's OpenRouter key with a web-enabled model.
 */
export async function extractYouTubeTranscriptViaOpenRouter(
  videoUrl: string,
  videoTitle?: string
): Promise<string> {
  const apiKey = requireStoredOpenAiKey()
  assertByokFetchHostAllowed(OPENROUTER_CHAT_COMPLETIONS_URL)

  const titleHint = videoTitle ? `\nVideo title: ${videoTitle}` : ""

  try {
    const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: buildOpenRouterByokHeaders(apiKey),
      body: JSON.stringify({
        model: BYOK_YOUTUBE_TRANSCRIPT_MODEL,
        plugins: [{ id: "web", max_results: 5 }],
        messages: [
          { role: "system", content: TRANSCRIPT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Extract the full spoken transcript (or faithful reconstruction) from this YouTube video:\n${videoUrl}${titleHint}`,
          },
        ],
        max_tokens: 12_000,
        temperature: 0.1,
      }),
    })

    const body = (await response.json()) as OpenRouterChatResponse

    if (!response.ok) {
      const message = parseOpenRouterError(response, body)

      if (response.status === 401) {
        throw new OpenAiByokError(
          "Your OpenRouter API key is invalid. Please update it in Settings and try again.",
          "invalid_key"
        )
      }

      if (response.status === 429) {
        throw new OpenAiByokError(
          "OpenRouter rate limit exceeded or your account has insufficient balance. Please check your OpenRouter credits and try again.",
          "rate_limit"
        )
      }

      throw new OpenAiByokError(message, "api_error")
    }

    const rawTranscript = body.choices?.[0]?.message?.content?.trim()

    if (!rawTranscript || rawTranscript.length < MIN_TRANSCRIPT_LENGTH) {
      throw new OpenAiByokError(
        "OpenRouter could not extract enough transcript text from this video. Paste the raw text manually or try another source.",
        "api_error"
      )
    }

    return rawTranscript
  } catch (error) {
    if (error instanceof OpenAiByokError) {
      throw error
    }

    const message =
      error instanceof Error
        ? error.message
        : "Could not reach OpenRouter for transcript extraction."

    throw new OpenAiByokError(message, "network_error")
  }
}
