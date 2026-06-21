import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import {
  badRequestResponse,
  isErrorResponse,
  paymentRequiredResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import {
  parseProContentPack,
  proPackToLegacyFields,
} from "@/lib/ai/content-pack"
import { getOpenRouterModel } from "@/lib/ai/openrouter"
import { buildGenerationPrompts } from "@/lib/ai/prompts"
import { INSUFFICIENT_CREDITS_MESSAGE } from "@/lib/credits"
import type { GeneratedContent } from "@/lib/generations"
import { saveUserGeneration } from "@/lib/generations"
import { isProTier } from "@/lib/profile"
import { parseJsonBody } from "@/lib/api/parse-body"
import {
  extractYouTubeVideoId,
  generateContentRequestSchema,
} from "@/lib/validation"

async function generateStarterContent(
  model: ReturnType<ReturnType<typeof createOpenAI>>,
  prompts: Extract<ReturnType<typeof buildGenerationPrompts>, { mode: "starter" }>,
  rawTranscript: string
): Promise<GeneratedContent> {
  const [outputX, outputLinkedIn, outputTelegram] = await Promise.all([
    generateText({
      model,
      system: prompts.twitter,
      prompt: rawTranscript,
      maxOutputTokens: 2000,
    }).then((result) => result.text),
    generateText({
      model,
      system: prompts.linkedin,
      prompt: rawTranscript,
      maxOutputTokens: 2000,
    }).then((result) => result.text),
    generateText({
      model,
      system: prompts.telegram,
      prompt: rawTranscript,
      maxOutputTokens: 2000,
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
  model: ReturnType<ReturnType<typeof createOpenAI>>,
  prompts: Extract<ReturnType<typeof buildGenerationPrompts>, { mode: "pro" }>,
  rawTranscript: string
): Promise<GeneratedContent> {
  const { text } = await generateText({
    model,
    system: prompts.system,
    prompt: rawTranscript,
    maxOutputTokens: 6000,
  })

  const pack = parseProContentPack(text)
  const fields = proPackToLegacyFields(pack)

  return {
    packTier: "pro",
    ...fields,
  }
}

export async function POST(request: Request) {
  // Identity is resolved exclusively from the Supabase session cookie — never
  // from request body fields such as userId or email.
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    const body = await request.json()
    const parsed = parseJsonBody(body, generateContentRequestSchema)
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
      .select("credits, tier, brand_voice")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching user credits:", profileError)
      return NextResponse.json(
        { error: "Failed to verify credit balance" },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const isPro = isProTier(profile.tier)

    if (profile.credits <= 0 && !isPro) {
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
      tier: profile.tier,
      brand_voice: profile.brand_voice,
    })

    const model = getOpenRouterModel()

    const generatedContent =
      prompts.mode === "pro"
        ? await generateProContent(model, prompts, rawTranscript)
        : await generateStarterContent(model, prompts, rawTranscript)

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
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
