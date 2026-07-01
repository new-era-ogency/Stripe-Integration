"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import OpenAiKeyStatusBadge from "@/components/openai/OpenAiKeyStatusBadge"
import { cn } from "@/lib/utils"

export const DASHBOARD_SECTIONS = [
  { id: "create", label: "Create" },
  { id: "results", label: "Results" },
  { id: "history", label: "History" },
  { id: "settings", label: "Settings" },
] as const

type DashboardHeaderProps = {
  isGuest: boolean
  authChecked: boolean
  hideSectionNav?: boolean
}

export default function DashboardHeader({
  isGuest,
  authChecked,
  hideSectionNav = false,
}: DashboardHeaderProps) {
  const [activeSection, setActiveSection] = useState("create")

  useEffect(() => {
    const sectionIds = DASHBOARD_SECTIONS.map((section) => section.id)
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.4] }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [authChecked])

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-white"
          >
            <PulseFlowLogo size="xs" showWordmark />
          </Link>

          <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
            {!isGuest && authChecked ? (
              <OpenAiKeyStatusBadge size="sm" />
            ) : !authChecked ? (
              <div className="h-8 w-28 animate-pulse rounded-full bg-zinc-900" />
            ) : null}
            <AuthNavButtons showKeyBadge={false} />
          </div>
        </div>

        {!hideSectionNav ? (
          <nav
            aria-label="Dashboard sections"
            className="-mx-1 flex gap-1 overflow-x-auto border-t border-zinc-800/80 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {DASHBOARD_SECTIONS.map((section) => {
              const isActive = activeSection === section.id

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-500/15 text-violet-200"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                  )}
                >
                  {section.label}
                </a>
              )
            })}
            {isGuest ? (
              <Link
                href="/#demo"
                className="ml-auto shrink-0 rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-200 transition-colors hover:border-violet-500/40 hover:bg-violet-500/15"
              >
                Try live preview →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </header>
  )
}
