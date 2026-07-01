"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import OpenAiKeyStatusBadge from "@/components/openai/OpenAiKeyStatusBadge"

type AuthNavButtonsProps = {
  signInClassName?: string
  signedInClassName?: string
  /** When false, key status is shown elsewhere (e.g. dashboard header). */
  showKeyBadge?: boolean
}

export default function AuthNavButtons({
  signInClassName = "rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-2 text-[11px] uppercase tracking-widest text-zinc-300 transition-colors hover:border-violet-500/30 hover:text-white",
  signedInClassName = "rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2 text-[11px] uppercase tracking-widest text-zinc-300 transition-colors hover:border-violet-500/30 hover:text-white",
  showKeyBadge = true,
}: AuthNavButtonsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_IN" && session) {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
    router.push("/")
  }

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-900" />
  }

  if (user) {
    return (
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {showKeyBadge ? (
          <OpenAiKeyStatusBadge size="sm" className="hidden sm:inline-flex" />
        ) : null}
        <button
          type="button"
          onClick={handleSignOut}
          className={signedInClassName}
        >
          Log Out
        </button>
      </div>
    )
  }

  return (
    <Link href="/login" className={signInClassName}>
      Sign In
    </Link>
  )
}
