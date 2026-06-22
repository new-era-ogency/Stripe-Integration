"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AuthPageShell from "@/components/auth/AuthPageShell"
import SignupForm from "@/components/auth/SignupForm"

function SignupPageContent() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    router.prefetch("/login")
    router.prefetch("/dashboard")

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/dashboard")
      }
    })
  }, [router, supabase.auth])

  return (
    <AuthPageShell
      title="PulseFlow"
      subtitle="Create your account to get started"
      backHref="/login"
      backLabel="← Back to sign in"
    >
      <SignupForm />
    </AuthPageShell>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageContent />
    </Suspense>
  )
}
