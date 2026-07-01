import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"
import type { GenerationRecord } from "@/lib/generations"
import { DEFAULT_USER_CREDITS } from "@/lib/credits"
import type { UserTier } from "@/lib/profile"
import { isMissingSchemaError } from "@/lib/supabase/schema-errors"
import { buildTrialUiState, type TrialUiState } from "@/lib/trial/ui"

export type DashboardUserData = {
  credits: number
  tier: UserTier
  brandVoice: string | null
  tgChannelId: string | null
  generations: GenerationRecord[]
  trial: TrialUiState | null
}

type UserProfileRow = {
  credits?: number | null
  tier?: string | null
  brand_voice?: string | null
  tg_channel_id?: string | null
  account_status?: string | null
  trial_start_at?: string | null
  trial_end_at?: string | null
  trial_extended_days?: number | null
  subscription_status?: string | null
  stripe_price_id?: string | null
  stripe_subscription_id?: string | null
  subscription_period_end?: string | null
}

const PROFILE_SELECTS = [
  "credits, tier, brand_voice, tg_channel_id, account_status, trial_start_at, trial_end_at, trial_extended_days",
  "credits, tier, brand_voice, tg_channel_id",
  "credits, tier, brand_voice",
  "credits, tier",
  "credits",
] as const

const GENERATION_PROFILE_SELECTS = [
  "credits, tier, brand_voice, subscription_status, stripe_price_id, stripe_subscription_id, subscription_period_end",
  ...PROFILE_SELECTS,
] as const

const GENERATIONS_SELECT_NEW =
  "id, user_id, youtube_url, generated_content, created_at"

const GENERATIONS_SELECT_LEGACY =
  "id, user_id, video_url, output_x, output_linkedin, output_telegram, created_at"

export function formatSupabaseError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return String(error)
  }

  const pgError = error as PostgrestError
  const parts = [
    pgError.message,
    pgError.code ? `code=${pgError.code}` : null,
    pgError.details ? `details=${pgError.details}` : null,
    pgError.hint ? `hint=${pgError.hint}` : null,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(" | ") : JSON.stringify(error)
}

export { isMissingSchemaError } from "@/lib/supabase/schema-errors"

function mapLegacyGeneration(row: {
  id: string
  user_id: string
  video_url: string | null
  output_x: string | null
  output_linkedin: string | null
  output_telegram: string | null
  created_at: string
}): GenerationRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    youtube_url: row.video_url ?? "",
    generated_content: {
      outputX: row.output_x ?? "",
      outputLinkedIn: row.output_linkedin ?? "",
      outputTelegram: row.output_telegram ?? "",
    },
    created_at: row.created_at,
  }
}

async function fetchUserProfileWithSelects(
  supabase: SupabaseClient,
  userId: string,
  selects: readonly string[]
): Promise<UserProfileRow | null> {
  let lastError: PostgrestError | null = null

  for (const select of selects) {
    const { data, error } = await supabase
      .from("users")
      .select(select)
      .eq("id", userId)
      .maybeSingle()

    if (!error) {
      return (data ?? null) as UserProfileRow | null
    }

    lastError = error

    if (!isMissingSchemaError(error)) {
      throw error
    }
  }

  if (lastError) {
    throw lastError
  }

  return null
}

export async function fetchUserProfileWithFallback(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileRow | null> {
  return fetchUserProfileWithSelects(supabase, userId, PROFILE_SELECTS)
}

export async function fetchUserProfileForGeneration(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileRow | null> {
  return fetchUserProfileWithSelects(
    supabase,
    userId,
    GENERATION_PROFILE_SELECTS
  )
}

export async function ensureUserProfileForGeneration(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileRow> {
  let profile = await fetchUserProfileForGeneration(supabase, userId)

  if (profile) {
    return profile
  }

  const { data: created, error: insertError } = await supabase
    .from("users")
    .insert({ id: userId, credits: DEFAULT_USER_CREDITS })
    .select("credits, tier, brand_voice")
    .maybeSingle()

  if (insertError) {
    const duplicate =
      insertError.code === "23505" ||
      insertError.message?.toLowerCase().includes("duplicate")

    if (duplicate) {
      profile = await fetchUserProfileForGeneration(supabase, userId)
      if (profile) {
        return profile
      }
    }

    throw insertError
  }

  if (created) {
    return created as UserProfileRow
  }

  profile = await fetchUserProfileForGeneration(supabase, userId)

  if (!profile) {
    throw new Error("User profile not found")
  }

  return profile
}

export async function fetchUserGenerationsWithFallback(
  supabase: SupabaseClient,
  userId: string
): Promise<GenerationRecord[]> {
  const { data: modernRows, error: modernError } = await supabase
    .from("generations")
    .select(GENERATIONS_SELECT_NEW)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!modernError) {
    return (modernRows ?? []) as GenerationRecord[]
  }

  if (!isMissingSchemaError(modernError)) {
    throw modernError
  }

  const { data: legacyRows, error: legacyError } = await supabase
    .from("generations")
    .select(GENERATIONS_SELECT_LEGACY)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (legacyError) {
    if (isMissingSchemaError(legacyError)) {
      return []
    }

    throw legacyError
  }

  return (legacyRows ?? []).map(mapLegacyGeneration)
}

export async function fetchClaimedViralActions(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("viral_actions")
    .select("action_type")
    .eq("user_id", userId)

  if (error) {
    if (isMissingSchemaError(error)) {
      return []
    }

    console.warn("Could not load viral actions:", formatSupabaseError(error))
    return []
  }

  return (data ?? []).map((row) => row.action_type)
}

export function buildDashboardUserData(
  profile: UserProfileRow | null,
  generations: GenerationRecord[],
  claimedActions: string[] = []
): DashboardUserData {
  const trial = profile
    ? buildTrialUiState({
        accountStatus: profile.account_status,
        trialStartAt: profile.trial_start_at,
        trialEndAt: profile.trial_end_at,
        trialExtendedDays: profile.trial_extended_days,
        claimedActions,
      })
    : buildTrialUiState({ claimedActions })

  return {
    credits: profile?.credits ?? DEFAULT_USER_CREDITS,
    tier: (profile?.tier ?? "starter") as UserTier,
    brandVoice: profile?.brand_voice ?? null,
    tgChannelId: profile?.tg_channel_id ?? null,
    generations,
    trial,
  }
}

export async function loadDashboardUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardUserData> {
  const [profile, generations, claimedActions] = await Promise.all([
    fetchUserProfileWithFallback(supabase, userId),
    fetchUserGenerationsWithFallback(supabase, userId),
    fetchClaimedViralActions(supabase, userId),
  ])

  return buildDashboardUserData(profile, generations, claimedActions)
}
