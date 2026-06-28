/**
 * BYOK client module — API keys live only in browser localStorage and are sent
 * directly to AI provider endpoints. Never import this from server routes.
 */
export const PULSEFLOW_OPENAI_KEY_STORAGE = "pulseflow_openai_key"

export const OPENAI_KEY_CHANGED_EVENT = "pulseflow:openai-key-changed"

export const BYOK_ALLOWED_FETCH_HOSTS = new Set([
  "api.openai.com",
  "api.anthropic.com",
])

export const OPENAI_MISSING_KEY_MESSAGE =
  "Please add your OpenAI API key in Settings to proceed."

export const OPENAI_INVALID_KEY_MESSAGE =
  "Your OpenAI API key is invalid. Please update it in Settings and try again."

export const OPENAI_RATE_LIMIT_MESSAGE =
  "OpenAI rate limit exceeded or your account has insufficient balance. Please check your OpenAI billing dashboard and try again."

const OPENAI_MODELS_URL = "https://api.openai.com/v1/models"
export const OPENAI_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions"

/** OpenAI secret keys — never log or send to PulseFlow servers. */
const OPENAI_KEY_STORAGE_PATTERN = /^sk-(?:proj-)?[a-zA-Z0-9_-]{10,}$/

export function isValidOpenAiKeyFormat(apiKey: string): boolean {
  const trimmed = apiKey.trim()
  return trimmed.length >= 20 && OPENAI_KEY_STORAGE_PATTERN.test(trimmed)
}

export type OpenAiByokErrorCode =
  | "missing_key"
  | "invalid_key"
  | "rate_limit"
  | "api_error"
  | "network_error"

export class OpenAiByokError extends Error {
  readonly code: OpenAiByokErrorCode

  constructor(message: string, code: OpenAiByokErrorCode) {
    super(message)
    this.name = "OpenAiByokError"
    this.code = code
  }
}

export type OpenAiKeyValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export type OpenAiChatRole = "system" | "user" | "assistant"

export type OpenAiChatMessage = {
  role: OpenAiChatRole
  content: string
}

export type OpenAiChatCompletionRequest = {
  messages: OpenAiChatMessage[]
  model?: string
  max_tokens?: number
  temperature?: number
}

export type OpenAiChatCompletionResult = {
  content: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  } | null
}

type OpenAiErrorBody = {
  error?: {
    message?: string
    type?: string
    code?: string
  }
}

type OpenAiChatCompletionResponse = {
  model?: string
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

export function readStoredOpenAiKey(): string {
  if (typeof window === "undefined") {
    return ""
  }

  return window.localStorage.getItem(PULSEFLOW_OPENAI_KEY_STORAGE)?.trim() ?? ""
}

export function requireStoredOpenAiKey(): string {
  assertByokClientEnvironment()

  const apiKey = readStoredOpenAiKey()

  if (!apiKey) {
    throw new OpenAiByokError(OPENAI_MISSING_KEY_MESSAGE, "missing_key")
  }

  return apiKey
}

function assertByokClientEnvironment(): void {
  if (typeof window === "undefined") {
    throw new OpenAiByokError(
      "BYOK requests must run in the browser.",
      "api_error"
    )
  }
}

function assertAllowedByokEndpoint(url: string): void {
  const hostname = new URL(url).hostname
  if (!BYOK_ALLOWED_FETCH_HOSTS.has(hostname)) {
    throw new OpenAiByokError(
      "Blocked BYOK request to an unsupported provider endpoint.",
      "api_error"
    )
  }
}

export function writeStoredOpenAiKey(apiKey: string): void {
  if (typeof window === "undefined") {
    return
  }

  const trimmed = apiKey.trim()

  if (!trimmed) {
    window.localStorage.removeItem(PULSEFLOW_OPENAI_KEY_STORAGE)
    window.dispatchEvent(new CustomEvent(OPENAI_KEY_CHANGED_EVENT))
    return
  }

  if (!isValidOpenAiKeyFormat(trimmed)) {
    return
  }

  window.localStorage.setItem(PULSEFLOW_OPENAI_KEY_STORAGE, trimmed)
  window.dispatchEvent(new CustomEvent(OPENAI_KEY_CHANGED_EVENT))
}

export function clearStoredOpenAiKey(): void {
  writeStoredOpenAiKey("")
}

async function parseOpenAiErrorMessage(response: Response): Promise<string> {
  let message = `OpenAI returned HTTP ${response.status}.`

  try {
    const body = (await response.json()) as OpenAiErrorBody

    if (body.error?.message) {
      message = body.error.message
    }
  } catch {
    // Keep HTTP fallback when body is not JSON.
  }

  return message
}

function mapOpenAiHttpError(status: number, fallbackMessage: string): OpenAiByokError {
  if (status === 401) {
    return new OpenAiByokError(OPENAI_INVALID_KEY_MESSAGE, "invalid_key")
  }

  if (status === 429) {
    return new OpenAiByokError(OPENAI_RATE_LIMIT_MESSAGE, "rate_limit")
  }

  return new OpenAiByokError(fallbackMessage, "api_error")
}

/**
 * Client-side BYOK chat completion.
 * The API key is read from localStorage and sent directly to OpenAI — never to PulseFlow servers.
 */
export async function fetchOpenAiChatCompletion(
  request: OpenAiChatCompletionRequest
): Promise<OpenAiChatCompletionResult> {
  const apiKey = requireStoredOpenAiKey()
  assertAllowedByokEndpoint(OPENAI_CHAT_COMPLETIONS_URL)

  try {
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model ?? "gpt-4o-mini",
        messages: request.messages,
        max_tokens: request.max_tokens ?? 500,
        temperature: request.temperature ?? 0.3,
      }),
    })

    if (!response.ok) {
      const message = await parseOpenAiErrorMessage(response)
      throw mapOpenAiHttpError(response.status, message)
    }

    const body = (await response.json()) as OpenAiChatCompletionResponse
    const content = body.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new OpenAiByokError(
        "OpenAI returned an empty response. Please try again.",
        "api_error"
      )
    }

    return {
      content,
      model: body.model ?? request.model ?? "gpt-4o-mini",
      usage: body.usage
        ? {
            prompt_tokens: body.usage.prompt_tokens ?? 0,
            completion_tokens: body.usage.completion_tokens ?? 0,
            total_tokens: body.usage.total_tokens ?? 0,
          }
        : null,
    }
  } catch (error) {
    if (error instanceof OpenAiByokError) {
      throw error
    }

    const message =
      error instanceof Error
        ? error.message
        : "Could not reach the OpenAI API from this browser."

    throw new OpenAiByokError(message, "network_error")
  }
}

/** Client-only validation — key is sent directly to OpenAI, never to PulseFlow servers. */
export async function validateOpenAiKey(
  apiKey: string
): Promise<OpenAiKeyValidationResult> {
  const trimmed = apiKey.trim()

  if (!trimmed) {
    return { ok: false, message: "Enter an API key to validate." }
  }

  assertByokClientEnvironment()
  assertAllowedByokEndpoint(OPENAI_MODELS_URL)

  try {
    const response = await fetch(OPENAI_MODELS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${trimmed}`,
      },
    })

    if (response.ok) {
      return { ok: true }
    }

    if (response.status === 401) {
      return { ok: false, message: OPENAI_INVALID_KEY_MESSAGE }
    }

    if (response.status === 429) {
      return { ok: false, message: OPENAI_RATE_LIMIT_MESSAGE }
    }

    return { ok: false, message: await parseOpenAiErrorMessage(response) }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not reach the OpenAI API from this browser."

    return { ok: false, message }
  }
}
