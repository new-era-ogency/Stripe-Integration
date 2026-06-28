import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import {
  badRequestResponse,
  forbiddenResponse,
  isErrorResponse,
  paymentRequiredResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit, internalErrorResponse } from "@/lib/api/security"
import {
  parseProContentPack,
  parseProMaxContentPack,
  proMaxPackToLegacyFields,
  proPackToLegacyFields,
} from "@/lib/ai/content-pack"
import { getOpenRouterModel } from "@/lib/ai/openrouter"
import { buildGenerationPrompts } from "@/lib/ai/prompts"
import { INSUFFICIENT_CREDITS_MESSAGE } from "@/lib/credits"
import type { GeneratedContent } from "@/lib/generations"
import { saveUserGeneration } from "@/lib/generations"
import {
  getGenerationLimitsForTier,
  getSubscriptionFlags,
  normalizeSubscriptionTier,
  requireFeature,
  toSubscriptionRecord,
} from "@/lib/subscription"
import { checkTrialStatus } from "@/lib/trial"
import {
  extractYouTubeVideoId,
  generateContentRequestSchema,
} from "@/lib/validation"

type OpenRouterModel = ReturnType<ReturnType<typeof createOpenAI>>

async function generateStarterContent(
  model: OpenRouterModel,
  prompts: Extract<ReturnType<typeof buildGenerationPrompts>, { mode: "starter" }>,
  rawTranscript: string,
  maxOutputTokens: number
): Promise<GeneratedContent> {
  const [outputX, outputLinkedIn, outputTelegram] = await Promise.all([
    generateText({
      model,
      system: prompts.twitter,
      prompt: rawTranscript,
      maxOutputTokens,
    }).then((result) => result.text),
    generateText({
      model,
      system: prompts.linkedin,
      prompt: rawTranscript,
      maxOutputTokens,
    }).then((result) => result.text),
    generateText({
      model,
      system: prompts.telegram,
      prompt: rawTranscript,
      maxOutputTokens,
    }).then((result) => result.text),
  ])

  return {
    packTier: "starter",
    outputX,
    outputLinkedIn,
    outputTelegram,
  }
}

async function generateProContent(
  model: OpenRouterModel,
  prompts: Extract<ReturnType<typeof buildGenerationPrompts>, { mode: "pro" }>,
  rawTranscript: string,
  maxOutputTokens: number
): Promise<GeneratedContent> {
  const { text } = await generateText({
    model,
    system: prompts.system,
    prompt: rawTranscript,
    maxOutputTokens,
  })

  const pack = parseProContentPack(text)
  const fields = proPackToLegacyFields(pack)

  return {
    packTier: "pro",
    ...fields,
  }
}

async function generateProMaxContent(
  model: OpenRouterModel,
  prompts: Extract<ReturnType<typeof buildGenerationPrompts>, { mode: "pro_max" }>,
  rawTranscript: string,
  maxOutputTokens: number
): Promise<GeneratedContent> {
  const { text } = await generateText({
    model,
    system: prompts.system,
    prompt: rawTranscript,
    maxOutputTokens,
  })

  const pack = parseProMaxContentPack(text)
  return proMaxPackToLegacyFields(pack)
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  const rateLimited = enforceRateLimit(
    `generate-content:${user.id}`,
    RATE_LIMITS.generateContent,
    { userId: user.id }
  )

  if (rateLimited) {
    return rateLimited
  }

  try {
    const trial = await checkTrialStatus(user.id, { supabase })

    if (!trial.isValid && trial.accountStatus === "trial") {
      return NextResponse.json(
        { error: "Trial expired", code: "TRIAL_EXPIRED" },
        { status: 403 }
      )
    }

    const parsed = await parseRequestJsonBody(
      request,
      generateContentRequestSchema,
      { maxBytes: 600_000 }
    )
    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { rawTranscript, videoUrl } = parsed.data
    const videoId = extractYouTubeVideoId(videoUrl)

    if (!videoId) {
      return badRequestResponse("Invalid YouTube video ID")
    }

    const sanitizedVideoUrl = `https://www.youtube.com/watch?v=${videoId}`

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(
        "credits, tier, brand_voice, subscription_status, stripe_price_id, stripe_subscription_id, subscription_period_end"
      )
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return NextResponse.json(
        { error: "Failed to verify subscription and credits" },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const subscription = toSubscriptionRecord(profile)
    const flags = getSubscriptionFlags(
      subscription.tier,
      subscription.subscriptionStatus
    )
    const limits = getGenerationLimitsForTier(flags.tier)
    const deepPackAccess = requireFeature(flags, "deep_pack")
    const viralHooksAccess = requireFeature(flags, "viral_shorts_finder")

    const hasTrialAccess = trial.isValid

    if (profile.credits <= 0 && flags.isStarter && !hasTrialAccess) {
      return paymentRequiredResponse(INSUFFICIENT_CREDITS_MESSAGE)
    }

    let newCredits = profile.credits

    if (profile.credits > 0) {
      const { data: deductData, error: deductError } =
        await supabase.rpc("deduct_credit")

      if (deductError) {
        console.error("Error deducting credit before generation:", deductError)
        return NextResponse.json(
          { error: "Failed to deduct credit" },
          { status: 500 }
        )
      }

      const deductResult = deductData?.[0]
      if (!deductResult?.success) {
        return paymentRequiredResponse(
          deductResult?.message ?? INSUFFICIENT_CREDITS_MESSAGE
        )
      }

      newCredits = deductResult.new_credits
    }

    const prompts = buildGenerationPrompts({
      tier: normalizeSubscriptionTier(profile.tier),
      brand_voice: profile.brand_voice,
    })

    if (prompts.mode !== "starter" && !deepPackAccess.allowed) {
      return forbiddenResponse(
        "Deep Content Pack requires a Pro or Pro Max subscription."
      )
    }

    if (prompts.mode === "pro_max" && !viralHooksAccess.allowed) {
      return forbiddenResponse(
        "Viral Shorts Finder requires a Pro Max subscription."
      )
    }

    const model = getOpenRouterModel(limits.modelId)

    const generatedContent =
      prompts.mode === "pro_max"
        ? await generateProMaxContent(
            model,
            prompts,
            rawTranscript,
            limits.maxOutputTokens
          )
        : prompts.mode === "pro"
          ? await generateProContent(
              model,
              prompts,
              rawTranscript,
              limits.maxOutputTokens
            )
          : await generateStarterContent(
              model,
              prompts,
              rawTranscript,
              limits.starterMaxOutputTokens
            )

    let generation
    try {
      generation = await saveUserGeneration(supabase, {
        userId: user.id,
        youtubeUrl: sanitizedVideoUrl,
        generatedContent: {
          ...generatedContent,
          rawTranscript,
        },
      })
    } catch (saveError) {
      console.error("Error saving generation record:", saveError)
      return NextResponse.json(
        { error: "Generation completed but failed to save history" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...generatedContent,
      newCredits,
      generationId: generation.id,
      tier: flags.tier,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown generation error"

    if (
      message.includes("No endpoints found") ||
      message.includes("OPENROUTER_API_KEY")
    ) {
      console.error("[generate-content] OpenRouter configuration error:", error)
      return NextResponse.json(
        {
          error:
            "AI generation is temporarily unavailable. Please try again shortly.",
          code: "AI_UNAVAILABLE",
        },
        { status: 503 }
      )
    }

    return internalErrorResponse("generate-content", error, { userId: user.id })
  }
}
