"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import {
  normalizeEmail,
  UNTRUSTED_EMAIL_MESSAGE,
  validateEmailDomain,
} from "@/lib/auth/validate-email"
import { getAuthErrorMessage } from "@/lib/auth/errors"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import { normalizeUsername, validateUsername } from "@/lib/auth/username"
import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/LoginForm"
import { useGoogleSignIn } from "@/components/auth/useGoogleSignIn"
import { getAuthCallbackUrl } from "@/lib/auth/site-url"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PersonalDataConsentField from "@/components/consent/PersonalDataConsentField"

export default function SignupForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hasAcceptedPersonalDataConsent, setHasAcceptedPersonalDataConsent] =
    useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isGoogleLoading, error: googleError, setError: setGoogleError, handleGoogleSignIn } =
    useGoogleSignIn()

  const displayError = error ?? googleError
  const isFormDisabled = isGoogleLoading || isSubmitting

  const completeAuthAndRedirect = async (chosenUsername: string) => {
    const response = await fetch("/api/ensure-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: chosenUsername }),
    })

    const payload = (await response.json().catch(() => null)) as {
      error?: string
    } | null

    if (!response.ok) {
      throw new Error(payload?.error ?? "Could not save your profile.")
    }

    const supabase = createClient()
    const { user } = await getClientAuthUser(supabase)

    if (!user) {
      return
    }

    router.refresh()

    const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
    router.push(redirectPath)
  }

  const handleSignUp = async () => {
    setError(null)
    setGoogleError(null)
    setIsSubmitting(true)

    const normalizedUsername = normalizeUsername(username)
    const usernameCheck = validateUsername(normalizedUsername)
    if (!usernameCheck.valid) {
      setError(usernameCheck.message ?? "Invalid username.")
      setIsSubmitting(false)
      return
    }

    const normalizedEmail = normalizeEmail(email)
    if (!validateEmailDomain(normalizedEmail)) {
      setError(UNTRUSTED_EMAIL_MESSAGE)
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.")
      setIsSubmitting(false)
      return
    }

    if (!hasAcceptedPersonalDataConsent) {
      setError("Please agree to personal data processing before creating an account.")
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
          data: { username: normalizedUsername },
        },
      })

      if (signUpError) {
        setError(getAuthErrorMessage(signUpError))
        setIsSubmitting(false)
        return
      }

      if (data.session) {
        await completeAuthAndRedirect(normalizedUsername)
        return
      }

      setError(
        "Account created. Check your email to confirm your address, then sign in."
      )
      setIsSubmitting(false)
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Something went wrong while creating your account. Please try again."
      setError(message)
      setIsSubmitting(false)
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
        <Label htmlFor="username" className={authLabelClassName}>
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="yourname"
          value={username}
          onChange={(e) =>
            clearErrorOnChange(setUsername)(normalizeUsername(e.target.value))
          }
          disabled={isFormDisabled}
          autoComplete="username"
          spellCheck={false}
          className={authInputClassName}
        />
        <p className="text-xs text-zinc-600">
          3–20 characters. Letters, numbers, and underscores.
        </p>
      </div>

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
          autoComplete="new-password"
          className={authInputClassName}
        />
      </div>

      {displayError ? (
        <p className="text-sm leading-relaxed text-amber-300/90" role="alert">
          {displayError}
        </p>
      ) : null}

      <PersonalDataConsentField
        checked={hasAcceptedPersonalDataConsent}
        onCheckedChange={setHasAcceptedPersonalDataConsent}
        disabled={isFormDisabled}
      />

      <div className="pt-1">
        <Button
          type="button"
          onClick={handleSignUp}
          disabled={
            isFormDisabled ||
            !username.trim() ||
            !email.trim() ||
            password.length < 6 ||
            !hasAcceptedPersonalDataConsent
          }
          className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Sign in
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
        disabled={isSubmitting || !hasAcceptedPersonalDataConsent}
        onClick={handleGoogleSignIn}
      />
    </div>
  )
}
