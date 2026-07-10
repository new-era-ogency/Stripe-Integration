"use client"

import AuthPageShell from "@/components/auth/AuthPageShell"
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"

export default function ResetPasswordPageClient() {
  return (
    <AuthPageShell
      title="New password"
      subtitle="Create a secure password"
      backHref="/login"
      backLabel="← Back to sign in"
    >
      <ResetPasswordForm />
    </AuthPageShell>
  )
}
