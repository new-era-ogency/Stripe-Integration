import { z } from "zod"

const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

const ALLOWED_YOUTUBE_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "youtu.be",
])

export const youtubeUrlSchema = z
  .string()
  .trim()
  .min(1, "Video URL is required")
  .max(2048, "Video URL is too long")
  .refine(
    (value) => {
      try {
        const url = new URL(value)
        return url.protocol === "https:" || url.protocol === "http:"
      } catch {
        return false
      }
    },
    { message: "Invalid URL format" }
  )
  .refine(
    (value) => {
      try {
        const url = new URL(value)
        return ALLOWED_YOUTUBE_HOSTS.has(url.hostname)
      } catch {
        return false
      }
    },
    { message: "URL must be a YouTube link" }
  )

export function extractYouTubeVideoId(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl)

    if (!ALLOWED_YOUTUBE_HOSTS.has(url.hostname)) {
      return null
    }

    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0]
      return YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null
    }

    if (url.pathname.startsWith("/embed/")) {
      const id = url.pathname.split("/")[2]
      return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null
    }

    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2]
      return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null
    }

    const vParam = url.searchParams.get("v")
    if (vParam && YOUTUBE_VIDEO_ID_REGEX.test(vParam)) {
      return vParam
    }

    return null
  } catch {
    return null
  }
}

export const transcriptRequestSchema = z.object({
  videoUrl: youtubeUrlSchema,
})

export const generateContentRequestSchema = z.object({
  videoUrl: youtubeUrlSchema,
  rawTranscript: z
    .string()
    .trim()
    .min(1, "Transcript is required")
    .max(500_000, "Transcript exceeds maximum length"),
})

export const checkoutRequestSchema = z
  .object({
    plan: z.enum(["pro", "pro_max", "starter"]).optional(),
    tier: z.enum(["pro", "pro_max"]).optional(),
    priceId: z
      .string()
      .trim()
      .regex(/^price_/, "priceId must be a Stripe price_... ID")
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.plan && !value.tier && !value.priceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide plan, tier, or priceId",
        path: ["plan"],
      })
    }
  })
  .transform((value) => ({
    plan: value.plan,
    tier: value.tier,
    priceId: value.priceId,
  }))

export const ensureProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z][a-z0-9_]{2,19}$/,
      "Username must be 3–20 characters: start with a letter, then letters, numbers, or underscores."
    )
    .optional(),
})

export const telegramChannelIdSchema = z
  .string()
  .trim()
  .min(3, "Channel ID is too short")
  .max(100, "Channel ID is too long")
  .refine(
    (value) => value.startsWith("@") || /^-?\d+$/.test(value),
    "Use @channelusername or a numeric channel ID (e.g. -1001234567890)"
  )

export const userSettingsSchema = z.object({
  brandVoice: z
    .string()
    .trim()
    .max(4000, "Brand voice must be 4000 characters or less")
    .optional()
    .nullable(),
  tgChannelId: telegramChannelIdSchema.optional().nullable(),
})

export const telegramShareSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Message text is required")
    .max(4096, "Telegram messages cannot exceed 4096 characters"),
})

export type TranscriptRequest = z.infer<typeof transcriptRequestSchema>
export type GenerateContentRequest = z.infer<typeof generateContentRequestSchema>
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
export type UserSettingsRequest = z.infer<typeof userSettingsSchema>
export type TelegramShareRequest = z.infer<typeof telegramShareSchema>
