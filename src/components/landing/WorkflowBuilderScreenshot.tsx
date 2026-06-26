"use client"

import { ArrowRight, Play, Plus } from "lucide-react"

type WorkflowNode = {
  id: string
  label: string
  type: "trigger" | "action" | "output"
  x: number
  y: number
}

const nodes: WorkflowNode[] = [
  { id: "stripe", label: "Stripe payment", type: "trigger", x: 0, y: 50 },
  { id: "user", label: "Create user", type: "action", x: 1, y: 50 },
  { id: "email", label: "Send email", type: "action", x: 2, y: 50 },
  { id: "db", label: "Update database", type: "output", x: 3, y: 50 },
]

const nodeStyles = {
  trigger: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  action: "border-zinc-700 bg-zinc-900 text-zinc-200",
  output: "border-violet-500/40 bg-violet-500/10 text-violet-200",
}

export default function WorkflowBuilderScreenshot() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-white">Workflow builder</p>
          <p className="text-[10px] text-zinc-500">stripe-onboarding.flow</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-zinc-700 px-2 py-1 text-[10px] text-zinc-400">
            Draft
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

      <div className="relative min-h-[220px] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:20px_20px] p-6">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {nodes.map((node, index) => (
            <span key={node.id} className="flex items-center gap-3 md:gap-4">
              <div
                className={`rounded-xl border px-3 py-2.5 text-center text-[11px] font-medium md:min-w-[7rem] md:text-xs ${nodeStyles[node.type]}`}
              >
                {node.label}
              </div>
              {index < nodes.length - 1 ? (
                <ArrowRight className="size-4 shrink-0 text-zinc-600" />
              ) : null}
            </span>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/80 px-3 py-2 text-[10px] text-zinc-500">
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
