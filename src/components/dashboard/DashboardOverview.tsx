"use client"

import { Plus, Upload } from "lucide-react"
import DashboardStatCards, {
  type StatCardKey,
} from "@/components/dashboard/DashboardStatCards"
import GenerationHistory from "@/components/dashboard/GenerationHistory"
import type { GenerationRecord } from "@/lib/generations"
import type { UserTier } from "@/lib/profile"
import { dash } from "@/lib/dashboard/theme-classes"
import { Button } from "@/components/ui/button"

type DashboardOverviewProps = {
  displayName: string
  generations: GenerationRecord[]
  generationsThisMonth: number
  draftCount: number
  tier: UserTier
  hasOpenAiKey: boolean
  authChecked: boolean
  isGuest: boolean
  activeGenerationId: string | null
  onNewProject: () => void
  onUploadMeeting: () => void
  onViewGeneration: (record: GenerationRecord) => void
  onCopyGeneration: (record: GenerationRecord) => void
  onStatCardNavigate?: (key: StatCardKey) => void
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function DashboardOverview({
  displayName,
  generations,
  generationsThisMonth,
  draftCount,
  tier,
  hasOpenAiKey,
  authChecked,
  isGuest,
  activeGenerationId,
  onNewProject,
  onUploadMeeting,
  onViewGeneration,
  onCopyGeneration,
  onStatCardNavigate,
}: DashboardOverviewProps) {
  const name = displayName.trim() || "there"

  return (
    <div className="space-y-8">
      <header>
        <h1 className={dash.headingLg}>
          {getGreeting()}, {name} 👋
        </h1>
        <p className={`mt-2 ${dash.muted}`}>
          Your BYOK content workspace — generate, review, and publish from one
          place.
        </p>
      </header>

      <DashboardStatCards
        generationsCount={generations.length}
        draftCount={draftCount}
        generationsThisMonth={generationsThisMonth}
        tier={tier}
        hasOpenAiKey={hasOpenAiKey}
        authChecked={authChecked}
        isGuest={isGuest}
        onNavigate={onStatCardNavigate}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button type="button" onClick={onNewProject} className={dash.btnPrimary}>
          <Plus className="mr-2 size-4" />
          New generation
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onUploadMeeting}
          className={dash.btnOutline}
        >
          <Upload className="mr-2 size-4" />
          Upload meeting
        </Button>
      </div>

      <section className={`${dash.section} p-6 md:p-8`}>
        <h2 className={dash.subheading}>Recent activity</h2>
        <div className="mt-6">
          <GenerationHistory
            generations={generations.slice(0, 5)}
            isGuest={isGuest}
            authChecked={authChecked}
            activeId={activeGenerationId}
            onView={onViewGeneration}
            onCopy={onCopyGeneration}
            variant="embedded"
            emptyMessage="No recent activity. Start by creating a generation!"
          />
        </div>
      </section>
    </div>
  )
}
