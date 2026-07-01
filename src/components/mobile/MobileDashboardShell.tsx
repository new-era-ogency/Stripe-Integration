"use client"

import type { ReactNode } from "react"
import type { DashboardMobileTab } from "@/lib/viewport"
import MobileDashboardBottomNav from "@/components/mobile/MobileDashboardBottomNav"

type MobileDashboardShellProps = {
  activeTab: DashboardMobileTab
  onTabChange: (tab: DashboardMobileTab) => void
  create: ReactNode
  results: ReactNode
  history: ReactNode
  settings: ReactNode
  header?: ReactNode
  topBanner?: ReactNode
}

export default function MobileDashboardShell({
  activeTab,
  onTabChange,
  create,
  results,
  history,
  settings,
  header,
  topBanner,
}: MobileDashboardShellProps) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07),transparent_55%)]" />

      {header}
      <div className="relative z-10 mx-auto max-w-lg px-4 pb-28 pt-4">
        {topBanner}

        <div className={activeTab === "create" ? "block" : "hidden"}>{create}</div>
        <div className={activeTab === "results" ? "block" : "hidden"}>{results}</div>
        <div className={activeTab === "history" ? "block" : "hidden"}>{history}</div>
        <div className={activeTab === "settings" ? "block" : "hidden"}>
          {settings}
        </div>
      </div>

      <MobileDashboardBottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
