"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import AuthPageShell from "@/components/auth/AuthPageShell"
import SignupForm from "@/components/auth/SignupForm"

function SignupPageContent() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/login")
    router.prefetch("/dashboard")

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
      subtitle="Create your account to get started"
      backHref="/login"
      backLabel="← Back to sign in"
      footer={
        <p className="text-sm text-zinc-500">
          Want to try first?{" "}
          <Link
            href="/dashboard"
            className="font-medium text-violet-300 transition-colors hover:text-violet-200"
          >
            Open the free dashboard
          </Link>
        </p>
      }
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
