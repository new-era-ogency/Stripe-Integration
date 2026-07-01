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
      fromSessionCache: true,
    }
  } catch {
    return { user: null, fromSessionCache: false }
  }
}

/** Resolve the signed-in user without surfacing transient network failures. */
export async function getClientAuthUser(
  supabase: SupabaseClient
): Promise<ClientAuthUserResult> {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      if (isLikelyNetworkError(error)) {
        return getSessionUser(supabase)
      }

      return { user: null, fromSessionCache: false }
    }

    return { user: data.user, fromSessionCache: false }
  } catch (error) {
    if (isLikelyNetworkError(error)) {
      return getSessionUser(supabase)
    }

    return { user: null, fromSessionCache: false }
  }
}
