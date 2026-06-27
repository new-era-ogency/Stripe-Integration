import Link from "next/link"
import { Sparkles, Zap } from "lucide-react"
import { isProMaxTier, isProTier, type UserTier } from "@/lib/profile"

type DashboardStatsPanelProps = {
  authChecked: boolean
  isGuest: boolean
  tier: UserTier
  planLabel: string
  creditsRemaining: number
  generationsCount: number
  hasTrialAccess: boolean
  trialDaysRemaining?: number
}

const panelClass =
  "rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition-colors hover:border-zinc-700/80"

export default function DashboardStatsPanel({
  authChecked,
  isGuest,
  tier,
  planLabel,
  creditsRemaining,
  generationsCount,
  hasTrialAccess,
  trialDaysRemaining,
}: DashboardStatsPanelProps) {
  const isPro = isProTier(tier) && !isGuest
  const isProMax = isProMaxTier(tier) && !isGuest

  return (
    <aside className="space-y-3">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Your workspace
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Paste a YouTube URL in{" "}
          <a href="#create" className="font-medium text-violet-300 hover:text-violet-200">
            Create
          </a>
          , pick a tone, and generate X, LinkedIn, and Telegram outputs in one
          run.
        </p>
      </div>

      <div className={panelClass}>
        <p className="text-xs text-zinc-500">Plan</p>
        {!authChecked ? (
          <div className="mt-2 h-7 w-28 animate-pulse rounded bg-zinc-900" />
        ) : (
          <div className="mt-2 flex items-center gap-2">
            {isProMax ? (
              <Zap className="size-4 text-orange-400" />
            ) : isPro ? (
              <Sparkles className="size-4 text-violet-400" />
            ) : (
              <span className="size-2 rounded-full bg-zinc-600" />
            )}
            <p className="text-base font-medium text-white">
              {isGuest ? "Guest" : `${planLabel} Plan`}
            </p>
          </div>
        )}
        {!isGuest && authChecked && hasTrialAccess && trialDaysRemaining ? (
          <p className="mt-2 text-xs text-violet-300">
            Pro trial · {trialDaysRemaining} day
            {trialDaysRemaining === 1 ? "" : "s"} left
          </p>
        ) : null}
        {!isGuest && authChecked && !isPro ? (
          <Link
            href="/pricing"
            className="mt-2 inline-block text-xs text-violet-400 hover:text-violet-300"
          >
            Upgrade to Pro →
          </Link>
        ) : null}
      </div>

      <div className={panelClass}>
        <p className="text-xs text-zinc-500">Credits</p>
        {!authChecked ? (
          <div className="mt-2 h-7 w-24 animate-pulse rounded bg-zinc-900" />
        ) : (
          <p className="mt-2 text-base font-medium text-white">
            {isGuest ? "—" : hasTrialAccess ? "Trial active" : `${creditsRemaining} left`}
          </p>
        )}
        {!isGuest && authChecked && !hasTrialAccess ? (
          <p className="mt-1 text-xs text-zinc-500">1 credit per generation</p>
        ) : null}
      </div>

      <div className={panelClass}>
        <p className="text-xs text-zinc-500">Saved generations</p>
        {!authChecked ? (
          <div className="mt-2 h-7 w-12 animate-pulse rounded bg-zinc-900" />
        ) : (
          <p className="mt-2 text-base font-medium text-white">
            {isGuest ? "—" : generationsCount}
          </p>
        )}
        {!isGuest && authChecked ? (
          <a
            href="#history"
            className="mt-2 inline-block text-xs text-zinc-500 hover:text-zinc-300"
          >
            Jump to history →
          </a>
        ) : null}
      </div>
    </aside>
  )
}
