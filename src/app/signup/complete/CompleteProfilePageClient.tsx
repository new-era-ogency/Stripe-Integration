"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AuthPageShell from "@/components/auth/AuthPageShell"
import CompleteProfileForm from "@/components/auth/CompleteProfileForm"

function CompleteProfilePageContent() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/login")
        return
      }

      const { data: profile } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .maybeSingle()

      if (profile?.username) {
        router.replace("/dashboard")
        return
      }

      setIsChecking(false)
    })
  }, [router])

  if (isChecking) {
    return null
  }

  return (
    <AuthPageShell
      title="PulseFlow"
      subtitle="Pick a username for your account"
      backHref="/dashboard"
      backLabel="← Back to dashboard"
    >
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
