"use client"

import { USER_API_KEY_HEADER } from "@/lib/api/user-api-key"
import {
  OpenAiByokError,
  OPENAI_MISSING_KEY_MESSAGE,
  readStoredOpenAiKey,
} from "@/lib/openai/client-key"

function toHeaderRecord(extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {}

  if (!extra) {
    return headers
  }

  if (extra instanceof Headers) {
    extra.forEach((value, key) => {
      headers[key] = value
    })
    return headers
  }

  if (Array.isArray(extra)) {
    for (const [key, value] of extra) {
      headers[key] = value
    }
    return headers
  }

  return { ...extra }
}

/** Attach the user's OpenRouter key from localStorage when present. */
export function buildUserApiKeyHeaders(
  extra?: HeadersInit
): Record<string, string> {
  const headers = toHeaderRecord(extra)
  const apiKey = readStoredOpenAiKey().trim()

  if (apiKey) {
    headers[USER_API_KEY_HEADER] = apiKey
  }

  return headers
}

/** Require a stored key — throws OpenAiByokError when missing. */
export function requireUserApiKeyHeaders(
  extra?: HeadersInit
): Record<string, string> {
  const apiKey = readStoredOpenAiKey().trim()

  if (!apiKey) {
    throw new OpenAiByokError(OPENAI_MISSING_KEY_MESSAGE, "missing_key")
  }

  return buildUserApiKeyHeaders({
    ...toHeaderRecord(extra),
    [USER_API_KEY_HEADER]: apiKey,
  })
}
