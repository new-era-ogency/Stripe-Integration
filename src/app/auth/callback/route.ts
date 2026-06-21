import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { DEFAULT_USER_CREDITS } from "@/lib/credits"

async function ensureUserProfile(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, userId: string) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle()

  if (!existing) {
    await supabase.from("users").insert({ id: userId, credits: DEFAULT_USER_CREDITS })
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  const supabase = await createServerSupabaseClient()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await ensureUserProfile(supabase, user.id)
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
