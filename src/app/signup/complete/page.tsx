"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AuthPageShell from "@/components/auth/AuthPageShell"
import CompleteProfileForm from "@/components/auth/CompleteProfileForm"

function CompleteProfilePageContent() {
  const router = useRouter()
  const supabase = createClient()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
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
  }, [router, supabase])

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

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={null}>
      <CompleteProfilePageContent />
    </Suspense>
  )
}
