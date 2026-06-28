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
        "inline-flex items-center gap-1 text-left text-xs text-violet-400 transition-colors hover:text-violet-300",
        variant === "card" && "text-sm"
      )}
      aria-expanded={expanded}
    >
      How much does this cost me?
      <ChevronDown
        className={cn(
          "size-3.5 transition-transform duration-200",
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
        expanded ? "mt-3 max-h-48 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <p className="text-sm leading-relaxed text-zinc-400">
        PulseFlow is free. OpenAI bills you directly — typically a fraction of a
        cent per generation with{" "}
        <span className="text-zinc-300">gpt-4o-mini</span> or a few cents with{" "}
        <span className="text-zinc-300">gpt-4o</span>. No PulseFlow markup, no
        hidden SaaS fees. Check usage anytime on your{" "}
        <a
          href="https://platform.openai.com/usage"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
        >
          OpenAI billing dashboard
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
          "rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3",
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
