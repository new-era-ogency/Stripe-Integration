"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import type { AuthError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import {
  normalizeEmail,
  OAUTH_UNTRUSTED_EMAIL_MESSAGE,
  UNTRUSTED_EMAIL_MESSAGE,
  validateEmailDomain,
} from "@/lib/auth/validate-email"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ManualAuthMode = "signin" | "signup"

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.72h6.43c-.13 1.02-.83 2.56-2.38 3.56l-.02.14 3.46 2.68.24.02c2.2-2.03 3.47-5.02 3.47-8.07z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.15 0 5.8-1.04 7.73-2.83l-3.68-2.85c-.99.68-2.31 1.16-4.05 1.16-3.1 0-5.72-2.09-6.66-4.9l-.14.01-3.6 2.79-.05.13C3.72 21.4 7.58 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.34 14.58A7.18 7.18 0 0 1 4.96 12c0-.9.16-1.77.44-2.58l-.01-.15-3.64-2.83-.12.06A11.96 11.96 0 0 0 0 12c0 1.93.46 3.75 1.28 5.36l4.06-2.78z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c2.19 0 3.67.95 4.51 1.74l3.29-3.22C17.78 1.19 15.15 0 12 0 7.58 0 3.72 2.6 1.28 6.64l4.06 2.78C6.28 6.84 8.9 4.75 12 4.75z"
        fill="#EA4335"
      />
    </svg>
  )
}

function getAuthErrorMessage(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return "Invalid login credentials. Check your email and password."
  }

  if (
    message.includes("user already registered") ||
    message.includes("already been registered") ||
    message.includes("already exists")
  ) {
    return "An account with this email already exists. Try signing in instead."
  }

  if (
    message.includes("password") &&
    (message.includes("at least") || message.includes("6"))
  ) {
    return "Password should be at least 6 characters."
  }

  if (message.includes("valid email")) {
    return "Please enter a valid email address."
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email before signing in."
  }

  return error.message
}

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [manualMode, setManualMode] = useState<ManualAuthMode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get("error") === "untrusted_email") {
      setError(OAUTH_UNTRUSTED_EMAIL_MESSAGE)
    }
  }, [searchParams])

  const isManualLoading = manualMode !== null
  const isFormDisabled = isGoogleLoading || isManualLoading

  const completeAuthAndRedirect = async () => {
    await fetch("/api/ensure-profile", { method: "POST" })
    router.refresh()
    window.location.assign("/dashboard")
  }

  const handleSignIn = async () => {
    setError(null)
    setManualMode("signin")

    const normalizedEmail = normalizeEmail(email)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (signInError) {
        setError(getAuthErrorMessage(signInError))
        setManualMode(null)
        return
      }

      await completeAuthAndRedirect()
    } catch {
      setError("Something went wrong while signing in. Please try again.")
      setManualMode(null)
    }
  }

  const handleSignUp = async () => {
    setError(null)
    setManualMode("signup")

    const normalizedEmail = normalizeEmail(email)

    if (!validateEmailDomain(normalizedEmail)) {
      setError(UNTRUSTED_EMAIL_MESSAGE)
      setManualMode(null)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })

      if (signUpError) {
        setError(getAuthErrorMessage(signUpError))
        setManualMode(null)
        return
      }

      if (data.session) {
        await completeAuthAndRedirect()
        return
      }

      setError(
        "Account created. Check your email to confirm your address, then sign in."
      )
      setManualMode(null)
    } catch {
      setError("Something went wrong while creating your account. Please try again.")
      setManualMode(null)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

  const clearErrorOnChange =
    (setter: (value: string) => void) => (value: string) => {
      if (error) setError(null)
      setter(value)
    }

  const inputClassName =
    "h-11 rounded-lg border-zinc-800 bg-[#020202] text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500 focus-visible:ring-0 disabled:opacity-60"
  const labelClassName = "text-xs uppercase tracking-wide text-zinc-500"

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className={labelClassName}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => clearErrorOnChange(setEmail)(normalizeEmail(e.target.value))}
          disabled={isFormDisabled}
          autoComplete="email"
          className={inputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className={labelClassName}>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => clearErrorOnChange(setPassword)(e.target.value)}
          disabled={isFormDisabled}
          autoComplete="current-password"
          className={inputClassName}
        />
      </div>

      {error ? (
        <p className="text-sm leading-relaxed text-amber-300/90" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-3 pt-1">
        <Button
          type="button"
          onClick={handleSignIn}
          disabled={isFormDisabled || !email.trim() || !password}
          className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
        >
          {manualMode === "signin" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Authenticating…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
        <Button
          type="button"
          onClick={handleSignUp}
          disabled={isFormDisabled || !email.trim() || !password}
          variant="outline"
          className="h-11 w-full rounded-lg border-zinc-800 bg-[#09090b] text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white focus-visible:ring-0 disabled:opacity-50"
        >
          {manualMode === "signup" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800/80" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#050505] px-3 text-[10px] uppercase tracking-widest text-zinc-600">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isFormDisabled}
        variant="outline"
        className="h-11 w-full gap-2.5 rounded-lg border-zinc-800 bg-[#09090b] text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white focus-visible:ring-0 disabled:opacity-80"
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="size-4 animate-spin text-violet-400" />
            Connecting to Google…
          </>
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </Button>
    </div>
  )
}
