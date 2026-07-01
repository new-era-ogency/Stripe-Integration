"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import AuthPageShell from "@/components/auth/AuthPageShell"
import LoginForm from "@/components/auth/LoginForm"

function LoginPageContent() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/dashboard")
    router.prefetch("/signup")

    const supabase = createClient()
    void getClientAuthUser(supabase).then(async ({ user }) => {
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
      subtitle="Sign in when you're ready to generate"
    >
      <LoginForm />
    </AuthPageShell>
  )
}

export default function LoginPageClient() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}
