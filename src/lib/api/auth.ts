import { NextResponse } from "next/server"
import type { User } from "@supabase/supabase-js"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function paymentRequiredResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 402 })
}

export async function requireAuthenticatedUser(): Promise<
  { user: User; supabase: Awaited<ReturnType<typeof createServerSupabaseClient>> } | NextResponse
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return unauthorizedResponse()
  }

  return { user, supabase }
}

export function isErrorResponse(
  value: unknown
): value is NextResponse {
  return value instanceof NextResponse
}
