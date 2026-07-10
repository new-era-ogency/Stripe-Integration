"use client"

import {
  CheckSquare,
  FolderKanban,
  Mic,
  Users,
} from "lucide-react"
import type { UserTier } from "@/lib/profile"
import { dash } from "@/lib/dashboard/theme-classes"
import { cn } from "@/lib/utils"

export type StatCardKey = (typeof STAT_CARD_KEYS)[number]

export const STAT_CARD_KEYS = [
  "projects",
  "tasks",
  "meetings",
  "team",
] as const

type DashboardStatCardsProps = {
  generationsCount: number
  draftCount: number
  generationsThisMonth: number
  tier: UserTier
  hasOpenAiKey: boolean
  authChecked: boolean
  isGuest: boolean
  onNavigate?: (key: StatCardKey) => void
}

const cards: {
  key: StatCardKey
  label: string
  icon: typeof FolderKanban
  iconClass: string
  ariaLabel: string
}[] = [
  {
    key: "projects",
    label: "Content packs",
    icon: FolderKanban,
    iconClass:
      "text-violet-400 bg-violet-500/10 border-violet-500/20 light:text-violet-700 light:bg-violet-50 light:border-violet-200",
    ariaLabel: "View all content packs in history",
  },
  {
    key: "tasks",
    label: "Open drafts",
    icon: CheckSquare,
    iconClass:
      "text-sky-400 bg-sky-500/10 border-sky-500/20 light:text-violet-600 light:bg-violet-50 light:border-violet-200",
    ariaLabel: "View open draft in results",
  },
  {
    key: "meetings",
    label: "Generations this month",
    icon: Mic,
    iconClass:
      "text-pink-400 bg-pink-500/10 border-pink-500/20 light:text-violet-600 light:bg-violet-50 light:border-violet-200",
    ariaLabel: "View generation history for this month",
  },
  {
    key: "team",
    label: "Account",
    icon: Users,
    iconClass:
      "text-amber-400 bg-amber-500/10 border-amber-500/20 light:text-violet-700 light:bg-violet-50 light:border-violet-200",
    ariaLabel: "Open account and API key settings",
  },
]

function StatSkeleton() {
  return <div className={`mt-3 h-8 w-12 ${dash.skeleton}`} />
}

export default function DashboardStatCards({
  generationsCount,
  draftCount,
  generationsThisMonth,
  tier,
  hasOpenAiKey,
  authChecked,
  isGuest,
  onNavigate,
}: DashboardStatCardsProps) {
  const values: Record<StatCardKey, string> = {
    projects: isGuest ? "—" : String(generationsCount),
    tasks: isGuest ? "—" : String(draftCount),
    meetings: isGuest ? "—" : String(generationsThisMonth),
    team: isGuest
      ? "Guest"
      : hasOpenAiKey
        ? tier === "pro_max"
          ? "Pro Max"
          : tier === "pro"
            ? "Pro"
            : "Starter"
        : "No API key",
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onNavigate?.(card.key)}
            disabled={!onNavigate}
            aria-label={card.ariaLabel}
            className={cn(
              `${dash.card} p-5 text-left transition-all duration-200`,
              onNavigate
                ? "cursor-pointer hover:border-violet-500/35 hover:bg-zinc-950 light:hover:border-violet-400 light:hover:bg-violet-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                : "cursor-default"
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl border",
                card.iconClass
              )}
            >
              <Icon className="size-5" />
            </div>
            <p className={`mt-4 ${dash.statLabel}`}>{card.label}</p>
            {!authChecked ? (
              <StatSkeleton />
            ) : (
              <p className={`mt-1 ${dash.statValue}`}>{values[card.key]}</p>
            )}
          </button>
        )
      })}
    </div>
  )
}
