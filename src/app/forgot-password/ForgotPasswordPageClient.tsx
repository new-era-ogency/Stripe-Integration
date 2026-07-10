"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import AuthPageShell from "@/components/auth/AuthPageShell"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"

function ForgotPasswordPageContent() {
  const router = useRouter()

  useEffect(() => {
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
      title="Reset password"
      subtitle="We'll email you a secure link"
      backHref="/login"
      backLabel="← Back to sign in"
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}

export default function ForgotPasswordPageClient() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}
