"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getAuthCallbackUrl } from "@/lib/auth/site-url"
import { getAuthErrorMessage } from "@/lib/auth/errors"

export function useGoogleSignIn() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)

    try {
      const supabase = createClient()
      const redirectTo = getAuthCallbackUrl()

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      })

      if (oauthError) {
        setError(getAuthErrorMessage(oauthError))
        setIsGoogleLoading(false)
        return
      }

      if (data.url) {
        window.location.assign(data.url)
      } else {
        setIsGoogleLoading(false)
      }
    } catch {
      setError("Could not start Google sign-in. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return { isGoogleLoading, error, setError, handleGoogleSignIn }
}
