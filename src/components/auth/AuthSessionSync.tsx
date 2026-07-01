"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"

const AUTH_ENTRY_PATHS = new Set(["/", "/login", "/signup"])

export default function AuthSessionSync() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (code && pathname !== "/auth/callback") {
      const callbackUrl = new URL("/auth/callback", window.location.origin)
      callbackUrl.search = window.location.search
      window.location.replace(callbackUrl.toString())
      return
    }

    const supabase = createClient()

    const redirectAuthenticatedUser = async () => {
      const { user } = await getClientAuthUser(supabase)

      if (!user) {
        return
      }

      const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
      router.replace(redirectPath)
      router.refresh()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session) {
        return
      }

      if (pathname === "/auth/callback" || pathname === "/signup/complete") {
        return
      }

      if (params.get("code")) {
        return
      }

      if (AUTH_ENTRY_PATHS.has(pathname)) {
        void redirectAuthenticatedUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  return null
}
