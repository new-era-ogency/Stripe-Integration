"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useOpenAiKey } from "@/components/openai/OpenAiKeyProvider"

type OpenAiKeyStatusBadgeProps = {
  className?: string
  size?: "sm" | "md"
}

export default function OpenAiKeyStatusBadge({
  className,
  size = "md",
}: OpenAiKeyStatusBadgeProps) {
  const { hasOpenAiKey, openKeyModal } = useOpenAiKey()

  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-[10px] gap-1.5"
      : "px-2.5 py-1.5 text-xs gap-2"

  if (hasOpenAiKey) {
    return (
      <Link
        href="/dashboard#settings"
        className={cn(
          "inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 font-medium text-emerald-300 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/15",
          sizeClasses,
          className
        )}
        title="Your OpenRouter key is connected — open Settings to change it"
      >
        <span
          className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          aria-hidden
        />
        Your key active
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={openKeyModal}
      className={cn(
        "inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/10 font-medium text-amber-200/90 transition-all hover:border-amber-500/40 hover:bg-amber-500/15",
        sizeClasses,
        className
      )}
      title="Add your OpenRouter API key to enable generation"
    >
      <span aria-hidden>⚠️</span>
      Add your API key
    </button>
  )
}
