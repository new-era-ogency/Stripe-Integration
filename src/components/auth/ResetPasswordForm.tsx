"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import { getAuthErrorMessage } from "@/lib/auth/errors"
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MIN_PASSWORD_LENGTH = 6

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [sessionValid, setSessionValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    void getClientAuthUser(supabase).then(({ user }) => {
      setSessionValid(Boolean(user))
      setIsCheckingSession(false)
    })
  }, [])

  const handleSubmit = async () => {
    setError(null)

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError("Password should be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(getAuthErrorMessage(updateError))
        setIsSubmitting(false)
        return
      }

      await supabase.auth.signOut()
      router.push("/login?reset=success")
    } catch {
      setError("Something went wrong while updating your password.")
      setIsSubmitting(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-6 animate-spin text-violet-400" />
      </div>
    )
  }

  if (!sessionValid) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm leading-relaxed text-zinc-400">
          This password reset link is invalid or has expired. Request a new link
          from the forgot password page.
        </p>
        <Button
          asChild
          className="h-11 w-full rounded-lg bg-white font-medium text-black hover:bg-zinc-200"
        >
          <Link href="/forgot-password">Request new reset link</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-5">
      <p className="text-sm leading-relaxed text-zinc-400">
        Choose a new password for your account. You&apos;ll sign in again after
        saving it.
      </p>

      <div className="space-y-2">
        <Label htmlFor="new-password" className={authLabelClassName}>
          New password
        </Label>
        <Input
          id="new-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => {
            if (error) setError(null)
            setPassword(event.target.value)
          }}
          disabled={isSubmitting}
          autoComplete="new-password"
          className={authInputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className={authLabelClassName}>
          Confirm new password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(event) => {
            if (error) setError(null)
            setConfirmPassword(event.target.value)
          }}
          disabled={isSubmitting}
          autoComplete="new-password"
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
        disabled={
          isSubmitting ||
          !password ||
          !confirmPassword ||
          password.length < MIN_PASSWORD_LENGTH
        }
        className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </span>
        ) : (
          "Save new password"
        )}
      </Button>
    </div>
  )
}
