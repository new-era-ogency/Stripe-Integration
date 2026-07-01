import type { SupabaseClient } from "@supabase/supabase-js"
import { fetchWithSignal } from "@/lib/generation/abort"
import {
  buildDashboardUserData,
  fetchClaimedViralActions,
  fetchUserGenerationsWithFallback,
  fetchUserProfileWithFallback,
  formatSupabaseError,
  loadDashboardUserData,
  type DashboardUserData,
} from "@/lib/dashboard/user-data-loader"

export type { DashboardUserData }

export type DashboardApiResult =
  | { ok: true; data: DashboardUserData }
  | { ok: false; status: number; networkError?: boolean }

function parseDashboardApiPayload(data: Record<string, unknown>): DashboardUserData {
  const profile =
    data.profile && typeof data.profile === "object"
      ? (data.profile as Record<string, unknown>)
      : null

  return {
    credits: typeof data.credits === "number" ? data.credits : 0,
    tier: (data.tier ?? profile?.tier ?? "starter") as DashboardUserData["tier"],
    brandVoice:
      (data.brandVoice as string | null | undefined) ??
      (profile?.brand_voice as string | null | undefined) ??
      null,
    tgChannelId:
      (data.tgChannelId as string | null | undefined) ??
      (profile?.tg_channel_id as string | null | undefined) ??
      null,
    generations: Array.isArray(data.generations)
      ? (data.generations as DashboardUserData["generations"])
      : [],
    trial:
      data.trial && typeof data.trial === "object"
        ? (data.trial as DashboardUserData["trial"])
        : null,
  }
}

export async function fetchDashboardDataViaApi(): Promise<DashboardApiResult> {
  try {
    const response = await fetchWithSignal("/api/user-data", {
      credentials: "same-origin",
      cache: "no-store",
    })

    if (!response.ok) {
      return { ok: false, status: response.status }
    }

    const data = (await response.json()) as Record<string, unknown>

    return {
      ok: true,
      data: parseDashboardApiPayload(data),
    }
  } catch (error) {
    console.warn(
      "Dashboard user-data API request failed:",
      formatSupabaseError(error)
    )
    return { ok: false, status: 0, networkError: true }
  }
}

export async function loadDashboardDataForUser(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    onSessionRefreshed?: () => void
  }
): Promise<{ ok: true; data: DashboardUserData } | { ok: false; error: string }> {
  try {
    let apiResult = await fetchDashboardDataViaApi()

    if (!apiResult.ok && apiResult.status === 401) {
      try {
        await supabase.auth.refreshSession()
        options?.onSessionRefreshed?.()
        await ensureServerProfile()
        apiResult = await fetchDashboardDataViaApi()
      } catch (refreshError) {
        console.warn(
          "Session refresh failed during dashboard load:",
          formatSupabaseError(refreshError)
        )
      }
    }

    if (apiResult.ok) {
      return { ok: true, data: apiResult.data }
    }

    if (apiResult.networkError) {
      console.warn("Falling back to direct Supabase load after API network error")
    } else if (apiResult.status !== 401) {
      console.warn(
        "Dashboard user-data API unavailable, using client fallback:",
        apiResult.status
      )
    }

    await ensureServerProfile()
    const data = await fetchDashboardDataViaClient(supabase, userId)
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: formatSupabaseError(error) }
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
