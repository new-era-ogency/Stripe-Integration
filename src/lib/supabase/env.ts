export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    return null
  }

  return { url, anonKey }
}

export function requireSupabasePublicEnv(context: string) {
  const env = getSupabasePublicEnv()

  if (!env) {
    throw new Error(
      `${context}: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured. Add them to .env.local (local) or your Vercel project settings (production).`
    )
  }

  return env
}
