"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Check,
  FileVideo,
  Kanban,
  ListTodo,
  Sparkles,
  Upload,
} from "lucide-react"
import { meetingScript } from "@/lib/interactive-demo-data"
import { ctaStrategy } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    id: "upload",
    label: "Upload meeting",
    shortLabel: "Upload",
    icon: Upload,
    accent: "emerald",
  },
  {
    id: "extract",
    label: "AI extracts tasks",
    shortLabel: "Extract",
    icon: Sparkles,
    accent: "cyan",
  },
  {
    id: "kanban",
    label: "Kanban updated",
    shortLabel: "Sync",
    icon: Kanban,
    accent: "violet",
  },
] as const

const STEP_MS = 3200

const accentStyles = {
  emerald: {
    active:
      "border-emerald-400/50 bg-emerald-500/15 text-emerald-100 shadow-[0_0_24px_-6px_rgba(52,211,153,0.55)]",
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
    line: "from-emerald-500/70",
  },
  cyan: {
    active:
      "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]",
    icon: "text-cyan-400",
    dot: "bg-cyan-400",
    line: "from-cyan-500/70",
  },
  violet: {
    active:
      "border-violet-400/50 bg-violet-500/15 text-violet-100 shadow-[0_0_24px_-6px_rgba(139,92,246,0.55)]",
    icon: "text-violet-400",
    dot: "bg-violet-400",
    line: "from-violet-500/70",
  },
} as const

function UploadPreview({ progress }: { progress: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
          <FileVideo className="size-5 text-emerald-400" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {meetingScript.fileName}
          </p>
          <p className="text-xs text-zinc-500">{meetingScript.duration} · Product sync</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-medium tabular-nums text-emerald-300">
          {progress}%
        </span>
      </div>
      <div className="flex gap-2">
        {["Audio", "Video", "Transcript"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] text-zinc-500"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function ExtractPreview({ visibleTasks }: { visibleTasks: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
          AI summary
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-300">
          Team aligned on public beta — interactive demo as hero, BYOK privacy
          unchanged.
        </p>
      </div>
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          <ListTodo className="size-3" aria-hidden />
          Action items
        </p>
        {meetingScript.tasks.map((task, index) => (
          <div
            key={task}
            className={cn(
              "flex items-start gap-2 rounded-lg border px-2.5 py-2 text-xs transition-all duration-500",
              index < visibleTasks
                ? "translate-y-0 border-cyan-500/25 bg-cyan-500/10 text-cyan-100 opacity-100"
                : "translate-y-1 border-transparent bg-transparent text-transparent opacity-0"
            )}
          >
            <Check className="mt-0.5 size-3 shrink-0 text-cyan-400" aria-hidden />
            <span>{task}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KanbanPreview({ showCard }: { showCard: boolean }) {
  const columns = [
    { label: "Backlog", count: 2 },
    { label: "In progress", count: 1, highlight: true },
    { label: "Done", count: 1 },
  ]

  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="grid grid-cols-3 gap-2">
        {columns.map((column) => (
          <div
            key={column.label}
            className={cn(
              "rounded-lg border p-2 transition-colors duration-500",
              column.highlight
                ? "border-violet-500/35 bg-violet-500/10"
                : "border-zinc-800 bg-zinc-900/60"
            )}
          >
            <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
              {column.label}
            </p>
            <div className="mt-2 space-y-1.5">
              {column.highlight && showCard ? (
                <div className="hero-flow-card-enter rounded-md border border-violet-400/40 bg-violet-500/20 px-2 py-1.5 text-[10px] font-medium leading-snug text-violet-100">
                  {meetingScript.decision.slice(0, 42)}…
                </div>
              ) : (
                <div
                  className={cn(
                    "h-7 rounded-md border border-zinc-800/80 bg-zinc-950/80",
                    column.highlight && !showCard && "animate-pulse"
                  )}
                />
              )}
              <div className="h-5 rounded-md border border-zinc-800/60 bg-zinc-950/50" />
            </div>
          </div>
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-violet-300">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-40" />
          <span className="relative inline-flex size-2 rounded-full bg-violet-400" />
        </span>
        Decision synced to Kanban — no copy-paste
      </p>
    </div>
  )
}

export default function HeroFlowPreview() {
  const [activeStep, setActiveStep] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [visibleTasks, setVisibleTasks] = useState(0)
  const [showKanbanCard, setShowKanbanCard] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % STEPS.length)
    }, STEP_MS)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    setUploadProgress(0)
    setVisibleTasks(0)
    setShowKanbanCard(false)

    if (activeStep === 0) {
      const tick = window.setInterval(() => {
        setUploadProgress((value) => (value >= 100 ? 100 : value + 8))
      }, 180)
      return () => window.clearInterval(tick)
    }

    if (activeStep === 1) {
      const timers = meetingScript.tasks.map((_, index) =>
        window.setTimeout(() => setVisibleTasks(index + 1), 400 + index * 450)
      )
      return () => timers.forEach((timer) => window.clearTimeout(timer))
    }

    const timer = window.setTimeout(() => setShowKanbanCard(true), 500)
    return () => window.clearTimeout(timer)
  }, [activeStep])

  const activeAccent = accentStyles[STEPS[activeStep].accent]

  return (
    <div className="hero-flow-shell landing-product-glow relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-1 shadow-[0_32px_80px_-40px_rgba(139,92,246,0.45)] backdrop-blur-sm">
      <div className="rounded-[14px] border border-zinc-800/60 bg-zinc-950/90 p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              The flow
            </p>
          </div>
          <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] text-zinc-500">
            Live preview
          </span>
        </div>

        <p className="mt-3 text-lg font-semibold tracking-tight text-white md:text-xl">
          Conversation{" "}
          <span className="text-zinc-600">→</span> clarity{" "}
          <span className="text-zinc-600">→</span>{" "}
          <span className="bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
            committed work
          </span>
        </p>

        <div className="relative mt-6">
          <div
            className="absolute left-[16%] right-[16%] top-1/2 hidden h-px -translate-y-1/2 bg-zinc-800 md:block"
            aria-hidden
          />
          <div
            className={cn(
              "absolute left-[16%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r to-transparent transition-all duration-700 md:block",
              activeAccent.line,
              activeStep === 0 && "w-0",
              activeStep === 1 && "w-[34%]",
              activeStep === 2 && "w-[68%]"
            )}
            aria-hidden
          />

          <ol className="relative grid grid-cols-3 gap-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const styles = accentStyles[step.accent]
              const isActive = index === activeStep
              const isComplete = index < activeStep

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={cn(
                      "group flex w-full flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-all duration-500 md:px-3",
                      isActive
                        ? styles.active
                        : isComplete
                          ? "border-zinc-700/80 bg-zinc-900/80 text-zinc-300"
                          : "border-zinc-800/80 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg border transition-colors",
                        isActive
                          ? "border-white/10 bg-black/20"
                          : "border-zinc-800 bg-zinc-900/80"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 transition-colors",
                          isActive || isComplete ? styles.icon : "text-zinc-500"
                        )}
                        aria-hidden
                      />
                    </span>
                    <span className="hidden text-[11px] font-medium leading-tight sm:block">
                      {step.label}
                    </span>
                    <span className="text-[10px] font-medium leading-tight sm:hidden">
                      {step.shortLabel}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-xl border border-zinc-800/80 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:16px_16px] p-4 md:min-h-[188px] md:p-5">
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-80",
              activeAccent.line
            )}
            aria-hidden
          />

          <div key={activeStep} className="hero-flow-panel-enter h-full">
            {activeStep === 0 ? (
              <UploadPreview progress={uploadProgress} />
            ) : activeStep === 1 ? (
              <ExtractPreview visibleTasks={visibleTasks} />
            ) : (
              <KanbanPreview showCard={showKanbanCard} />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
          <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
            3 action items
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
            1 decision captured
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-emerald-400/90">
            ~42 min → 12 sec
          </span>
        </div>

        <Link
          href={ctaStrategy.primary.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition-colors hover:text-violet-200"
        >
          Play with the full product shell
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
