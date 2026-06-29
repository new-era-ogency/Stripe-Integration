import { NextResponse } from "next/server"
import { formatTelegramChatId } from "@/lib/telegram/channel-id"

const TELEGRAM_API_BASE = "https://api.telegram.org"

export const TELEGRAM_CHANNEL_PERMISSION_ERROR =
  "Make sure your Telegram bot is added to the channel as an Administrator with posting permissions."

type TelegramApiResponse<T> = {
  ok: boolean
  result?: T
  error_code?: number
  description?: string
}

export class TelegramIntegrationError extends Error {
  readonly errorCode?: number
  readonly description?: string
  readonly isChannelPermissionError: boolean

  constructor(options: {
    message: string
    errorCode?: number
    description?: string
    isChannelPermissionError?: boolean
  }) {
    super(options.message)
    this.name = "TelegramIntegrationError"
    this.errorCode = options.errorCode
    this.description = options.description
    this.isChannelPermissionError = options.isChannelPermissionError ?? false
  }
}

function isChannelPermissionTelegramError(
  errorCode?: number,
  description?: string
): boolean {
  if (errorCode === 403) {
    return true
  }

  if (errorCode !== 400) {
    return false
  }

  const lower = description?.toLowerCase() ?? ""

  return (
    lower.includes("chat not found") ||
    lower.includes("not enough rights") ||
    lower.includes("have no rights") ||
    lower.includes("need administrator") ||
    lower.includes("bot is not a member") ||
    lower.includes("member list is inaccessible") ||
    lower.includes("channel_private")
  )
}

function getBotToken(): string {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN?.trim() ??
    process.env.TELEGRAM_TOKEN?.trim()

  if (!botToken) {
    throw new TelegramIntegrationError({
      message:
        "Telegram bot is not configured on the server. Set TELEGRAM_BOT_TOKEN in your environment.",
    })
  }

  return botToken
}

async function callTelegramApi<T>(
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const botToken = getBotToken()

  let response: Response
  let payload: TelegramApiResponse<T>

  try {
    response = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    payload = (await response.json()) as TelegramApiResponse<T>
  } catch (error) {
    throw new TelegramIntegrationError({
      message:
        error instanceof Error
          ? error.message
          : "Could not reach the Telegram API",
    })
  }

  if (!payload.ok) {
    const errorCode = payload.error_code
    const description = payload.description ?? "Unknown Telegram API error"
    const isChannelPermissionError = isChannelPermissionTelegramError(
      errorCode,
      description
    )

    throw new TelegramIntegrationError({
      message: isChannelPermissionError
        ? TELEGRAM_CHANNEL_PERMISSION_ERROR
        : description,
      errorCode,
      description,
      isChannelPermissionError,
    })
  }

  if (payload.result === undefined) {
    throw new TelegramIntegrationError({
      message: "Telegram API returned an empty result",
    })
  }

  return payload.result
}

/** Verifies the channel exists and the bot is an administrator with posting access. */
export async function validateTelegramChannel(channelId: string): Promise<void> {
  const chatId = formatTelegramChatId(channelId)

  await callTelegramApi("getChat", { chat_id: chatId })

  const bot = await callTelegramApi<{ id: number; username?: string }>(
    "getMe",
    {}
  )

  const membership = await callTelegramApi<{
    status: string
    can_post_messages?: boolean
  }>("getChatMember", {
    chat_id: chatId,
    user_id: bot.id,
  })

  if (membership.status !== "administrator" && membership.status !== "creator") {
    throw new TelegramIntegrationError({
      message: TELEGRAM_CHANNEL_PERMISSION_ERROR,
      isChannelPermissionError: true,
    })
  }

  if (
    membership.status === "administrator" &&
    membership.can_post_messages === false
  ) {
    throw new TelegramIntegrationError({
      message: TELEGRAM_CHANNEL_PERMISSION_ERROR,
      isChannelPermissionError: true,
    })
  }
}

export type TelegramSendResult = {
  messageId: number
  chatId: string | number
}

export async function sendTelegramChannelMessage(params: {
  channelId: string
  text: string
}): Promise<TelegramSendResult> {
  const chatId = formatTelegramChatId(params.channelId)

  const result = await callTelegramApi<{
    message_id: number
    chat: { id: number }
  }>("sendMessage", {
    chat_id: chatId,
    text: params.text,
    parse_mode: "HTML",
    disable_web_page_preview: false,
  })

  return {
    messageId: result.message_id,
    chatId: result.chat.id,
  }
}

export function telegramIntegrationErrorResponse(error: unknown): NextResponse {
  console.error("Telegram integration error:", error)

  if (error instanceof TelegramIntegrationError) {
    if (
      error.isChannelPermissionError ||
      error.errorCode === 400 ||
      error.errorCode === 403
    ) {
      return NextResponse.json(
        { error: TELEGRAM_CHANNEL_PERMISSION_ERROR },
        { status: 422 }
      )
    }

    if (error.message.includes("not configured")) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    return NextResponse.json({ error: error.message }, { status: 502 })
  }

  if (error instanceof Error) {
    if (error.message.includes("channelusername") || error.message.includes("Channel ID")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }

  return NextResponse.json(
    { error: "Telegram integration failed. Please try again." },
    { status: 502 }
  )
}
