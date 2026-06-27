"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import AuthPageShell from "@/components/auth/AuthPageShell"
import CompleteProfileForm from "@/components/auth/CompleteProfileForm"

function CompleteProfilePageContent() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/login")
        return
      }

      const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
      if (redirectPath === "/dashboard") {
        router.replace("/dashboard")
        return
      }

      setIsReady(true)
    })
  }, [router])

  if (!isReady) {
    return null
  }

  return (
    <AuthPageShell title="PulseFlow" subtitle="One last step">
      <CompleteProfileForm />
    </AuthPageShell>
  )
}

export default function CompleteProfilePageClient() {
  return (
    <Suspense fallback={null}>
      <CompleteProfilePageContent />
    </Suspense>
  )
}
