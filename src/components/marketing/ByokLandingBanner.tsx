"use client"

import { ArrowRight, KeyRound } from "lucide-react"
import DashboardCtaLink from "@/components/marketing/DashboardCtaLink"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import { ctaStrategy } from "@/lib/landing-content"
import { useEffect, useState } from "react"

export default function ByokLandingBanner() {
  const [isGuest, setIsGuest] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    void getClientAuthUser(supabase).then(({ user }) => {
      setIsGuest(!user)
      setReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsGuest(!session?.user)
      setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!ready) {
    return null
  }

  return (
    <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-600/10 via-violet-600/10 to-transparent">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-[120px]">
        <div className="flex items-center gap-2.5 text-sm text-emerald-100">
          <KeyRound className="size-4 shrink-0 text-emerald-300" />
          <span>
            {isGuest ? (
              <>
                <span className="font-semibold text-white">
                  Free BYOK dashboard
                </span>
                <span className="hidden text-emerald-200/80 sm:inline">
                  {" "}
                  — paste a YouTube link and generate, or try the interactive demo first.
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold text-white">
                  Welcome back
                </span>
                <span className="hidden text-emerald-200/80 sm:inline">
                  {" "}
                  — continue where you left off in your dashboard.
                </span>
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isGuest ? (
            <a
              href={ctaStrategy.primary.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              Try demo
              <ArrowRight className="size-3.5" />
            </a>
          ) : null}
          <DashboardCtaLink
            variant="compact"
            label={isGuest ? "Open dashboard" : "Go to dashboard"}
          />
        </div>
      </div>
    </div>
  )
}
