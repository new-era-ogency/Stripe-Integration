import { isProMaxTier, isProTier, normalizeBrandVoice } from "@/lib/profile"
import type { SubscriptionTier } from "@/lib/subscription"

const BASE_PROMPTS = {
  x: "You are a viral content strategist and expert at transforming video transcripts into aggressive, catchy, viral-ready Twitter/X thread content. Convert the provided transcript into a high-impact thread with a strong hook, punchy lines, and a clear call-to-action. Output only the final thread text.",
  linkedin:
    "You are a LinkedIn thought leader and expert at transforming video transcripts into aggressive, catchy, viral-ready long-form LinkedIn posts. Convert the provided transcript into a professional yet engaging post with a compelling hook, structured insights, and a clear call-to-action. Output only the final post text.",
  telegram:
    "You are a Telegram channel guru, creating aggressive, catchy, viral-ready Telegram articles from video transcripts. Convert the provided transcript into a conversational, scannable channel post with bold hooks and high energy. Output only the final article text.",
} as const

export type PlatformPromptKey = keyof typeof BASE_PROMPTS

export type GenerationPromptConfig =
  | {
      mode: "starter"
      tier: "starter"
      twitter: string
      linkedin: string
      telegram: string
    }
  | {
      mode: "pro"
      tier: "pro"
      system: string
    }
  | {
      mode: "pro_max"
      tier: "pro_max"
      system: string
    }

const PRO_JSON_SCHEMA = `{
  "twitterThread": ["tweet 1", "tweet 2", "tweet 3", "tweet 4", "tweet 5"],
  "linkedinArticle": "Full LinkedIn article with markdown headings and hashtags",
  "telegramPost": "Structured Telegram channel post",
  "shortsScript": {
    "hook": "Opening hook for short-form video",
    "body": "Main script body",
    "cta": "Closing call-to-action"
  }
}`

const PRO_MAX_VIRAL_HOOKS_SCHEMA = `"viralShortsHooks": [
    {
      "timestampStart": "MM:SS",
      "timestampEnd": "MM:SS",
      "hookScore": 92,
      "hook": "One-line viral hook for this clip",
      "script": "Full ready-to-speak Shorts script for this timestamp window",
      "shotList": ["Visual shot suggestion 1", "B-roll idea 2", "On-screen text idea 3"]
    }
  ]`

const PRO_MAX_JSON_SCHEMA = `{
  "twitterThread": ["tweet 1", "tweet 2", "tweet 3", "tweet 4", "tweet 5"],
  "linkedinArticle": "Full LinkedIn article with markdown headings and hashtags",
  "telegramPost": "Structured Telegram channel post",
  "shortsScript": {
    "hook": "Opening hook for short-form video",
    "body": "Main script body",
    "cta": "Closing call-to-action"
  },
  ${PRO_MAX_VIRAL_HOOKS_SCHEMA}
}`

function appendBrandVoice(basePrompt: string, brandVoice: string | null): string {
  if (!brandVoice) {
    return basePrompt
  }

  return `${basePrompt}

Apply this custom brand voice and persona for every sentence you write:
${brandVoice}`
}

export function buildSystemPrompt(
  platform: PlatformPromptKey,
  options: { tier?: string | null; brandVoice?: string | null }
): string {
  const basePrompt = BASE_PROMPTS[platform]
  const voice = normalizeBrandVoice(options.brandVoice)

  if (!isProTier(options.tier) || !voice) {
    return basePrompt
  }

  return appendBrandVoice(basePrompt, voice)
}

function buildProDeepPackPrompt(brandVoice: string | null): string {
  const voiceBlock = brandVoice
    ? `\n\nApply this custom brand voice and persona across every field:\n${brandVoice}`
    : ""

  return `You are PulseFlow's Deep Content Pack engine for Pro creators. Transform the provided video transcript into a comprehensive multi-platform content package.

Return ONLY valid JSON — no markdown fences, no commentary — matching this exact shape:
${PRO_JSON_SCHEMA}

Field requirements:
- twitterThread: Exactly 4–5 connected tweets. Each tweet must stand alone, stay under 280 characters, and flow as a viral thread with a strong hook in tweet 1 and a CTA in the final tweet.
- linkedinArticle: A deep, professional long-form article (800–1200 words). Use markdown headings (##), short paragraphs, bullet points where helpful, and end with 3–5 relevant hashtags on their own line.
- telegramPost: A structured channel post with a bold opening line, scannable sections separated by line breaks, emoji used sparingly for emphasis, and a clear CTA at the end.
- shortsScript: A hook-driven short-form video script derived from the video context. hook = attention-grabbing opener (1–2 sentences). body = core value delivery (3–5 sentences). cta = specific next step (1 sentence).${voiceBlock}`
}

function buildProMaxDeepPackPrompt(brandVoice: string | null): string {
  const voiceBlock = brandVoice
    ? `\n\nApply this custom brand voice and persona across every field:\n${brandVoice}`
    : ""

  return `You are PulseFlow's Pro Max AI Content Factory. Transform the provided video transcript into a Deep Text Pack PLUS a Viral Shorts Finder analysis.

Return ONLY valid JSON — no markdown fences, no commentary — matching this exact shape:
${PRO_MAX_JSON_SCHEMA}

Deep Content Pack requirements (same as Pro):
- twitterThread: Exactly 4–5 connected tweets under 280 characters each.
- linkedinArticle: Deep long-form article (800–1200 words) with markdown headings and hashtags.
- telegramPost: Structured, scannable Telegram channel post with a bold hook and CTA.
- shortsScript: General hook/body/cta script for the full video.

Viral Shorts Extractor (Pro Max exclusive):
Analyze the transcript and identify 3–6 high-virality clip windows. For each window in viralShortsHooks:
- timestampStart / timestampEnd: Estimated MM:SS timestamps based on transcript flow (best-effort if exact timing is unknown).
- hookScore: Integer 0–100 rating viral potential (controversy, curiosity, emotion, novelty).
- hook: One killer opening line for the clip.
- script: Full ready-to-speak Shorts script (30–60 seconds when spoken) for that exact window.
- shotList: 3–5 concrete visual shot / B-roll / on-screen text suggestions.

Sort viralShortsHooks by hookScore descending.${voiceBlock}`
}

export function buildGenerationPrompts(profile: {
  tier?: string | null
  brand_voice?: string | null
}): GenerationPromptConfig {
  const brandVoice = normalizeBrandVoice(profile.brand_voice)
  const tier = (profile.tier ?? "starter") as SubscriptionTier

  if (isProMaxTier(tier)) {
    return {
      mode: "pro_max",
      tier: "pro_max",
      system: buildProMaxDeepPackPrompt(brandVoice),
    }
  }

  if (isProTier(tier)) {
    return {
      mode: "pro",
      tier: "pro",
      system: buildProDeepPackPrompt(brandVoice),
    }
  }

  const options = {
    tier: profile.tier,
    brandVoice: profile.brand_voice,
  }

  return {
    mode: "starter",
    tier: "starter",
    twitter: buildSystemPrompt("x", options),
    linkedin: buildSystemPrompt("linkedin", options),
    telegram: buildSystemPrompt("telegram", options),
  }
}
