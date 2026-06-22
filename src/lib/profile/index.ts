export type UserTier = "starter" | "pro" | "pro_max"

export type UserProfile = {
  credits: number
  tier: UserTier
  brand_voice: string | null
  tg_channel_id: string | null
}

export function normalizeTelegramChannelId(
  value: string | null | undefined
): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function isProTier(
  tier: string | null | undefined
): tier is "pro" | "pro_max" {
  return tier === "pro" || tier === "pro_max"
}

export function isProMaxTier(
  tier: string | null | undefined
): tier is "pro_max" {
  return tier === "pro_max"
}

export function normalizeBrandVoice(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}
