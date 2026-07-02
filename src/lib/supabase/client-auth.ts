import type { SupabaseClient, User } from "@supabase/supabase-js"
import { isLikelyNetworkError } from "@/lib/network-errors"

export type ClientAuthUserResult = {
  user: User | null
  /** User came from local session because server validation was unreachable. */
  fromSessionCache: boolean
}

async function getSessionUser(
  supabase: SupabaseClient
): Promise<ClientAuthUserResult> {
  try {
    const { data } = await supabase.auth.getSession()
    return {
      user: data.session?.user ?? null,
      fromSessionCache: Boolean(data.session?.user),
    }
  } catch {
    return { user: null, fromSessionCache: false }
  }
}

function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine
}

async function validateUserWithServer(
  supabase: SupabaseClient,
  fallback: ClientAuthUserResult
): Promise<ClientAuthUserResult> {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      if (isLikelyNetworkError(error)) {
        return fallback
      }

      return { user: null, fromSessionCache: false }
    }

    return { user: data.user, fromSessionCache: false }
  } catch (error) {
    if (isLikelyNetworkError(error)) {
      return fallback
    }

    return { user: null, fromSessionCache: false }
  }
}

/** Resolve the signed-in user without surfacing transient network failures. */
export async function getClientAuthUser(
  supabase: SupabaseClient
): Promise<ClientAuthUserResult> {
  const cached = await getSessionUser(supabase)

  if (isOffline()) {
    return cached
  }

  if (!cached.user) {
    return { user: null, fromSessionCache: false }
  }

  return validateUserWithServer(supabase, cached)
}
