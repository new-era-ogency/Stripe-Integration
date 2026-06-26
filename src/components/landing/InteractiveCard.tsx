"use client"

import type { ReactNode } from "react"

type InteractiveCardProps = {
  children: ReactNode
  className?: string
  as?: "div" | "article" | "blockquote"
}

export default function InteractiveCard({
  children,
  className = "",
  as: Tag = "div",
}: InteractiveCardProps) {
  return (
    <Tag className={`interactive-card group relative ${className}`}>
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-violet-500/25 via-fuchsia-500/10 to-indigo-500/20" />
      </div>
      <div className="relative h-full">{children}</div>
    </Tag>
  )
}
