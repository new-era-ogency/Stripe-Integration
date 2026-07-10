"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  FileQuestion,
  Folder,
  History,
  LogOut,
  Mic,
  Plus,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
} from "lucide-react"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import OpenAiKeyStatusBadge from "@/components/openai/OpenAiKeyStatusBadge"
import NavCountBadge from "@/components/dashboard/NavCountBadge"
import type { CreateIntent } from "@/lib/dashboard/create-intent"
import type { DashboardView } from "@/lib/dashboard/views"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type DashboardSidebarProps = {
  activeView: DashboardView
  createIntent: CreateIntent
  onViewChange: (view: DashboardView) => void
  collapsed: boolean
  isGuest: boolean
  authChecked: boolean
  userEmail: string | null
  workspaceName: string
  onMeetingsClick: () => void
  onUnclassifiedClick: () => void
  unseenResultsCount: number
}

type NavItem = {
  id: DashboardView | "meetings" | "unclassified"
  label: string
  icon: typeof Sparkles
  onClick?: () => void
  animationDelay: string
}

function isNavItemActive(
  item: NavItem,
  activeView: DashboardView,
  createIntent: CreateIntent
): boolean {
  if (item.id === "meetings") {
    return activeView === "create" && createIntent === "meetings"
  }

  if (item.id === "unclassified") {
    return activeView === "create" && createIntent === "unclassified"
  }

  if (item.id === "create") {
    return activeView === "create" && createIntent === "default"
  }

  return activeView === item.id
}

export default function DashboardSidebar({
  activeView,
  createIntent,
  onViewChange,
  collapsed,
  isGuest,
  authChecked,
  userEmail,
  workspaceName,
  onMeetingsClick,
  onUnclassifiedClick,
  unseenResultsCount,
}: DashboardSidebarProps) {
  const router = useRouter()

  const primaryNav: NavItem[] = [
    { id: "create", label: "Create", icon: Sparkles, animationDelay: "40ms" },
    { id: "results", label: "Results", icon: SquareStack, animationDelay: "80ms" },
    { id: "history", label: "History", icon: History, animationDelay: "120ms" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings2,
      animationDelay: "160ms",
    },
  ]

  const secondaryNav: NavItem[] = [
    {
      id: "meetings",
      label: "Meetings",
      icon: Mic,
      onClick: onMeetingsClick,
      animationDelay: "200ms",
    },
    {
      id: "unclassified",
      label: "Unclassified",
      icon: FileQuestion,
      onClick: onUnclassifiedClick,
      animationDelay: "240ms",
    },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon
    const isActive = isNavItemActive(item, activeView, createIntent)

    const handleClick = () => {
      if (item.onClick) {
        item.onClick()
        return
      }
      onViewChange(item.id as DashboardView)
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        style={{ animationDelay: item.animationDelay }}
        className={cn(
          "dashboard-nav-item relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-zinc-800/90 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)] light:bg-violet-100 light:text-violet-950"
            : "text-zinc-400 hover:translate-x-0.5 hover:bg-zinc-900 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900"
        )}
      >
        <Icon className="size-4 shrink-0" />
        {!collapsed ? (
          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <span className="truncate">{item.label}</span>
            {item.id === "results" ? (
              <NavCountBadge count={unseenResultsCount} />
            ) : null}
          </span>
        ) : item.id === "results" && unseenResultsCount > 0 ? (
          <NavCountBadge
            count={unseenResultsCount}
            className="absolute -right-0.5 -top-0.5 min-w-4 px-1"
          />
        ) : null}
      </button>
    )
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-zinc-800/90 bg-black transition-[width,background-color,border-color] duration-500 light:border-violet-200 light:bg-white",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800/90 px-4 py-4 light:border-zinc-200">
        <Link
          href="/"
          className={cn(
            "flex min-w-0 items-center gap-2 text-white light:text-zinc-900",
            collapsed && "justify-center"
          )}
        >
          <PulseFlowLogo size="sm" showWordmark={!collapsed} />
        </Link>
        {!collapsed ? (
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white light:border-zinc-300 light:text-zinc-500 light:hover:border-violet-300 light:hover:text-violet-700"
          >
            <Bell className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {!collapsed ? (
            <div
              className="dashboard-nav-item mb-3 flex items-center justify-between px-2"
              style={{ animationDelay: "0ms" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 light:text-zinc-500">
                Workspaces
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Add workspace"
                  onClick={() => onViewChange("create")}
                  className="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300 light:hover:bg-zinc-200 light:hover:text-zinc-800"
                >
                  <Plus className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Workspace settings"
                  onClick={() => onViewChange("settings")}
                  className="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300 light:hover:bg-zinc-200 light:hover:text-zinc-800"
                >
                  <SlidersHorizontal className="size-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => onViewChange("overview")}
            title={collapsed ? workspaceName : undefined}
            style={{ animationDelay: "20ms" }}
            className={cn(
              "dashboard-nav-item mb-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
              activeView === "overview"
                ? "bg-violet-500/10 text-violet-200 light:bg-violet-100 light:text-violet-900"
                : "text-zinc-300 hover:bg-zinc-900 light:text-zinc-700 light:hover:bg-zinc-100"
            )}
          >
            <Folder className="size-4 shrink-0 text-violet-400" />
            {!collapsed ? <span className="truncate">{workspaceName}</span> : null}
          </button>

          <nav className="space-y-1" aria-label="Dashboard navigation">
            {primaryNav.map(renderNavButton)}
          </nav>

          {!collapsed ? (
            <p
              className="dashboard-nav-item mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 light:text-zinc-500"
              style={{ animationDelay: "180ms" }}
            >
              Sources
            </p>
          ) : (
            <div className="my-4 border-t border-zinc-800/80 light:border-zinc-200" />
          )}

          <nav className="space-y-1" aria-label="Source shortcuts">
            {secondaryNav.map(renderNavButton)}
          </nav>
        </div>

        <div className="mt-auto shrink-0 border-t border-zinc-800/90 bg-black p-3 light:border-violet-200 light:bg-white">
          {!isGuest && authChecked ? (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2",
                collapsed && "justify-center px-0"
              )}
            >
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-zinc-400 light:text-zinc-600">
                    {userEmail}
                  </p>
                  <div className="mt-1">
                    <OpenAiKeyStatusBadge size="sm" />
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                aria-label="Sign out"
                onClick={handleSignOut}
                className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-white light:hover:bg-zinc-200 light:hover:text-zinc-900"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className={cn("px-2 py-1", collapsed && "text-center")}>
              {!collapsed ? (
                <p className="text-xs text-zinc-500 light:text-zinc-600">
                  Sign in to save history
                </p>
              ) : null}
              <Link
                href="/login"
                className="mt-2 inline-flex text-xs font-medium text-violet-300 hover:text-violet-200 light:text-violet-700 light:hover:text-violet-900"
              >
                {collapsed ? "In" : "Sign in"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
