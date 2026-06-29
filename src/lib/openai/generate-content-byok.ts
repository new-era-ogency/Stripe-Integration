import {
  parseProContentPack,
  parseProMaxContentPack,
  proMaxPackToLegacyFields,
  proPackToLegacyFields,
} from "@/lib/ai/content-pack"
import { buildGenerationPrompts } from "@/lib/ai/prompts"
import type { GeneratedContent } from "@/lib/generations"
import type { UserTier } from "@/lib/profile"
import {
  DEFAULT_BYOK_MODEL,
  fetchOpenAiChatCompletion,
} from "@/lib/openai/client-key"
import {
  getGenerationLimitsForTier,
  normalizeSubscriptionTier,
} from "@/lib/subscription"

export type GenerateContentByokParams = {
  rawTranscript: string
  tier: UserTier
  brandVoice: string | null
}

async function generateStarterContentByok(
  prompts: Extract<
    ReturnType<typeof buildGenerationPrompts>,
    { mode: "starter" }
  >,
  rawTranscript: string,
  maxOutputTokens: number
): Promise<GeneratedContent> {
  const model = DEFAULT_BYOK_MODEL

  const [twitter, linkedin, telegram] = await Promise.all([
    fetchOpenAiChatCompletion({
      model,
      max_tokens: maxOutputTokens,
      messages: [
        { role: "system", content: prompts.twitter },
        { role: "user", content: rawTranscript },
      ],
    }),
    fetchOpenAiChatCompletion({
      model,
      max_tokens: maxOutputTokens,
      messages: [
        { role: "system", content: prompts.linkedin },
        { role: "user", content: rawTranscript },
      ],
    }),
    fetchOpenAiChatCompletion({
      model,
      max_tokens: maxOutputTokens,
      messages: [
        { role: "system", content: prompts.telegram },
        { role: "user", content: rawTranscript },
      ],
    }),
  ])

  return {
    packTier: "starter",
    outputX: twitter.content,
    outputLinkedIn: linkedin.content,
    outputTelegram: telegram.content,
  }
}

async function generateProContentByok(
  prompts: Extract<ReturnType<typeof buildGenerationPrompts>, { mode: "pro" }>,
  rawTranscript: string,
  maxOutputTokens: number
): Promise<GeneratedContent> {
  const result = await fetchOpenAiChatCompletion({
    model: getGenerationLimitsForTier("pro").modelId,
    max_tokens: maxOutputTokens,
    messages: [
      { role: "system", content: prompts.system },
      { role: "user", content: rawTranscript },
    ],
  })

  const pack = parseProContentPack(result.content)

  return {
    packTier: "pro",
    ...proPackToLegacyFields(pack),
  }
}

async function generateProMaxContentByok(
  prompts: Extract<
    ReturnType<typeof buildGenerationPrompts>,
    { mode: "pro_max" }
  >,
  rawTranscript: string,
  maxOutputTokens: number
): Promise<GeneratedContent> {
  const result = await fetchOpenAiChatCompletion({
    model: getGenerationLimitsForTier("pro_max").modelId,
    max_tokens: maxOutputTokens,
    messages: [
      { role: "system", content: prompts.system },
      { role: "user", content: rawTranscript },
    ],
  })

  const pack = parseProMaxContentPack(result.content)

  return proMaxPackToLegacyFields(pack)
}

/** Client-side BYOK generation — calls OpenRouter directly using the user's stored key. */
export async function generateContentByok(
  params: GenerateContentByokParams
): Promise<GeneratedContent> {
  const normalizedTier = normalizeSubscriptionTier(params.tier)
  const limits = getGenerationLimitsForTier(normalizedTier)
  const prompts = buildGenerationPrompts({
    tier: normalizedTier,
    brand_voice: params.brandVoice,
  })

  if (prompts.mode === "pro_max") {
    return generateProMaxContentByok(
      prompts,
      params.rawTranscript,
      limits.maxOutputTokens
    )
  }

  if (prompts.mode === "pro") {
    return generateProContentByok(
      prompts,
      params.rawTranscript,
      limits.maxOutputTokens
    )
  }

  return generateStarterContentByok(
    prompts,
    params.rawTranscript,
    limits.starterMaxOutputTokens
  )
}
