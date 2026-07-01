import type { GeneratedContent } from "@/lib/generations"
import type { GenerateContentApiResponse } from "@/lib/api/generate-content-client"
import type { GenerationRecord } from "@/lib/generations"

export function hasGeneratedContent(content: GeneratedContent): boolean {
  return Boolean(
    content.outputX?.trim() ||
      content.outputLinkedIn?.trim() ||
      content.outputTelegram?.trim() ||
      (content.twitterThread?.length ?? 0) > 0 ||
      content.linkedinArticle?.trim() ||
      content.telegramPost?.trim() ||
      content.shortsScript ||
      (content.viralShortsHooks?.length ?? 0) > 0
  )
}

export function buildGeneratedContentFromApi(
  result: GenerateContentApiResponse,
  rawTranscript: string
): GeneratedContent {
  return {
    packTier: result.packTier,
    outputX: result.outputX ?? "",
    outputLinkedIn: result.outputLinkedIn ?? "",
    outputTelegram: result.outputTelegram ?? "",
    twitterThread: result.twitterThread,
    linkedinArticle: result.linkedinArticle,
    telegramPost: result.telegramPost,
    shortsScript: result.shortsScript,
    viralShortsHooks: result.viralShortsHooks,
    rawTranscript,
  }
}

export function buildOptimisticGenerationRecord(
  userId: string,
  sourceLabel: string,
  rawTranscript: string,
  result: GenerateContentApiResponse
): GenerationRecord | null {
  if (!result.generationId) {
    return null
  }

  return {
    id: result.generationId,
    user_id: userId,
    youtube_url: sourceLabel,
    generated_content: buildGeneratedContentFromApi(result, rawTranscript),
    created_at: new Date().toISOString(),
  }
}

export function prependGenerationRecord(
  records: GenerationRecord[],
  record: GenerationRecord
): GenerationRecord[] {
  if (records.some((item) => item.id === record.id)) {
    return records
  }

  return [record, ...records]
}
