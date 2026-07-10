import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import {
  ensureUserProfileRow,
  getPostAuthRedirectPath,
} from "@/lib/auth/post-auth-redirect"
import { validateEmailDomain } from "@/lib/auth/validate-email"
import { requireSupabasePublicEnv } from "@/lib/supabase/env"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const oauthError = requestUrl.searchParams.get("error_description")
  const next = requestUrl.searchParams.get("next")
  const origin = requestUrl.origin

  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(oauthError)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const { url, anonKey } = requireSupabasePublicEnv("Auth callback")

  // Keep a single redirect response so Supabase session cookies keep httpOnly/options.
  let redirectTarget = new URL("/dashboard", origin)
  let response = NextResponse.redirect(redirectTarget)

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("OAuth code exchange failed:", error.message)
    if (next === "reset-password") {
      return NextResponse.redirect(
        `${origin}/forgot-password?error=${encodeURIComponent("expired")}`
      )
    }
    return NextResponse.redirect(`${origin}/login?error=oauth`)
  }

  const email = data.user?.email

  if (!email || !validateEmailDomain(email)) {
    redirectTarget = new URL("/login", origin)
    redirectTarget.searchParams.set("error", "untrusted_email")
    response.headers.set("Location", redirectTarget.toString())
    await supabase.auth.signOut()
    return response
  }

  await supabase.auth.refreshSession()

  if (next === "reset-password") {
    redirectTarget = new URL("/reset-password", origin)
    response.headers.set("Location", redirectTarget.toString())
    return response
  }

  const userId = data.user?.id
  let redirectPath: "/dashboard" | "/signup/complete" = "/dashboard"

  if (userId) {
    await ensureUserProfileRow(supabase, userId)
    redirectPath = await getPostAuthRedirectPath(supabase, userId)
  }

  redirectTarget = new URL(redirectPath, origin)
  if (redirectPath === "/dashboard") {
    redirectTarget.searchParams.set("auth", Date.now().toString())
  }
  response.headers.set("Location", redirectTarget.toString())

  return response
}
