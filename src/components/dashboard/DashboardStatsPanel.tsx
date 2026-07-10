"use client"

import { dash } from "@/lib/dashboard/theme-classes"

type DashboardStatsPanelProps = {
  authChecked: boolean
  isGuest: boolean
  generationsCount: number
  hasOpenAiKey: boolean
}

const panelClass = `${dash.card} p-4 transition-colors hover:border-zinc-700/80 light:hover:border-violet-300`

export default function DashboardStatsPanel({
  authChecked,
  isGuest,
  generationsCount,
  hasOpenAiKey,
}: DashboardStatsPanelProps) {
  return (
    <aside className="space-y-3">
      <div className={`${dash.section} p-4`}>
        <p className={dash.label}>BYOK dashboard</p>
        <p className={`mt-2 ${dash.body}`}>
          PulseFlow is free. Add your OpenRouter key in{" "}
          <a
            href="#settings"
            className="font-medium text-violet-300 hover:text-violet-200 light:text-violet-700 light:hover:text-violet-900"
          >
            Settings
          </a>
          , add a source in{" "}
          <a
            href="#create"
            className="font-medium text-violet-300 hover:text-violet-200 light:text-violet-700 light:hover:text-violet-900"
          >
            Create
          </a>
          , and generate from your browser.
        </p>
      </div>

      {!isGuest && authChecked && hasOpenAiKey ? (
        <div className={panelClass}>
          <p className={`text-xs ${dash.muted}`}>OpenRouter usage</p>
          <p className={`mt-2 text-base font-medium ${dash.heading} light:text-violet-950`}>
            ~$0.01 / run
          </p>
          <p className={`mt-1 text-xs ${dash.muted}`}>
            Billed directly by OpenRouter to your account.
          </p>
        </div>
      ) : null}

      <div className={panelClass}>
        <p className={`text-xs ${dash.muted}`}>Saved generations</p>
        {!authChecked ? (
          <div className={`mt-2 h-7 w-12 ${dash.skeleton}`} />
        ) : (
          <p className={`mt-2 text-base font-medium ${dash.heading} light:text-violet-950`}>
            {isGuest ? "—" : generationsCount}
          </p>
        )}
        {!isGuest && authChecked ? (
          <a
            href="#history"
            className={`mt-2 inline-block text-xs ${dash.muted} hover:text-zinc-300 light:hover:text-violet-900`}
          >
            Jump to history →
          </a>
        ) : null}
      </div>
    </aside>
  )
}
