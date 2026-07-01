"use client"

import { History, Settings, Sparkles, SquareStack } from "lucide-react"
import type { DashboardMobileTab } from "@/lib/viewport"
import { cn } from "@/lib/utils"

const TABS: {
  id: DashboardMobileTab
  label: string
  icon: typeof Sparkles
}[] = [
  { id: "create", label: "Create", icon: Sparkles },
  { id: "results", label: "Results", icon: SquareStack },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
]

type MobileDashboardBottomNavProps = {
  activeTab: DashboardMobileTab
  onTabChange: (tab: DashboardMobileTab) => void
}

export default function MobileDashboardBottomNav({
  activeTab,
  onTabChange,
}: MobileDashboardBottomNavProps) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-md"
    >
      <div className="mobile-safe-bottom mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 pt-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-violet-500/15 text-violet-200"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
