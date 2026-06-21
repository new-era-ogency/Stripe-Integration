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

export const checkoutRequestSchema = z.object({
  plan: z.enum(["starter", "pro"], {
    errorMap: () => ({ message: "Plan must be starter or pro" }),
  }),
})

export type TranscriptRequest = z.infer<typeof transcriptRequestSchema>
export type GenerateContentRequest = z.infer<typeof generateContentRequestSchema>
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
