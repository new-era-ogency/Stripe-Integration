import { createOpenAI } from "@ai-sdk/openai"
import { getSiteUrl } from "@/lib/auth/site-url"
import {
  OPENROUTER_API_BASE_URL,
  PRODUCTION_OPENROUTER_MODEL,
} from "@/lib/ai/models"

export const DEFAULT_OPENROUTER_MODEL = PRODUCTION_OPENROUTER_MODEL

/** Server-only: OpenRouter client using the caller's BYOK key. */
export function getOpenRouterModelForUser(apiKey: string) {
  const openrouter = createOpenAI({
    baseURL: OPENROUTER_API_BASE_URL,
    apiKey,
    headers: {
      "HTTP-Referer": getSiteUrl(),
      "X-Title": "PulseFlow",
    },
  })

  return openrouter(PRODUCTION_OPENROUTER_MODEL)
}
