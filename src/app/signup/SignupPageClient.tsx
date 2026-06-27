"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import AuthPageShell from "@/components/auth/AuthPageShell"
import SignupForm from "@/components/auth/SignupForm"

function SignupPageContent() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/login")
    router.prefetch("/dashboard")

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        return
      }

      const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
      router.replace(redirectPath)
    })
  }, [router])

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

export default function SignupPageClient() {
  return (
    <Suspense fallback={null}>
      <SignupPageContent />
    </Suspense>
  )
}
