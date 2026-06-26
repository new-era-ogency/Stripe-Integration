"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AuthPageShell from "@/components/auth/AuthPageShell"
import LoginForm from "@/components/auth/LoginForm"

function LoginPageContent() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/dashboard")
    router.prefetch("/signup")

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/dashboard")
      }
    })
  }, [router])

  return (
    <AuthPageShell
      title="PulseFlow"
      subtitle="Sign in when you're ready to generate"
    >
      <LoginForm />
    </AuthPageShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}
