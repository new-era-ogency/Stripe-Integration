/**
 * Shared BYOK security allowlists.
 * Keep browser fetch hostnames and CSP connect-src origins aligned.
 */
export const BYOK_ALLOWED_FETCH_HOSTS = new Set([
  "openrouter.ai",
  "api.openai.com",
  "api.anthropic.com",
])

/** Origins permitted in Content-Security-Policy connect-src for client BYOK fetches. */
export const BYOK_CSP_CONNECT_SRC = [
  "https://openrouter.ai",
  "https://api.openai.com",
  "https://api.anthropic.com",
] as const

export function buildByokCspConnectSrc(): string {
  return BYOK_CSP_CONNECT_SRC.join(" ")
}

export function assertByokFetchHostAllowed(url: string): void {
  const hostname = new URL(url).hostname

  if (!BYOK_ALLOWED_FETCH_HOSTS.has(hostname)) {
    throw new Error(
      `Blocked BYOK request to unsupported host "${hostname}". Allowed: ${[...BYOK_ALLOWED_FETCH_HOSTS].join(", ")}.`
    )
  }
}
