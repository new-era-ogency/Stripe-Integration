import { NextResponse } from "next/server"
import { checkRateLimit, type RateLimitOptions } from "@/lib/api/rate-limit"
import { redactSecrets } from "@/lib/api/secret-guard"

export const DEFAULT_MAX_JSON_BYTES = 512_000

const FEEDBACK_METADATA_ALLOWLIST = new Set([
  "source",
  "trigger",
  "trialDaysRemaining",
  "trialExpiresAt",
  "videoUrl",
  "threadLength",
])

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown"
  )
}

export async function readJsonBody(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BYTES
): Promise<
  { ok: true; body: unknown } | { ok: false; response: NextResponse }
> {
  const contentLength = request.headers.get("content-length")

  if (contentLength) {
    const parsedLength = Number.parseInt(contentLength, 10)

    if (Number.isFinite(parsedLength) && parsedLength > maxBytes) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Request body too large" },
          { status: 413 }
        ),
      }
    }
  }

  let text: string

  try {
    text = await request.text()
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid request body" }, { status: 400 }),
    }
  }

  if (text.length > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      ),
    }
  }

  if (!text.trim()) {
    return { ok: true, body: {} }
  }

  try {
    return { ok: true, body: JSON.parse(text) as unknown }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    }
  }
}

export function sanitizeFeedbackMetadata(
  metadata: Record<string, unknown> | undefined
): Record<string, string | number | boolean | null> {
  if (!metadata) {
    return {}
  }

  const sanitized: Record<string, string | number | boolean | null> = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (!FEEDBACK_METADATA_ALLOWLIST.has(key)) {
      continue
    }

    if (typeof value === "string") {
      sanitized[key] = value.slice(0, 500)
      continue
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      sanitized[key] = value
      continue
    }

    if (typeof value === "boolean") {
      sanitized[key] = value
    }
  }

  return sanitized
}

export function logSecurityEvent(
  event: string,
  context: Record<string, unknown> = {}
): void {
  console.warn(
    JSON.stringify({
      level: "security",
      event,
      at: new Date().toISOString(),
      ...(redactSecrets(context) as Record<string, unknown>),
    })
  )
}

export function internalErrorResponse(
  scope: string,
  error: unknown,
  context: Record<string, unknown> = {}
): NextResponse {
  console.error(
    `[${scope}]`,
    redactSecrets(error),
    redactSecrets(context)
  )

  const detailSource =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : undefined

  const detail =
    typeof detailSource === "string"
      ? (redactSecrets(detailSource) as string)
      : undefined

  return NextResponse.json(
    {
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" &&
        detail && { detail }),
    },
    { status: 500 }
  )
}

export function enforceRateLimit(
  key: string,
  options: RateLimitOptions,
  context: Record<string, unknown> = {}
): NextResponse | null {
  const result = checkRateLimit(key, options)

  if (result.allowed) {
    return null
  }

  logSecurityEvent("rate_limit_exceeded", { key, ...context })

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    }
  )
}
