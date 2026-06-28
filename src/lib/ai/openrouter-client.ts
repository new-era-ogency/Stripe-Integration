import OpenAI from "openai"
import { getSiteUrl } from "@/lib/auth/site-url"

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
export const AGENT_MODEL = "openai/gpt-4o-mini"

/** Server-only OpenRouter client via the official OpenAI SDK. */
export function createOpenRouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  return new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": getSiteUrl(),
      "X-Title": "PulseFlow Agent",
    },
  })
}
