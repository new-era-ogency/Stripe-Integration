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

  let response = NextResponse.redirect(new URL("/dashboard", origin))

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
    return NextResponse.redirect(`${origin}/login?error=oauth`)
  }

  const email = data.user?.email

  if (!email || !validateEmailDomain(email)) {
    response = NextResponse.redirect(`${origin}/login?error=untrusted_email`)
    await supabase.auth.signOut()
    return response
  }

  await supabase.auth.refreshSession()

  const userId = data.user?.id
  let redirectPath: "/dashboard" | "/signup/complete" = "/dashboard"

  if (userId) {
    await ensureUserProfileRow(supabase, userId)
    redirectPath = await getPostAuthRedirectPath(supabase, userId)
  }

  const redirectTarget = new URL(redirectPath, origin)
  if (redirectPath === "/dashboard") {
    redirectTarget.searchParams.set("auth", Date.now().toString())
  }

  const redirectResponse = NextResponse.redirect(redirectTarget)
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}
