"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
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
      footer={
        <p className="text-sm text-zinc-500">
          Just exploring?{" "}
          <Link
            href="/dashboard"
            className="font-medium text-violet-300 transition-colors hover:text-violet-200"
          >
            Open the dashboard without signing in
          </Link>
        </p>
      }
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
