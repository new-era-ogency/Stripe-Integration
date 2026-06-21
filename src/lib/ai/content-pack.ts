import { z } from "zod"

export const shortsScriptSchema = z.object({
  hook: z.string(),
  body: z.string(),
  cta: z.string(),
})

export const proContentPackSchema = z.object({
  twitterThread: z.array(z.string()).min(1),
  linkedinArticle: z.string(),
  telegramPost: z.string(),
  shortsScript: shortsScriptSchema,
})

export type ShortsScript = z.infer<typeof shortsScriptSchema>
export type ProContentPack = z.infer<typeof proContentPackSchema>

export function extractJsonFromModelText(raw: string): unknown {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced?.[1]?.trim() ?? trimmed

  const start = candidate.indexOf("{")
  const end = candidate.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not contain JSON")
  }

  return JSON.parse(candidate.slice(start, end + 1))
}

export function parseProContentPack(raw: string): ProContentPack {
  const json = extractJsonFromModelText(raw)
  return proContentPackSchema.parse(json)
}

export function formatTwitterThreadForCopy(tweets: string[]): string {
  return tweets
    .map((tweet, index) => `${index + 1}/${tweets.length}\n${tweet.trim()}`)
    .join("\n\n")
}

export function formatShortsScriptForDisplay(script: ShortsScript): string {
  return [
    "HOOK",
    script.hook.trim(),
    "",
    "BODY",
    script.body.trim(),
    "",
    "CTA",
    script.cta.trim(),
  ].join("\n")
}

export function formatShortsScriptForCopy(script: ShortsScript): string {
  return formatShortsScriptForDisplay(script)
}

export function proPackToLegacyFields(pack: ProContentPack) {
  return {
    outputX: formatTwitterThreadForCopy(pack.twitterThread),
    outputLinkedIn: pack.linkedinArticle.trim(),
    outputTelegram: pack.telegramPost.trim(),
    twitterThread: pack.twitterThread.map((tweet) => tweet.trim()),
    linkedinArticle: pack.linkedinArticle.trim(),
    telegramPost: pack.telegramPost.trim(),
    shortsScript: {
      hook: pack.shortsScript.hook.trim(),
      body: pack.shortsScript.body.trim(),
      cta: pack.shortsScript.cta.trim(),
    },
  }
}
