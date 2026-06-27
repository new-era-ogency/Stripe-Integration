"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getAuthCallbackUrl } from "@/lib/auth/site-url"

export default function AuthSessionSync() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (code && pathname !== "/auth/callback") {
      const callbackUrl = new URL(getAuthCallbackUrl())
      callbackUrl.search = window.location.search
      window.location.replace(callbackUrl.toString())
      return
    }

    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session) {
        return
      }

      if (pathname === "/auth/callback") {
        return
      }

      if (params.get("code")) {
        return
      }

      if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
        router.replace("/dashboard")
      }

      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  return null
}
