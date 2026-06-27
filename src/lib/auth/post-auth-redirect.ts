import type { SupabaseClient } from "@supabase/supabase-js"
import { DEFAULT_USER_CREDITS } from "@/lib/credits"

export type PostAuthRedirectPath = "/dashboard" | "/signup/complete"

export async function getPostAuthRedirectPath(
  supabase: SupabaseClient,
  userId: string
): Promise<PostAuthRedirectPath> {
  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .maybeSingle()

  return profile?.username ? "/dashboard" : "/signup/complete"
}

/** Ensures a `users` row exists and returns the stored username, if any. */
export async function ensureUserProfileRow(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .maybeSingle()

  if (!profile) {
    await supabase.from("users").insert({
      id: userId,
      credits: DEFAULT_USER_CREDITS,
    })
    return null
  }

  return profile.username
}
