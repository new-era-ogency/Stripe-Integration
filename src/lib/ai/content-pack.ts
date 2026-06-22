import { z } from "zod"

export const shortsScriptSchema = z.object({
  hook: z.string(),
  body: z.string(),
  cta: z.string(),
})

export const viralShortsHookSchema = z.object({
  timestampStart: z.string().min(1),
  timestampEnd: z.string().min(1),
  hookScore: z.number().min(0).max(100),
  hook: z.string().min(1),
  script: z.string().min(1),
  shotList: z.array(z.string().min(1)).min(1),
})

export const proContentPackSchema = z.object({
  twitterThread: z.array(z.string()).min(1),
  linkedinArticle: z.string(),
  telegramPost: z.string(),
  shortsScript: shortsScriptSchema,
})

export const proMaxContentPackSchema = proContentPackSchema.extend({
  viralShortsHooks: z.array(viralShortsHookSchema).min(1).max(8),
})

export type ShortsScript = z.infer<typeof shortsScriptSchema>
export type ViralShortsHook = z.infer<typeof viralShortsHookSchema>
export type ProContentPack = z.infer<typeof proContentPackSchema>
export type ProMaxContentPack = z.infer<typeof proMaxContentPackSchema>

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

export function parseProMaxContentPack(raw: string): ProMaxContentPack {
  const json = extractJsonFromModelText(raw)
  return proMaxContentPackSchema.parse(json)
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

export function formatViralShortsHooksForCopy(hooks: ViralShortsHook[]): string {
  return hooks
    .map((item, index) => {
      const shots = item.shotList.map((shot) => `  • ${shot}`).join("\n")
      return [
        `#${index + 1} · ${item.timestampStart} → ${item.timestampEnd} · Hook score ${item.hookScore}/100`,
        "",
        `HOOK: ${item.hook.trim()}`,
        "",
        "SCRIPT:",
        item.script.trim(),
        "",
        "SHOT LIST:",
        shots,
      ].join("\n")
    })
    .join("\n\n---\n\n")
}

function normalizeShortsScript(script: ShortsScript): ShortsScript {
  return {
    hook: script.hook.trim(),
    body: script.body.trim(),
    cta: script.cta.trim(),
  }
}

function normalizeViralHook(hook: ViralShortsHook): ViralShortsHook {
  return {
    timestampStart: hook.timestampStart.trim(),
    timestampEnd: hook.timestampEnd.trim(),
    hookScore: hook.hookScore,
    hook: hook.hook.trim(),
    script: hook.script.trim(),
    shotList: hook.shotList.map((shot) => shot.trim()),
  }
}

export function proPackToLegacyFields(pack: ProContentPack) {
  return {
    outputX: formatTwitterThreadForCopy(pack.twitterThread),
    outputLinkedIn: pack.linkedinArticle.trim(),
    outputTelegram: pack.telegramPost.trim(),
    twitterThread: pack.twitterThread.map((tweet) => tweet.trim()),
    linkedinArticle: pack.linkedinArticle.trim(),
    telegramPost: pack.telegramPost.trim(),
    shortsScript: normalizeShortsScript(pack.shortsScript),
  }
}

export function proMaxPackToLegacyFields(pack: ProMaxContentPack) {
  return {
    ...proPackToLegacyFields(pack),
    packTier: "pro_max" as const,
    viralShortsHooks: pack.viralShortsHooks
      .map(normalizeViralHook)
      .sort((a, b) => b.hookScore - a.hookScore),
  }
}
