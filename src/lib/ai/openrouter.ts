import { createOpenAI } from "@ai-sdk/openai"

/** Server-only OpenRouter client. Never import this from client components. */
export function getOpenRouterModel(modelId = "anthropic/claude-3.5-sonnet") {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  })

  return openrouter(modelId)
}
