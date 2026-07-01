"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import {
  computeProgressMetrics,
  formatDuration,
  GENERATION_STAGES,
  type GenerationProgressState,
} from "@/lib/generation/progress"
import type { UserTier } from "@/lib/profile"
import { cn } from "@/lib/utils"

type GenerationProgressPanelProps = {
  progress: GenerationProgressState
  tier: UserTier
}

export default function GenerationProgressPanel({
  progress,
  tier,
}: GenerationProgressPanelProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const metrics = computeProgressMetrics(progress, tier, now)

  return (
    <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300/90">
            Generation in progress
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            {metrics.currentStageMeta.label}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            {metrics.currentStageMeta.description}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Elapsed</p>
          <p className="font-mono text-sm text-zinc-200">
            {formatDuration(metrics.elapsedSeconds)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
          <span>~{formatDuration(metrics.totalEstimateSeconds)} typical</span>
          <span>
            ~{formatDuration(metrics.remainingSeconds)} remaining
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800/90">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-[width] duration-700 ease-out"
            style={{ width: `${metrics.percentComplete}%` }}
            role="progressbar"
            aria-valuenow={metrics.percentComplete}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Generation progress"
          />
        </div>
      </div>

      <ol className="mt-5 space-y-2.5">
        {progress.pipeline.map((stageId, index) => {
          const meta =
            stageId === "generate_posts"
              ? {
                  ...GENERATION_STAGES.generate_posts,
                  estimateSeconds:
                    tier === "pro_max" ? 100 : tier === "pro" ? 80 : 55,
                }
              : GENERATION_STAGES[stageId]

          const isComplete = index < metrics.currentStageIndex
          const isCurrent = stageId === progress.currentStage

          return (
            <li
              key={`${stageId}-${index}`}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                isCurrent
                  ? "border-violet-500/35 bg-violet-500/10"
                  : isComplete
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-zinc-800/80 bg-zinc-950/40"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                  isCurrent
                    ? "border-violet-400/50 bg-violet-500/20 text-violet-200"
                    : isComplete
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "border-zinc-700 bg-zinc-900 text-zinc-500"
                )}
                aria-hidden
              >
                {isComplete ? (
                  <Check className="size-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <span className="text-[10px] font-semibold">{index + 1}</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent
                        ? "text-violet-100"
                        : isComplete
                          ? "text-emerald-100"
                          : "text-zinc-400"
                    )}
                  >
                    {meta.label}
                    {isCurrent ? (
                      <span className="ml-2 text-xs font-normal text-violet-300/80">
                        — in progress
                      </span>
                    ) : null}
                  </p>
                  <span className="shrink-0 text-[10px] text-zinc-500">
                    ~{formatDuration(meta.estimateSeconds)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                  {meta.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
