import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { validateEmailDomain } from "@/lib/auth/validate-email"

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

  const dashboardUrl = new URL("/dashboard", origin)
  dashboardUrl.searchParams.set("auth", Date.now().toString())

  let response = NextResponse.redirect(dashboardUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  )

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
  let redirectTarget = dashboardUrl

  if (userId) {
    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .maybeSingle()

    const metadataUsername = data.user?.user_metadata?.username
    const hasMetadataUsername =
      typeof metadataUsername === "string" && metadataUsername.length > 0

    if (!profile?.username && !hasMetadataUsername) {
      redirectTarget = new URL("/signup/complete", origin)
    }
  }

  if (redirectTarget.pathname !== dashboardUrl.pathname) {
    const redirectResponse = NextResponse.redirect(redirectTarget)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  return response
}
