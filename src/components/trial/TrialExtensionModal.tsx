"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  Gift,
  Loader2,
  Megaphone,
  Share2,
  Sparkles,
  UserPlus,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/feedback/ToastProvider"
import TrialConfetti from "@/components/trial/TrialConfetti"
import type { TrialUiState } from "@/lib/trial/ui"
import type { ViralActionType } from "@/lib/trial/types"
import { VIRAL_ACTION_REWARDS } from "@/lib/trial/types"

type TrialExtensionModalProps = {
  open: boolean
  onClose: () => void
  trial: TrialUiState
  onTrialUpdated: (trial: TrialUiState) => void
}

type ViralActionConfig = {
  actionType: ViralActionType
  label: string
  description: string
  icon: typeof Share2
  shareUrl: string
}

const VIRAL_ACTIONS: ViralActionConfig[] = [
  {
    actionType: "social_share_linkedin",
    label: "Share on LinkedIn",
    description: `+${VIRAL_ACTION_REWARDS.social_share_linkedin} days`,
    icon: Share2,
    shareUrl:
      "https://www.linkedin.com/sharing/share-offsite/?url=https://pulseflow.app",
  },
  {
    actionType: "social_share_twitter",
    label: "Share on X",
    description: `+${VIRAL_ACTION_REWARDS.social_share_twitter} days`,
    icon: Megaphone,
    shareUrl:
      "https://twitter.com/intent/tweet?text=PulseFlow%20turns%20YouTube%20videos%20into%20ready-to-post%20content.&url=https://pulseflow.app",
  },
  {
    actionType: "invite_colleague",
    label: "Invite a colleague",
    description: `+${VIRAL_ACTION_REWARDS.invite_colleague} days`,
    icon: UserPlus,
    shareUrl: "mailto:?subject=Try%20PulseFlow&body=Check%20out%20PulseFlow%20for%20turning%20YouTube%20into%20social%20content:%20https://pulseflow.app",
  },
]

function mockSocialShare(shareUrl: string) {
  const popup = window.open(
    shareUrl,
    "pulseflow-share",
    "width=640,height=720,noopener,noreferrer"
  )

  if (!popup) {
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }
}

export default function TrialExtensionModal({
  open,
  onClose,
  trial,
  onTrialUpdated,
}: TrialExtensionModalProps) {
  const [claimedActions, setClaimedActions] = useState<string[]>(
    trial.claimedActions
  )
  const [loadingAction, setLoadingAction] = useState<ViralActionType | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { success: toastSuccess } = useToast()

  useEffect(() => {
    setClaimedActions(trial.claimedActions)
  }, [trial.claimedActions, open])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  const claimAction = useCallback(
    async (action: ViralActionConfig) => {
      if (claimedActions.includes(action.actionType)) {
        return
      }

      setError(null)
      setLoadingAction(action.actionType)
      mockSocialShare(action.shareUrl)

      await new Promise((resolve) => window.setTimeout(resolve, 900))

      try {
        const response = await fetch("/api/trial/extend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actionType: action.actionType }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to extend trial")
        }

        const daysGranted =
          typeof data.daysGranted === "number"
            ? data.daysGranted
            : VIRAL_ACTION_REWARDS[action.actionType]

        const nextTrial: TrialUiState = {
          ...trial,
          isValid: true,
          daysRemaining: trial.daysRemaining + daysGranted,
          totalTrialDays: trial.totalTrialDays + daysGranted,
          trialExtendedDays: trial.trialExtendedDays + daysGranted,
          trialEndAt:
            typeof data.trialEndAt === "string"
              ? data.trialEndAt
              : trial.trialEndAt,
          claimedActions: [...claimedActions, action.actionType],
        }

        setClaimedActions(nextTrial.claimedActions)
        onTrialUpdated(nextTrial)
        setShowConfetti(true)
        toastSuccess(
          `Nice! +${daysGranted} trial day${daysGranted === 1 ? "" : "s"} unlocked.`
        )
        window.setTimeout(() => setShowConfetti(false), 1400)
      } catch (claimError) {
        setError(
          claimError instanceof Error
            ? claimError.message
            : "Could not extend trial"
        )
      } finally {
        setLoadingAction(null)
      }
    },
    [claimedActions, onTrialUpdated, toastSuccess, trial]
  )

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="trial-extension-title"
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <TrialConfetti active={showConfetti} />

              <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-5">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                    <Gift className="size-3.5" />
                    Extend your trial
                  </div>
                  <h2
                    id="trial-extension-title"
                    className="text-lg font-semibold text-white"
                  >
                    Keep creating without limits
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {trial.daysRemaining} day{trial.daysRemaining === 1 ? "" : "s"}{" "}
                    left on your trial. Earn more time free or upgrade instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-5 px-6 py-5">
                <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-violet-400" />
                    <h3 className="text-sm font-medium text-white">
                      Fast &amp; free
                    </h3>
                  </div>
                  <p className="mb-4 text-xs text-zinc-500">
                    Complete a quick share to unlock bonus trial days. Each action
                    can be claimed once.
                  </p>

                  <div className="space-y-2">
                    {VIRAL_ACTIONS.map((action) => {
                      const Icon = action.icon
                      const claimed = claimedActions.includes(action.actionType)
                      const isLoading = loadingAction === action.actionType

                      return (
                        <button
                          key={action.actionType}
                          type="button"
                          disabled={claimed || isLoading || loadingAction !== null}
                          onClick={() => claimAction(action)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-left transition-colors hover:border-violet-500/40 hover:bg-violet-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-violet-300">
                              <Icon className="size-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-white">
                                {action.label}
                              </span>
                              <span className="text-xs text-emerald-400">
                                {action.description}
                              </span>
                            </span>
                          </span>

                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-violet-400" />
                          ) : claimed ? (
                            <span className="text-xs font-medium text-zinc-500">
                              Claimed
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-violet-300">
                              Claim
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </section>

                <section className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="size-4 text-amber-300" />
                    <h3 className="text-sm font-medium text-white">
                      Zero limits
                    </h3>
                  </div>
                  <p className="mb-4 text-xs text-zinc-400">
                    Skip the countdown. Upgrade to Pro for unlimited generations,
                    deep content packs, and priority models.
                  </p>
                  <Button
                    asChild
                    className="h-11 w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-medium text-white hover:from-violet-500 hover:to-indigo-500"
                  >
                    <Link href="/billing">Upgrade to Pro</Link>
                  </Button>
                </section>

                {error ? (
                  <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </>
  )
}
