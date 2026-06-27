"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Crown, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TRIAL_PRO_PERIOD_DAYS } from "@/lib/trial/types"
import { cn } from "@/lib/utils"

type GuestProTrialBannerProps = {
  /** When set, skips client auth detection and uses this flag directly. */
  visible?: boolean
  variant?: "bar" | "card"
  className?: string
}

export default function GuestProTrialBanner({
  visible,
  variant = "bar",
  className,
}: GuestProTrialBannerProps) {
  const [shouldShow, setShouldShow] = useState(false)
  const [ready, setReady] = useState(visible !== undefined)

  useEffect(() => {
    if (visible !== undefined) {
      setShouldShow(visible)
      setReady(true)
      return
    }

    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setShouldShow(!user)
      setReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setShouldShow(!session?.user)
      setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [visible])

  if (!ready || !shouldShow) {
    return null
  }

  const trialLabel =
    TRIAL_PRO_PERIOD_DAYS === 30 ? "1 month" : `${TRIAL_PRO_PERIOD_DAYS} days`

  if (variant === "card") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-600/15 via-fuchsia-600/10 to-transparent px-5 py-5 sm:px-6",
          className
        )}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-violet-500/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/15 text-violet-200">
              <Crown className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Sign in and get {trialLabel} of Pro for free
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Full generation workflow, saved history, and all Pro features —
                no card required.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              <Sparkles className="size-4" />
              Start free Pro trial
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="text-center text-sm font-medium text-violet-300 transition-colors hover:text-violet-200"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "border-b border-violet-500/20 bg-gradient-to-r from-violet-600/15 via-fuchsia-600/10 to-violet-900/10",
        className
      )}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-[120px]">
        <div className="flex items-center gap-2.5 text-sm text-violet-100">
          <Crown className="size-4 shrink-0 text-violet-300" />
          <span>
            <span className="font-semibold text-white">
              Sign in and get {trialLabel} of Pro for free
            </span>
            <span className="hidden text-violet-200/80 sm:inline">
              {" "}
              — unlimited generations during your trial.
            </span>
          </span>
        </div>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/35 bg-violet-500/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-100 transition-colors hover:border-violet-400/50 hover:bg-violet-500/25"
        >
          Claim free Pro
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
