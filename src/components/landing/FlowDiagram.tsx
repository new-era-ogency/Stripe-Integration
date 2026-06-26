"use client"

import { ArrowRight } from "lucide-react"

type FlowDiagramProps = {
  nodes: readonly string[]
  compact?: boolean
  animated?: boolean
}

export default function FlowDiagram({
  nodes,
  compact = false,
  animated = false,
}: FlowDiagramProps) {
  return (
    <div
      className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "gap-2 md:gap-2.5"}`}
    >
      {nodes.map((node, index) => (
        <span key={`${node}-${index}`} className="flex items-center gap-1.5 md:gap-2.5">
          <span
            className={`inline-flex shrink-0 items-center rounded-lg border font-medium ${
              compact ? "px-2 py-1 text-[10px]" : "px-3 py-2 text-xs md:text-sm"
            } ${
              index === 0
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : index === nodes.length - 1
                  ? "border-violet-500/35 bg-violet-500/10 text-violet-200"
                  : "border-zinc-700 bg-zinc-900/90 text-zinc-300"
            } ${animated && index === 0 ? "workflow-node-pulse" : ""}`}
          >
            {node}
          </span>
          {index < nodes.length - 1 ? (
            <ArrowRight
              className={`shrink-0 text-violet-500/60 ${
                compact ? "size-3" : "size-3.5"
              } ${animated ? "workflow-arrow-flow" : ""}`}
              style={animated ? { animationDelay: `${index * 0.4}s` } : undefined}
              aria-hidden
            />
          ) : null}
        </span>
      ))}
    </div>
  )
}
