"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthSessionSync() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()

    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (code && pathname !== "/auth/callback") {
      const callbackUrl = new URL("/auth/callback", window.location.origin)
      callbackUrl.search = window.location.search
      window.location.replace(callbackUrl.toString())
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/"
        ) {
          router.push("/dashboard")
        }
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  return null
}
