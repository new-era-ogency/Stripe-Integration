"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  normalizeEmail,
  OAUTH_UNTRUSTED_EMAIL_MESSAGE,
  UNTRUSTED_EMAIL_MESSAGE,
  validateEmailDomain,
} from "@/lib/auth/validate-email"
import { getAuthErrorMessage } from "@/lib/auth/errors"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import { useGoogleSignIn } from "@/components/auth/useGoogleSignIn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const authInputClassName =
  "h-11 rounded-lg border-zinc-800 bg-[#020202] text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500 focus-visible:ring-0 disabled:opacity-60"

export const authLabelClassName = "text-xs uppercase tracking-wide text-zinc-500"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isGoogleLoading, error: googleError, setError: setGoogleError, handleGoogleSignIn } =
    useGoogleSignIn()

  useEffect(() => {
    if (searchParams.get("error") === "untrusted_email") {
      setError(OAUTH_UNTRUSTED_EMAIL_MESSAGE)
    }
  }, [searchParams])

  const displayError = error ?? googleError
  const isFormDisabled = isGoogleLoading || isSigningIn

  const completeAuthAndRedirect = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return
    }

    await fetch("/api/ensure-profile", { method: "POST" })

    router.refresh()

    const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
    router.push(redirectPath)
  }

  const handleSignIn = async () => {
    setError(null)
    setGoogleError(null)
    setIsSigningIn(true)

    const normalizedEmail = normalizeEmail(email)

    if (!validateEmailDomain(normalizedEmail)) {
      setError(UNTRUSTED_EMAIL_MESSAGE)
      setIsSigningIn(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (signInError) {
        setError(getAuthErrorMessage(signInError))
        setIsSigningIn(false)
        return
      }

      await completeAuthAndRedirect()
    } catch {
      setError("Something went wrong while signing in. Please try again.")
      setIsSigningIn(false)
    }
  }

  const clearErrorOnChange =
    (setter: (value: string) => void) => (value: string) => {
      if (displayError) {
        setError(null)
        setGoogleError(null)
      }
      setter(value)
    }

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className={authLabelClassName}>
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
          className={authInputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className={authLabelClassName}>
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
          className={authInputClassName}
        />
      </div>

      {displayError ? (
        <p className="text-sm leading-relaxed text-amber-300/90" role="alert">
          {displayError}
        </p>
      ) : null}

      <div className="pt-1">
        <Button
          type="button"
          onClick={handleSignIn}
          disabled={isFormDisabled || !email.trim() || !password}
          className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
        >
          {isSigningIn ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Create one
        </Link>
      </p>

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

      <GoogleAuthButton
        isLoading={isGoogleLoading}
        disabled={isSigningIn}
        onClick={handleGoogleSignIn}
      />
    </div>
  )
}
