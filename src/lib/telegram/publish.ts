import { toTelegramHtml } from "@/lib/telegram/format"

const TELEGRAM_API_BASE = "https://api.telegram.org"

export type TelegramSendResult = {
  messageId: number
  chatId: string | number
}

export function normalizeTelegramChannelId(value: string): string {
  const trimmed = value.trim()
  if (/^-?\d+$/.test(trimmed)) {
    return trimmed
  }
  if (trimmed.startsWith("@")) {
    return trimmed
  }
  return `@${trimmed.replace(/^@/, "")}`
}

export async function sendTelegramChannelMessage(params: {
  channelId: string
  text: string
  botToken?: string
}): Promise<TelegramSendResult> {
  const botToken = params.botToken ?? process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    throw new Error("Telegram bot is not configured")
  }

  const chatId = normalizeTelegramChannelId(params.channelId)
  const htmlText = toTelegramHtml(params.text)

  const response = await fetch(
    `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    }
  )

  const payload = (await response.json()) as {
    ok: boolean
    description?: string
    result?: { message_id: number; chat: { id: number } }
  }

  if (!response.ok || !payload.ok || !payload.result) {
    throw new Error(
      payload.description ??
        "Telegram rejected the message. Ensure the bot is an admin of your channel."
    )
  }

  return {
    messageId: payload.result.message_id,
    chatId: payload.result.chat.id,
  }
}
