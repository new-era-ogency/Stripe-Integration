import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { requireSupabasePublicEnv } from "@/lib/supabase/env"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = requireSupabasePublicEnv("Supabase server client")

  return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from a Server Component — session refresh is handled in middleware.
          }
        },
      },
    }
  )
}
