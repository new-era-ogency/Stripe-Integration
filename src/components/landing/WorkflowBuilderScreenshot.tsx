"use client"

import { ArrowRight, Play, Plus } from "lucide-react"

type WorkflowNode = {
  id: string
  label: string
  type: "trigger" | "action" | "output"
}

const nodes: WorkflowNode[] = [
  { id: "stripe", label: "Stripe payment", type: "trigger" },
  { id: "webhook", label: "Webhook", type: "action" },
  { id: "slack", label: "Slack message", type: "action" },
  { id: "db", label: "Database update", type: "output" },
]

const nodeStyles = {
  trigger: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  action: "border-zinc-700 bg-zinc-900 text-zinc-200",
  output: "border-violet-500/40 bg-violet-500/10 text-violet-200",
}

type WorkflowBuilderScreenshotProps = {
  animated?: boolean
  highlight?: boolean
}

export default function WorkflowBuilderScreenshot({
  animated = false,
  highlight = false,
}: WorkflowBuilderScreenshotProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 ${
        highlight
          ? "border-violet-500/20 shadow-[0_24px_64px_-24px_rgba(139,92,246,0.35)]"
          : "border-zinc-800 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.7)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-white">Workflow builder</p>
          <p className="text-[10px] text-zinc-500">stripe-checkout.flow</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-zinc-700 px-2 py-1 text-[10px] text-zinc-400">
            Live
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1 text-[10px] font-semibold text-white"
          >
            <Play className="size-3" />
            Run
          </button>
        </div>
      </div>

      <div className="relative min-h-[200px] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.035)_1px,transparent_0)] bg-[size:18px_18px] p-5 md:min-h-[220px] md:p-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {nodes.map((node, index) => (
            <span key={node.id} className="flex items-center gap-2 md:gap-3">
              <div
                className={`rounded-lg border px-3 py-2 text-center text-[11px] font-medium md:min-w-[6.5rem] md:text-xs ${nodeStyles[node.type]} ${
                  animated && index === 0 ? "workflow-node-pulse" : ""
                } transition-transform hover:scale-[1.02]`}
              >
                {node.label}
              </div>
              {index < nodes.length - 1 ? (
                <ArrowRight
                  className={`size-4 shrink-0 text-zinc-600 ${
                    animated ? "workflow-arrow-flow" : ""
                  }`}
                  style={animated ? { animationDelay: `${index * 0.35}s` } : undefined}
                />
              ) : null}
            </span>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-dashed border-zinc-700/80 bg-zinc-900/60 px-3 py-1.5 text-[10px] text-zinc-500">
          <Plus className="size-3" />
          Add step
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 text-[10px] text-zinc-600">
        <span>4 nodes · 3 connections</span>
        <span className="text-emerald-500/80">Last run: 2s ago</span>
      </div>
    </div>
  )
}
