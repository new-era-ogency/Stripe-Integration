"use client"

import type { ReactNode } from "react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardTopBar from "@/components/dashboard/DashboardTopBar"
import type { CreateIntent } from "@/lib/dashboard/create-intent"
import type { DashboardView } from "@/lib/dashboard/views"
import type { GenerationRecord } from "@/lib/generations"

type DashboardShellProps = {
  activeView: DashboardView
  createIntent: CreateIntent
  onViewChange: (view: DashboardView) => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  isGuest: boolean
  authChecked: boolean
  userEmail: string | null
  workspaceName: string
  generations: GenerationRecord[]
  onSearchSelect: (record: GenerationRecord) => void
  onMeetingsClick: () => void
  onUnclassifiedClick: () => void
  unseenResultsCount: number
  topBanner?: ReactNode
  children: ReactNode
}

export default function DashboardShell({
  activeView,
  createIntent,
  onViewChange,
  sidebarCollapsed,
  onToggleSidebar,
  isGuest,
  authChecked,
  userEmail,
  workspaceName,
  generations,
  onSearchSelect,
  onMeetingsClick,
  onUnclassifiedClick,
  unseenResultsCount,
  topBanner,
  children,
}: DashboardShellProps) {
  return (
    <div
      data-dashboard-shell
      className="flex min-h-screen bg-black text-zinc-100 transition-[background-color,color] duration-500 light:bg-white light:text-zinc-900"
    >
      <DashboardSidebar
        activeView={activeView}
        createIntent={createIntent}
        onViewChange={onViewChange}
        collapsed={sidebarCollapsed}
        isGuest={isGuest}
        authChecked={authChecked}
        userEmail={userEmail}
        workspaceName={workspaceName}
        onMeetingsClick={onMeetingsClick}
        onUnclassifiedClick={onUnclassifiedClick}
        unseenResultsCount={unseenResultsCount}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar
          activeView={activeView}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
          generations={generations}
          onSearchSelect={onSearchSelect}
          unseenResultsCount={unseenResultsCount}
        />

        <main className="relative flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          {topBanner}
          {children}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-violet-950/20 via-black/80 to-transparent light:from-violet-100/60 light:via-white/80"
            aria-hidden
          />
        </main>
      </div>
    </div>
  )
}
