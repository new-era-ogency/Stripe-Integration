/**
 * Normalizes user input into a Telegram `chat_id` accepted by Bot API.
 * Supports public handles (@channel) and numeric supergroup IDs (-100…).
 */
export function formatTelegramChatId(value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error("Telegram channel ID is required")
  }

  if (/^-100\d+$/.test(trimmed) || /^-\d+$/.test(trimmed)) {
    return trimmed
  }

  const handle = trimmed.startsWith("@") ? trimmed : `@${trimmed.replace(/^@+/, "")}`

  if (!/^@[a-zA-Z0-9_]{3,}$/.test(handle)) {
    throw new Error(
      "Use @channelusername or a numeric channel ID (e.g. -1001234567890)"
    )
  }

  return handle
}

export function formatTelegramChatIdOrNull(
  value: string | null | undefined
): string | null {
  const trimmed = value?.trim()
  if (!trimmed) {
    return null
  }

  return formatTelegramChatId(trimmed)
}
