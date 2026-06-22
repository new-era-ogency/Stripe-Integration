const TRUSTED_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "ukr.net",
])

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "mailinator.com",
  "throwawaymail.com",
  "yopmail.com",
  "fakeinbox.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "qq.com",
])

export const UNTRUSTED_EMAIL_MESSAGE =
  "Please use a valid, trusted email address (e.g., Gmail, Outlook) to prevent abuse."

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function validateEmailDomain(email: string): boolean {
  const normalized = normalizeEmail(email)
  const atIndex = normalized.lastIndexOf("@")

  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return false
  }

  const domain = normalized.slice(atIndex + 1)

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return false
  }

  return TRUSTED_EMAIL_DOMAINS.has(domain)
}
