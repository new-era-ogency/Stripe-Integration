"use client"

import { requireUserApiKeyHeaders } from "@/lib/api/byok-request-headers"
import { fetchWithSignal, rethrowIfAborted } from "@/lib/generation/abort"
import type { GeneratedContent } from "@/lib/generations"
import type { UserTier } from "@/lib/profile"
import { OpenAiByokError } from "@/lib/openai/client-key"

export type GenerateContentApiResponse = GeneratedContent & {
  newCredits?: number
  generationId?: string
  tier?: UserTier
  error?: string
  code?: string
}

export async function requestGenerateContent(params: {
  rawTranscript: string
  videoUrl: string
  signal?: AbortSignal
}): Promise<GenerateContentApiResponse> {
  let response: Response

  try {
    response = await fetchWithSignal("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...requireUserApiKeyHeaders(),
      },
      body: JSON.stringify({
        rawTranscript: params.rawTranscript,
        videoUrl: params.videoUrl,
      }),
      signal: params.signal,
    })
  } catch (error) {
    rethrowIfAborted(error, params.signal)

    const message =
      error instanceof Error ? error.message : "Network error during generation"
    throw new OpenAiByokError(message, "network_error")
  }

  const data = (await response.json().catch(() => ({}))) as GenerateContentApiResponse

  if (!response.ok) {
    const message = data.error ?? "Failed to generate content"

    if (response.status === 401 || data.code === "BYOK_REQUIRED") {
      throw new OpenAiByokError(message, "missing_key")
    }

    if (response.status === 400 && data.code === "INVALID_USER_API_KEY") {
      throw new OpenAiByokError(message, "invalid_key")
    }

    if (response.status === 429 || data.code === "OPENROUTER_RATE_LIMIT") {
      throw new OpenAiByokError(message, "rate_limit")
    }

    throw new Error(message)
  }

  return data
}
