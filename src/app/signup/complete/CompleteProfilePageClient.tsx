"use client"

import { Suspense } from "react"
import AuthPageShell from "@/components/auth/AuthPageShell"
import CompleteProfileForm from "@/components/auth/CompleteProfileForm"

function CompleteProfilePageContent() {
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
