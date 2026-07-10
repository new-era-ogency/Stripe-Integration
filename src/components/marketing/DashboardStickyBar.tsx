"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ctaStrategy } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

export default function DashboardStickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-violet-500/30 bg-zinc-950/95 p-3 shadow-[0_-8px_40px_-12px_rgba(139,92,246,0.45)] backdrop-blur-xl">
        <p className="min-w-0 flex-1 pl-1 text-xs leading-snug text-zinc-400">
          <span className="font-semibold text-white">Start creating</span>
          {" "}
          — open the free dashboard
        </p>
        <Link
          href={ctaStrategy.dashboard.href}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {ctaStrategy.dashboard.label}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
