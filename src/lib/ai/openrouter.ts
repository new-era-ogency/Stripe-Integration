import { createOpenAI } from "@ai-sdk/openai"
import { getSiteUrl } from "@/lib/auth/site-url"

export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini"

/** Server-only OpenRouter client. Never import this from client components. */
export function getOpenRouterModel(modelId = DEFAULT_OPENROUTER_MODEL) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": getSiteUrl(),
      "X-Title": "PulseFlow",
    },
  })

  return openrouter(modelId)
}
