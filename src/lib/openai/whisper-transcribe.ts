import {
  OpenAiByokError,
  requireStoredOpenAiKey,
} from "@/lib/openai/client-key"
import { assertByokFetchHostAllowed } from "@/lib/api/byok-security"

export const OPENAI_AUDIO_TRANSCRIPTIONS_URL =
  "https://api.openai.com/v1/audio/transcriptions"

export const WHISPER_MAX_FILE_BYTES = 25 * 1024 * 1024

export const WHISPER_ACCEPTED_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".mp4",
  ".m4a",
])

export const WHISPER_ACCEPTED_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "video/mp4",
])

type WhisperResponse = {
  text?: string
}

function assertAllowedWhisperEndpoint(): void {
  try {
    assertByokFetchHostAllowed(OPENAI_AUDIO_TRANSCRIPTIONS_URL)
  } catch {
    throw new OpenAiByokError(
      "Blocked BYOK request to an unsupported provider endpoint.",
      "api_error"
    )
  }
}

function getFileExtension(name: string): string {
  const index = name.lastIndexOf(".")
  return index === -1 ? "" : name.slice(index).toLowerCase()
}

export function validateWhisperUploadFile(file: File): string | null {
  if (file.size > WHISPER_MAX_FILE_BYTES) {
    return "File exceeds the 25MB Whisper limit. Try a shorter clip or lower bitrate."
  }

  const extension = getFileExtension(file.name)
  const mimeOk =
    !file.type || WHISPER_ACCEPTED_MIME_TYPES.has(file.type.toLowerCase())
  const extOk = WHISPER_ACCEPTED_EXTENSIONS.has(extension)

  if (!mimeOk && !extOk) {
    return "Unsupported file type. Upload mp3, wav, mp4, or m4a."
  }

  return null
}

async function parseWhisperErrorMessage(response: Response): Promise<string> {
  let message = `Whisper returned HTTP ${response.status}.`

  try {
    const body = (await response.json()) as { error?: { message?: string } }
    if (body.error?.message) {
      message = body.error.message
    }
  } catch {
    // Keep HTTP fallback.
  }

  return message
}

/** Client-side BYOK Whisper transcription — key goes directly to OpenAI. */
export async function transcribeAudioWithWhisper(file: File): Promise<string> {
  const validationError = validateWhisperUploadFile(file)
  if (validationError) {
    throw new OpenAiByokError(validationError, "api_error")
  }

  const apiKey = requireStoredOpenAiKey()
  assertAllowedWhisperEndpoint()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("model", "whisper-1")

  try {
    const response = await fetch(OPENAI_AUDIO_TRANSCRIPTIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const message = await parseWhisperErrorMessage(response)

      if (response.status === 401) {
        throw new OpenAiByokError(
          "Your OpenAI API key is invalid. Please update it in Settings and try again.",
          "invalid_key"
        )
      }

      if (response.status === 429) {
        throw new OpenAiByokError(
          "OpenAI rate limit exceeded or your account has insufficient balance. Please check your OpenAI billing dashboard and try again.",
          "rate_limit"
        )
      }

      throw new OpenAiByokError(message, "api_error")
    }

    const body = (await response.json()) as WhisperResponse
    const text = body.text?.trim()

    if (!text) {
      throw new OpenAiByokError(
        "Whisper returned an empty transcript. Please try another file.",
        "api_error"
      )
    }

    return text
  } catch (error) {
    if (error instanceof OpenAiByokError) {
      throw error
    }

    const message =
      error instanceof Error
        ? error.message
        : "Could not reach the OpenAI Whisper API from this browser."

    throw new OpenAiByokError(message, "network_error")
  }
}
