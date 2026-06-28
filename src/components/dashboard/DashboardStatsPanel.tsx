"use client"

type DashboardStatsPanelProps = {
  authChecked: boolean
  isGuest: boolean
  generationsCount: number
  hasOpenAiKey: boolean
}

const panelClass =
  "rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition-colors hover:border-zinc-700/80"

export default function DashboardStatsPanel({
  authChecked,
  isGuest,
  generationsCount,
  hasOpenAiKey,
}: DashboardStatsPanelProps) {
  return (
    <aside className="space-y-3">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          BYOK dashboard
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          PulseFlow is free. Connect your OpenAI key in the header, add a
          source in{" "}
          <a href="#create" className="font-medium text-violet-300 hover:text-violet-200">
            Create
          </a>
          , and generate from your browser.
        </p>
      </div>

      {!isGuest && authChecked && hasOpenAiKey ? (
        <div className={panelClass}>
          <p className="text-xs text-zinc-500">OpenAI usage</p>
          <p className="mt-2 text-base font-medium text-white">~$0.01 / run</p>
          <p className="mt-1 text-xs text-zinc-500">
            Billed directly by OpenAI to your account.
          </p>
        </div>
      ) : null}

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
