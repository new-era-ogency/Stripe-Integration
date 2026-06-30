"use client"

import Link from "next/link"
import { ArrowRight, KeyRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function ByokLandingBanner() {
  const [isGuest, setIsGuest] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
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

  if (!ready || !isGuest) {
    return null
  }

  return (
    <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-600/10 via-violet-600/10 to-transparent">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-[120px]">
        <div className="flex items-center gap-2.5 text-sm text-emerald-100">
          <KeyRound className="size-4 shrink-0 text-emerald-300" />
          <span>
            <span className="font-semibold text-white">
              Try the interactive demo
            </span>
            <span className="hidden text-emerald-200/80 sm:inline">
              {" "}
              — no signup. Play with Kanban, AI chat, and AI Meetings in your browser.
            </span>
          </span>
        </div>
        <a
          href="/#interactive-demo"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-100 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/25"
        >
          Try Interactive Demo
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
