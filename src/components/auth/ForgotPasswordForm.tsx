"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  normalizeEmail,
  UNTRUSTED_EMAIL_MESSAGE,
  validateEmailDomain,
} from "@/lib/auth/validate-email"
import { getAuthErrorMessage } from "@/lib/auth/errors"
import { getPasswordResetCallbackUrl } from "@/lib/auth/site-url"
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("error") === "expired") {
      setError(
        "This reset link has expired. Enter your email to receive a new one."
      )
    }
  }, [searchParams])

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    const normalizedEmail = normalizeEmail(email)

    if (!validateEmailDomain(normalizedEmail)) {
      setError(UNTRUSTED_EMAIL_MESSAGE)
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        { redirectTo: getPasswordResetCallbackUrl() }
      )

      if (resetError) {
        setError(getAuthErrorMessage(resetError))
        setIsSubmitting(false)
        return
      }

      const sentUrl = new URL("/forgot-password/sent", window.location.origin)
      sentUrl.searchParams.set("email", normalizedEmail)
      router.push(sentUrl.pathname + sentUrl.search)
    } catch {
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-5">
      <p className="text-sm leading-relaxed text-zinc-400">
        Enter the email address for your account. We&apos;ll send you a link to
        choose a new password.
      </p>

      <div className="space-y-2">
        <Label htmlFor="reset-email" className={authLabelClassName}>
          Email
        </Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(event) => {
            if (error) setError(null)
            setEmail(normalizeEmail(event.target.value))
          }}
          disabled={isSubmitting}
          autoComplete="email"
          className={authInputClassName}
        />
      </div>

      {error ? (
        <p className="text-sm leading-relaxed text-amber-300/90" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !email.trim()}
        className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </span>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
