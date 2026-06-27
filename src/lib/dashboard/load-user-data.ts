import type { SupabaseClient } from "@supabase/supabase-js"
import {
  buildDashboardUserData,
  fetchClaimedViralActions,
  fetchUserGenerationsWithFallback,
  fetchUserProfileWithFallback,
  loadDashboardUserData,
  type DashboardUserData,
} from "@/lib/dashboard/user-data-loader"

export type { DashboardUserData }

export async function fetchDashboardDataViaApi(): Promise<
  | { ok: true; data: DashboardUserData }
  | { ok: false; status: number }
> {
  const response = await fetch("/api/user-data", {
    credentials: "same-origin",
    cache: "no-store",
  })

  if (!response.ok) {
    return { ok: false, status: response.status }
  }

  const data = await response.json()

  return {
    ok: true,
    data: {
      credits: data.credits,
      tier: data.tier ?? data.profile?.tier ?? "starter",
      brandVoice: data.brandVoice ?? data.profile?.brand_voice ?? null,
      tgChannelId: data.tgChannelId ?? data.profile?.tg_channel_id ?? null,
      generations: data.generations ?? [],
      trial: data.trial ?? null,
    },
  }
}

export async function fetchDashboardDataViaClient(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardUserData> {
  return loadDashboardUserData(supabase, userId)
}

export async function ensureServerProfile(): Promise<void> {
  await fetch("/api/ensure-profile", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  }).catch(() => undefined)
}

export {
  buildDashboardUserData,
  fetchClaimedViralActions,
  fetchUserGenerationsWithFallback,
  fetchUserProfileWithFallback,
  loadDashboardUserData,
}
