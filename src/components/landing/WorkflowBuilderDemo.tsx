"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
  Play,
  Plus,
  Zap,
} from "lucide-react"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import { BTN_PRIMARY } from "@/lib/landing-styles"
import {
  demoCoachSteps,
  demoRunOutput,
  demoSlotOptions,
  demoStarterNode,
  type DemoChainNode,
  type DemoNodeType,
} from "@/lib/landing-demo"

const nodeStyles: Record<DemoNodeType, string> = {
  trigger: "border-emerald-500/45 bg-emerald-500/10 text-emerald-200",
  action: "border-zinc-600 bg-zinc-900/90 text-zinc-100",
  output: "border-violet-500/45 bg-violet-500/10 text-violet-100",
}

const portStyles: Record<DemoNodeType, string> = {
  trigger: "bg-emerald-400",
  action: "bg-zinc-400",
  output: "bg-violet-400",
}

type WorkflowBuilderDemoProps = {
  id?: string
  showSignupCta?: boolean
  className?: string
}

export default function WorkflowBuilderDemo({
  id,
  showSignupCta = false,
  className = "",
}: WorkflowBuilderDemoProps) {
  const [slots, setSlots] = useState<(DemoChainNode | null)[]>([null, null])
  const [openSlot, setOpenSlot] = useState<number | null>(0)
  const [runState, setRunState] = useState<"idle" | "running" | "done">("idle")
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1)
  const [runLog, setRunLog] = useState<string[]>([])
  const popoverRef = useRef<HTMLDivElement>(null)

  const chain = useMemo(
    () => [demoStarterNode, ...slots.filter(Boolean)] as DemoChainNode[],
    [slots]
  )

  const isComplete = slots.every(Boolean)
  const filledCount = slots.filter(Boolean).length

  useEffect(() => {
    if (filledCount === 0) {
      setOpenSlot(0)
    } else if (filledCount === 1 && slots[1] === null) {
      setOpenSlot(1)
    } else {
      setOpenSlot(null)
    }
  }, [filledCount, slots])

  useEffect(() => {
    if (openSlot === null) return

    const onPointerDown = (event: MouseEvent) => {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setOpenSlot(null)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [openSlot])

  const pickNode = (slotIndex: number, node: DemoChainNode) => {
    setSlots((prev) => {
      const next = [...prev]
      next[slotIndex] = node
      return next
    })
    setOpenSlot(null)
    setRunState("idle")
    setRunLog([])
  }

  const runWorkflow = useCallback(() => {
    if (!isComplete || runState === "running") return

    setRunState("running")
    setRunLog([])
    setActiveNodeIndex(-1)

    const fullChain = [demoStarterNode, ...slots.filter(Boolean)] as DemoChainNode[]
    const logs = fullChain.map(
      (node, i) => `[${i + 1}/${fullChain.length}] ${node.label} ✓`
    )

    fullChain.forEach((_, index) => {
      setTimeout(() => {
        setActiveNodeIndex(index)
        setRunLog((prev) => [...prev, logs[index]])
      }, index * 520)
    })

    setTimeout(() => {
      setRunState("done")
      setActiveNodeIndex(-1)
      setRunLog((prev) => [
        ...prev,
        `Done in ${demoRunOutput.duration} — 3 outputs ready`,
      ])
    }, fullChain.length * 520 + 400)
  }, [isComplete, runState, slots])

  const resetDemo = () => {
    setSlots([null, null])
    setRunState("idle")
    setRunLog([])
    setActiveNodeIndex(-1)
    setOpenSlot(0)
  }

  return (
    <div id={id} className={className}>
      <div
        className={`overflow-hidden rounded-2xl border bg-zinc-950 shadow-[0_32px_80px_-32px_rgba(139,92,246,0.35)] ${
          runState === "done"
            ? "border-emerald-500/30"
            : "border-violet-500/25"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
          <div className="flex items-center gap-3">
            <PulseFlowLogo size={32} />
            <div>
              <p className="text-sm font-semibold text-white">Workflow builder</p>
              <p className="font-mono text-[10px] text-zinc-500">
                youtube-repurpose.flow · {chain.length} nodes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {runState === "done" ? (
              <button
                type="button"
                onClick={resetDemo}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                Reset
              </button>
            ) : null}
            <button
              type="button"
              onClick={runWorkflow}
              disabled={!isComplete || runState === "running"}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                isComplete && runState !== "running"
                  ? "bg-violet-600 text-white shadow-[0_4px_20px_-4px_rgba(139,92,246,0.6)] hover:bg-violet-500"
                  : "cursor-not-allowed bg-zinc-800 text-zinc-600"
              }`}
            >
              {runState === "running" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  Run workflow
                </>
              )}
            </button>
          </div>
        </div>

        {runState !== "done" ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-zinc-800/80 bg-black/40 px-4 py-2">
            {demoCoachSteps.map((step, i) => (
              <span
                key={step}
                className={`flex items-center gap-1.5 text-[11px] ${
                  (i === 0 && filledCount === 0) ||
                  (i === 1 && filledCount === 1) ||
                  (i === 2 && isComplete && runState === "idle")
                    ? "font-medium text-violet-300"
                    : "text-zinc-600"
                }`}
              >
                <span className="flex size-4 items-center justify-center rounded-full border border-current text-[9px]">
                  {i + 1}
                </span>
                {step}
              </span>
            ))}
          </div>
        ) : null}

        <div className="relative min-h-[220px] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:20px_20px] p-4 md:min-h-[260px] md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
            <DemoNodeCard
              node={demoStarterNode}
              isActive={activeNodeIndex === 0}
              isRunning={runState === "running"}
            />

            {slots.map((slotNode, slotIndex) => (
              <span key={slotIndex} className="flex items-center">
                <ConnectionEdge
                  connected={Boolean(slotNode)}
                  animating={
                    runState === "running" &&
                    activeNodeIndex >= slotIndex &&
                    activeNodeIndex > 0
                  }
                />

                {slotNode ? (
                  <DemoNodeCard
                    node={slotNode}
                    isActive={activeNodeIndex === slotIndex + 1}
                    isRunning={runState === "running"}
                    onRemove={() => {
                      setSlots((prev) => {
                        const next = [...prev]
                        next[slotIndex] = null
                        return next
                      })
                      setRunState("idle")
                      setRunLog([])
                    }}
                  />
                ) : (
                  <div
                    className="relative"
                    ref={openSlot === slotIndex ? popoverRef : undefined}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSlot(openSlot === slotIndex ? null : slotIndex)
                      }
                      className={`demo-slot-empty flex min-h-[4.5rem] min-w-[7.5rem] flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-3 transition-all ${
                        openSlot === slotIndex
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-zinc-700/80 bg-zinc-900/40 text-zinc-500 hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-300"
                      } ${filledCount === slotIndex ? "demo-slot-pulse" : ""}`}
                    >
                      <Plus className="size-4" />
                      <span className="mt-1 text-xs font-medium">Add node</span>
                    </button>

                    {openSlot === slotIndex ? (
                      <div className="absolute left-1/2 top-full z-30 mt-2 w-52 -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-900 p-1.5 shadow-xl">
                        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Connect a step
                        </p>
                        {demoSlotOptions[slotIndex]?.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => pickNode(slotIndex, option)}
                            className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-violet-500/10"
                          >
                            <Zap className="mt-0.5 size-3 shrink-0 text-violet-400" />
                            <span>
                              <span className="block text-xs font-medium text-zinc-200">
                                {option.label}
                              </span>
                              <span className="block text-[10px] text-zinc-500">
                                {option.sublabel}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-black/50 px-4 py-3">
          {runLog.length > 0 ? (
            <div className="mb-3 font-mono text-[10px] leading-relaxed text-zinc-500">
              {runLog.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-600">
              {isComplete
                ? "Chain complete — press Run workflow to execute."
                : `${2 - filledCount} node${filledCount === 1 ? "" : "s"} left to connect.`}
            </p>
          )}

          {runState === "done" ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-300">
                  {demoRunOutput.headline} in {demoRunOutput.duration}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {demoRunOutput.platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-zinc-700/80 bg-black/40 px-2 py-0.5 text-[10px] text-zinc-400"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-zinc-400">
                {demoRunOutput.preview}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {showSignupCta ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            You just built a workflow in seconds. Sign up to run it on your videos.
          </p>
          <Link href="/signup" className={`group inline-flex ${BTN_PRIMARY}`}>
            Start free beta
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function DemoNodeCard({
  node,
  isActive,
  isRunning,
  onRemove,
}: {
  node: DemoChainNode
  isActive: boolean
  isRunning: boolean
  onRemove?: () => void
}) {
  return (
    <div
      className={`group relative flex min-w-[7.5rem] flex-col rounded-xl border px-4 py-3 transition-all ${
        nodeStyles[node.type]
      } ${
        isActive
          ? "demo-node-running scale-[1.02] ring-2 ring-violet-500/50"
          : isRunning
            ? "opacity-70"
            : ""
      }`}
    >
      <div
        className={`absolute -left-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full ${portStyles[node.type]} ring-2 ring-zinc-950`}
        aria-hidden
      />
      <div
        className={`absolute -right-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full ${portStyles[node.type]} ring-2 ring-zinc-950`}
        aria-hidden
      />
      <p className="text-xs font-semibold leading-tight">{node.label}</p>
      <p className="mt-0.5 text-[10px] opacity-70">{node.sublabel}</p>
      {onRemove && !isRunning ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 hidden size-5 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-[10px] text-zinc-500 group-hover:flex hover:border-red-500/50 hover:text-red-400"
          aria-label={`Remove ${node.label}`}
        >
          ×
        </button>
      ) : null}
    </div>
  )
}

function ConnectionEdge({
  connected,
  animating,
}: {
  connected: boolean
  animating: boolean
}) {
  return (
    <span
      className={`mx-1 flex items-center md:mx-2 ${
        animating ? "demo-edge-flow" : ""
      }`}
      aria-hidden
    >
      <span
        className={`h-px w-4 md:w-8 ${
          connected ? "bg-violet-500/60" : "bg-zinc-700"
        } ${animating ? "demo-edge-glow" : ""}`}
      />
      <ChevronRight
        className={`size-4 shrink-0 ${
          connected ? "text-violet-500/80" : "text-zinc-700"
        } ${animating ? "workflow-arrow-flow" : ""}`}
      />
      <span
        className={`h-px w-4 md:w-8 ${
          connected ? "bg-violet-500/60" : "bg-zinc-700"
        } ${animating ? "demo-edge-glow" : ""}`}
      />
    </span>
  )
}
