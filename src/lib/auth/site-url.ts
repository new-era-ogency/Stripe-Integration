/**
 * Canonical app origin for auth redirects and checkout URLs.
 * Must match Supabase Auth → URL Configuration (Site URL + Redirect URLs).
 */
function normalizeSiteUrl(url: string): string {
  let normalized = url.trim()

  if (!normalized.startsWith("http")) {
    normalized = `https://${normalized}`
  }

  return normalized.replace(/\/+$/, "")
}

export function getSiteUrl(): string {
  // Browser OAuth must use the current origin so PKCE cookies match the callback URL.
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : null)

  if (configured) {
    return normalizeSiteUrl(configured)
  }

  return "http://localhost:3000"
}

/** OAuth / magic-link callback — route handler at src/app/auth/callback/route.ts */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`
}

/** Password recovery — lands on callback, then routes to /reset-password */
export function getPasswordResetCallbackUrl(): string {
  const callback = new URL(getAuthCallbackUrl())
  callback.searchParams.set("next", "reset-password")
  return callback.toString()
}
