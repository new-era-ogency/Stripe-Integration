const USERNAME_REGEX = /^[a-z][a-z0-9_]{2,19}$/

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase()
}

export function validateUsername(value: string): {
  valid: boolean
  message?: string
} {
  const normalized = normalizeUsername(value)

  if (!normalized) {
    return { valid: false, message: "Username is required." }
  }

  if (normalized.length < 3) {
    return { valid: false, message: "Username must be at least 3 characters." }
  }

  if (normalized.length > 20) {
    return { valid: false, message: "Username must be 20 characters or fewer." }
  }

  if (!USERNAME_REGEX.test(normalized)) {
    return {
      valid: false,
      message:
        "Use 3–20 characters: start with a letter, then letters, numbers, or underscores.",
    }
  }

  return { valid: true }
}
