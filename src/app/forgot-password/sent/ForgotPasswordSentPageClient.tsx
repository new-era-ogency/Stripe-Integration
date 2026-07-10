"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import AuthPageShell from "@/components/auth/AuthPageShell"
import { Button } from "@/components/ui/button"

function ForgotPasswordSentContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <AuthPageShell
      title="Check your email"
      subtitle="Password reset link sent"
      backHref="/login"
      backLabel="← Back to sign in"
    >
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/10">
          <Mail className="size-7 text-violet-300" />
        </div>

        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-zinc-300">
            If an account exists for this address, we sent a password reset link
            to:
          </p>
          {email ? (
            <p className="break-all text-sm font-medium text-white">{email}</p>
          ) : (
            <p className="text-sm font-medium text-white">your email address</p>
          )}
        </div>

        <p className="text-sm leading-relaxed text-zinc-500">
          Open the email and click the link to choose a new password. The link
          expires after a short time. Check your spam folder if you don&apos;t
          see it.
        </p>

        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-lg border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-900 hover:text-white"
        >
          <Link href="/login">Return to sign in</Link>
        </Button>
      </div>
    </AuthPageShell>
  )
}

export default function ForgotPasswordSentPageClient() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordSentContent />
    </Suspense>
  )
}
