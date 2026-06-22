import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import CreditBalance from "@/components/layout/CreditBalance"
import SubscriptionTierBadge from "@/components/layout/SubscriptionTierBadge"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default async function UserNav() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  async function signOut() {
    "use server"
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <Link
        href="/"
        className="text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
      >
        Home
      </Link>
      {user ? (
        <div className="flex items-center space-x-3 sm:space-x-4">
          <SubscriptionTierBadge />
          <CreditBalance />
          <span className="hidden text-sm text-zinc-300 sm:inline">{user.email}</span>
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="border-zinc-800 bg-[#09090b] text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Sign Out
            </Button>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-2 text-xs uppercase tracking-widest text-zinc-300 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          Sign In
        </Link>
      )}
    </div>
  )
}
