import { NextResponse } from "next/server"
import { BYOK_REQUIRED_CODE, BYOK_REQUIRED_MESSAGE } from "@/lib/ai/byok-required"

export const USER_API_KEY_HEADER = "x-user-api-key"

const OPENROUTER_KEY_PATTERN = /^sk-or-v1-[a-zA-Z0-9_-]{20,}$/

export function isValidUserApiKeyFormat(apiKey: string): boolean {
  const trimmed = apiKey.trim()
  return trimmed.length >= 20 && OPENROUTER_KEY_PATTERN.test(trimmed)
}

export function extractUserApiKey(request: Request): string | null {
  const value = request.headers.get(USER_API_KEY_HEADER)?.trim()
  return value || null
}

export function requireUserApiKey(
  request: Request
): { apiKey: string } | NextResponse {
  const apiKey = extractUserApiKey(request)

  if (!apiKey) {
    return NextResponse.json(
      {
        error: BYOK_REQUIRED_MESSAGE,
        code: BYOK_REQUIRED_CODE,
      },
      { status: 401 }
    )
  }

  if (!isValidUserApiKeyFormat(apiKey)) {
    return NextResponse.json(
      {
        error:
          "Invalid OpenRouter API key format. Use a key starting with sk-or-v1-.",
        code: "INVALID_USER_API_KEY",
      },
      { status: 400 }
    )
  }

  return { apiKey }
}
