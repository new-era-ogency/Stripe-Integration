import type { SupabaseClient } from "@supabase/supabase-js"
import type { ShortsScript } from "@/lib/ai/content-pack"

export type GeneratedContent = {
  packTier?: "starter" | "pro"
  outputX: string
  outputLinkedIn: string
  outputTelegram: string
  twitterThread?: string[]
  linkedinArticle?: string
  telegramPost?: string
  shortsScript?: ShortsScript
  rawTranscript?: string
}

export type GenerationRecord = {
  id: string
  user_id: string
  youtube_url: string
  generated_content: GeneratedContent
  created_at: string
}

/** Legacy shape used by the dashboard until Step 2 UI refresh. */
export type GenerationHistoryItem = {
  id: string
  video_url: string
  created_at: string
  output_x: string
  output_linkedin: string
  output_telegram: string
}

export function toGenerationHistoryItem(
  record: GenerationRecord
): GenerationHistoryItem {
  return {
    id: record.id,
    video_url: record.youtube_url,
    created_at: record.created_at,
    output_x: record.generated_content.outputX,
    output_linkedin: record.generated_content.outputLinkedIn,
    output_telegram: record.generated_content.outputTelegram,
  }
}

export async function getUserGenerations(
  supabase: SupabaseClient,
  userId: string
): Promise<GenerationRecord[]> {
  const { data, error } = await supabase
    .from("generations")
    .select("id, user_id, youtube_url, generated_content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as GenerationRecord[]
}

export async function saveUserGeneration(
  supabase: SupabaseClient,
  params: {
    userId: string
    youtubeUrl: string
    generatedContent: GeneratedContent
  }
): Promise<GenerationRecord> {
  const { data, error } = await supabase
    .from("generations")
    .insert({
      user_id: params.userId,
      youtube_url: params.youtubeUrl,
      generated_content: params.generatedContent,
    })
    .select("id, user_id, youtube_url, generated_content, created_at")
    .single()

  if (error) {
    throw error
  }

  return data as GenerationRecord
}
