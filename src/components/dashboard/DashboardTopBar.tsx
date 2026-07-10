"use client"

import { useEffect, useMemo, useState } from "react"
import { Moon, PanelLeft, Search, Sun } from "lucide-react"
import {
  DASHBOARD_VIEW_LABELS,
  type DashboardView,
} from "@/lib/dashboard/views"
import type { GenerationRecord } from "@/lib/generations"
import NavCountBadge from "@/components/dashboard/NavCountBadge"
import { useTheme } from "@/components/theme/ThemeProvider"
import { cn } from "@/lib/utils"

type DashboardTopBarProps = {
  activeView: DashboardView
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  generations: GenerationRecord[]
  onSearchSelect: (record: GenerationRecord) => void
  unseenResultsCount: number
}

export default function DashboardTopBar({
  activeView,
  sidebarCollapsed,
  onToggleSidebar,
  generations,
  onSearchSelect,
  unseenResultsCount,
}: DashboardTopBarProps) {
  const { theme, toggleTheme } = useTheme()
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return []
    }

    return generations
      .filter((record) => {
        const haystack = [
          record.youtube_url,
          record.generated_content.outputX,
          record.generated_content.outputLinkedIn,
          record.generated_content.outputTelegram,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        return haystack.includes(normalized)
      })
      .slice(0, 6)
  }, [generations, query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
        document.getElementById("dashboard-search-input")?.focus()
      }
      if (event.key === "Escape") {
        setSearchOpen(false)
        setQuery("")
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleThemeToggle = () => {
    setIsThemeTransitioning(true)
    toggleTheme()
    window.setTimeout(() => setIsThemeTransitioning(false), 550)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-800/90 bg-black/95 px-4 backdrop-blur-md transition-[background-color,border-color] duration-500 light:border-violet-200 light:bg-white/95 md:px-6">
      <button
        type="button"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleSidebar}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white light:border-zinc-300 light:text-zinc-600 light:hover:border-violet-300 light:hover:text-violet-700"
      >
        <PanelLeft className="size-4" />
      </button>

      <h1 className="flex items-center gap-2 text-lg font-medium text-white light:text-zinc-900">
        {DASHBOARD_VIEW_LABELS[activeView]}
        {activeView === "results" ? (
          <NavCountBadge count={unseenResultsCount} />
        ) : null}
      </h1>

      <div className="relative ml-auto w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500 light:text-zinc-400" />
        <input
          id="dashboard-search-input"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSearchOpen(true)
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search..."
          className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-16 text-sm text-white transition-colors duration-500 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 light:border-zinc-300 light:bg-white light:text-zinc-900 light:placeholder:text-zinc-400 light:focus:border-violet-300 light:focus:ring-violet-200"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline light:border-zinc-300 light:bg-zinc-100 light:text-zinc-500">
          ⌘K
        </kbd>

        {searchOpen && query.trim() ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl light:border-zinc-200 light:bg-white">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-zinc-500 light:text-zinc-600">
                No matches found.
              </p>
            ) : (
              <ul>
                {results.map((record) => (
                  <li key={record.id}>
                    <button
                      type="button"
                      className="block w-full px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-900 light:text-zinc-700 light:hover:bg-violet-50"
                      onClick={() => {
                        onSearchSelect(record)
                        setSearchOpen(false)
                        setQuery("")
                      }}
                    >
                      <span className="block truncate font-medium text-white light:text-zinc-900">
                        {record.youtube_url}
                      </span>
                      <span className="mt-1 block truncate text-xs text-zinc-500 light:text-zinc-500">
                        {new Date(record.created_at).toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        onClick={handleThemeToggle}
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-all duration-500 hover:border-zinc-700 hover:text-white light:border-zinc-300 light:text-amber-500 light:hover:border-violet-300 light:hover:text-violet-700",
          isThemeTransitioning && "scale-95 opacity-80"
        )}
      >
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </header>
  )
}
