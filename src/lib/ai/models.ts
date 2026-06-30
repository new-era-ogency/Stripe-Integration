/** PulseFlow production model on OpenRouter (free tier). */
export const PRODUCTION_OPENROUTER_MODEL =
  "nvidia/nemotron-3-ultra-550b-a55b:free" as const

export const OPENROUTER_API_BASE_URL = "https://openrouter.ai/api/v1"

/** OpenRouter free tier: 20 requests/minute per API key. */
export const OPENROUTER_FREE_TIER_REQUESTS_PER_MINUTE = 20
