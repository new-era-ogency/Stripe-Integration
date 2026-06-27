import { createBrowserClient } from "@supabase/ssr"
import { requireSupabasePublicEnv } from "@/lib/supabase/env"

export function createClient() {
  const { url, anonKey } = requireSupabasePublicEnv("Supabase browser client")

  return createBrowserClient(url, anonKey)
}
