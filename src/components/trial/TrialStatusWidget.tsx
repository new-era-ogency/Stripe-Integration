"use client"

import { useState } from "react"
import { Clock3 } from "lucide-react"
import TrialExtensionModal from "@/components/trial/TrialExtensionModal"
import {
  getTrialProgressPercent,
  getTrialUrgencyClass,
  type TrialUiState,
} from "@/lib/trial/ui"

type TrialStatusWidgetProps = {
  trial: TrialUiState | null
  loading?: boolean
  onTrialUpdated?: (trial: TrialUiState) => void
  modalOpen?: boolean
  onModalOpenChange?: (open: boolean) => void
  className?: string
}

export default function TrialStatusWidget({
  trial,
  loading = false,
  onTrialUpdated,
  modalOpen,
  onModalOpenChange,
  className = "",
}: TrialStatusWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isModalOpen = modalOpen ?? internalOpen

  const setModalOpen = (open: boolean) => {
    if (onModalOpenChange) {
      onModalOpenChange(open)
      return
    }

    setInternalOpen(open)
  }

  if (loading) {
    return (
      <div
        className={`h-10 w-44 animate-pulse rounded-full bg-zinc-900 ${className}`}
      />
    )
  }

  if (!trial || trial.accountStatus !== "trial") {
    return null
  }

  const urgencyClass = getTrialUrgencyClass(trial.daysRemaining)
  const progress = getTrialProgressPercent(
    trial.daysRemaining,
    trial.totalTrialDays
  )

  const handleTrialUpdated = (nextTrial: TrialUiState) => {
    onTrialUpdated?.(nextTrial)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`group flex min-w-[11rem] flex-col gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-left transition-colors hover:border-violet-500/40 hover:bg-zinc-900 ${className}`}
        aria-label="Open trial extension options"
      >
        <span className="flex items-center gap-2">
          <Clock3 className={`size-3.5 shrink-0 ${urgencyClass}`} />
          <span className={`text-xs font-medium ${urgencyClass}`}>
            {trial.daysRemaining} of {trial.totalTrialDays} days left
          </span>
        </span>
        <span className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <span
            className={`block h-full rounded-full transition-all ${
              trial.daysRemaining < 3
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-violet-500 to-indigo-500"
            }`}
            style={{ width: `${100 - progress}%` }}
          />
        </span>
      </button>

      <TrialExtensionModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        trial={trial}
        onTrialUpdated={handleTrialUpdated}
      />
    </>
  )
}
