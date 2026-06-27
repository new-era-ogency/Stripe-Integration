import { redirect } from "next/navigation"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import CompleteProfilePageClient from "./CompleteProfilePageClient"

export const dynamic = "force-dynamic"

export default async function CompleteProfilePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
  if (redirectPath === "/dashboard") {
    redirect("/dashboard")
  }

  return <CompleteProfilePageClient />
}
