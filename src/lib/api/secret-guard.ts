const OPENAI_KEY_PATTERN = /\bsk-(?!or-v1-)[a-zA-Z0-9-_]{10,}\b/
const OPENROUTER_KEY_PATTERN = /\bsk-or-v1-[a-zA-Z0-9-_]{10,}\b/
const ANTHROPIC_KEY_PATTERN = /\bsk-ant-[a-zA-Z0-9-_]{10,}\b/
const BEARER_SECRET_PATTERN = /\bBearer\s+[a-zA-Z0-9-_]{10,}\b/i

/** Field names that must never be accepted by PulseFlow backend routes. */
export const FORBIDDEN_CLIENT_SECRET_FIELDS = new Set([
  "apikey",
  "api_key",
  "openai_key",
  "openai_api_key",
  "openrouter_key",
  "openrouter_api_key",
  "anthropic_key",
  "anthropic_api_key",
  "pulseflow_openai_key",
  "pulseflow_openrouter_key",
  "authorization",
  "bearer",
  "secret",
  "token",
  "access_token",
])

export function containsLikelyApiSecret(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }

  return (
    OPENAI_KEY_PATTERN.test(trimmed) ||
    OPENROUTER_KEY_PATTERN.test(trimmed) ||
    ANTHROPIC_KEY_PATTERN.test(trimmed) ||
    BEARER_SECRET_PATTERN.test(trimmed)
  )
}

export function redactSecrets(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(OPENROUTER_KEY_PATTERN, "[REDACTED_OPENROUTER_KEY]")
      .replace(OPENAI_KEY_PATTERN, "[REDACTED_OPENAI_KEY]")
      .replace(ANTHROPIC_KEY_PATTERN, "[REDACTED_ANTHROPIC_KEY]")
      .replace(BEARER_SECRET_PATTERN, "Bearer [REDACTED]")
  }

  if (Array.isArray(value)) {
    return value.map(redactSecrets)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        redactSecrets(nested),
      ])
    )
  }

  return value
}

function normalizeFieldName(field: string): string {
  return field.replace(/[^a-z0-9_]/gi, "").toLowerCase()
}

export function findForbiddenClientSecretField(
  body: unknown,
  path = ""
): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null
  }

  for (const [field, nested] of Object.entries(body as Record<string, unknown>)) {
    const normalized = normalizeFieldName(field)

    if (FORBIDDEN_CLIENT_SECRET_FIELDS.has(normalized)) {
      return path ? `${path}.${field}` : field
    }

    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const nestedMatch = findForbiddenClientSecretField(
        nested,
        path ? `${path}.${field}` : field
      )

      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return null
}

export function rejectClientSecretsInBody(body: unknown): string | null {
  const forbiddenField = findForbiddenClientSecretField(body)

  if (forbiddenField) {
    return `Do not send API keys to PulseFlow servers. Remove "${forbiddenField}" from the request body and store your OpenRouter key in Settings instead.`
  }

  return null
}
