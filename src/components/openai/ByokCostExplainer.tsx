"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type ByokCostExplainerProps = {
  className?: string
  variant?: "inline" | "card"
}

export default function ByokCostExplainer({
  className,
  variant = "inline",
}: ByokCostExplainerProps) {
  const [expanded, setExpanded] = useState(false)

  const trigger = (
    <button
      type="button"
      onClick={() => setExpanded((current) => !current)}
      className={cn(
        "inline-flex w-full items-center justify-between gap-2 text-left text-sm text-zinc-300 transition-colors hover:text-white",
        variant === "inline" && "w-auto text-xs text-violet-400 hover:text-violet-300"
      )}
      aria-expanded={expanded}
    >
      <span>How much does this cost me?</span>
      <ChevronDown
        className={cn(
          "size-4 shrink-0 text-zinc-500 transition-transform duration-200",
          expanded && "rotate-180"
        )}
        aria-hidden
      />
    </button>
  )

  const explanation = (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        expanded ? "mt-3 max-h-56 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <p className="text-sm leading-relaxed text-zinc-400">
        PulseFlow is free. OpenRouter bills you directly — many models cost a
        fraction of a cent per run, and free-tier models are available on your
        account. No PulseFlow markup or hidden SaaS fees. Check usage anytime on
        your{" "}
        <a
          href="https://openrouter.ai/activity"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
        >
          OpenRouter activity dashboard
          <ExternalLink className="size-3" aria-hidden />
        </a>
        .
      </p>
    </div>
  )

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3.5",
          className
        )}
      >
        {trigger}
        {explanation}
      </div>
    )
  }

  return (
    <div className={className}>
      {trigger}
      {explanation}
    </div>
  )
}
