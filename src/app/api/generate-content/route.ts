import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import {
  badRequestResponse,
  isErrorResponse,
  requireAuthenticatedUser,
} from "@/lib/api/auth"
import { parseJsonBody } from "@/lib/api/parse-body"
import {
  extractYouTubeVideoId,
  generateContentRequestSchema,
} from "@/lib/validation"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: Request) {
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

    const twitterPrompt =
      "You are a viral content strategist and expert at transforming video transcripts into aggressive, catchy, viral-ready Twitter/X thread content. Convert the provided transcript into a high-impact thread with a strong hook, punchy lines, and a clear call-to-action. Output only the final thread text."

    const linkedinPrompt =
      "You are a LinkedIn thought leader and expert at transforming video transcripts into aggressive, catchy, viral-ready long-form LinkedIn posts. Convert the provided transcript into a professional yet engaging post with a compelling hook, structured insights, and a clear call-to-action. Output only the final post text."

    const telegramPrompt =
      "You are a Telegram channel guru, creating aggressive, catchy, viral-ready Telegram articles from video transcripts. Convert the provided transcript into a conversational, scannable channel post with bold hooks and high energy. Output only the final article text."

    const model = openrouter("anthropic/claude-3.5-sonnet")

    const [outputX, outputLinkedIn, outputTelegram] = await Promise.all([
      generateText({
        model,
        system: twitterPrompt,
        prompt: rawTranscript,
        maxOutputTokens: 2000,
      }).then((result) => result.text),
      generateText({
        model,
        system: linkedinPrompt,
        prompt: rawTranscript,
        maxOutputTokens: 2000,
      }).then((result) => result.text),
      generateText({
        model,
        system: telegramPrompt,
        prompt: rawTranscript,
        maxOutputTokens: 2000,
      }).then((result) => result.text),
    ])

    const { error: dbError } = await supabase.from("generations").insert({
      user_id: user.id,
      video_url: sanitizedVideoUrl,
      raw_transcript: rawTranscript,
      output_x: outputX,
      output_linkedin: outputLinkedIn,
      output_telegram: outputTelegram,
    })

    if (dbError) {
      console.error("Error inserting generation record:", dbError)
      return NextResponse.json(
        { error: "Failed to save generation record" },
        { status: 500 }
      )
    }

    return NextResponse.json({ outputX, outputLinkedIn, outputTelegram })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
