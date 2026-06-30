import OpenAI from "openai"
import { getSiteUrl } from "@/lib/auth/site-url"
import {
  OPENROUTER_API_BASE_URL,
  PRODUCTION_OPENROUTER_MODEL,
} from "@/lib/ai/models"

export const AGENT_MODEL = PRODUCTION_OPENROUTER_MODEL

/** Server-only OpenRouter client via the official OpenAI SDK (user BYOK key). */
export function createOpenRouterClientForUser(apiKey: string): OpenAI {
  return new OpenAI({
    baseURL: OPENROUTER_API_BASE_URL,
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": getSiteUrl(),
      "X-Title": "PulseFlow Agent",
    },
  })
}
