"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Lock, X } from "lucide-react"
import OpenAiKeySetup from "@/components/settings/OpenAiKeySetup"

type OpenAiKeySetupModalProps = {
  open: boolean
  onClose: () => void
  onKeySaved?: () => void
}

export default function OpenAiKeySetupModal({
  open,
  onClose,
  onKeySaved,
}: OpenAiKeySetupModalProps) {
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

  return (
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
            aria-labelledby="openai-key-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-5">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                  <Lock className="size-3.5" />
                  Bring your own key
                </div>
                <h2
                  id="openai-key-modal-title"
                  className="text-lg font-semibold text-white"
                >
                  Add your OpenAI API key
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Generation runs in your browser and bills your OpenAI account
                  directly. Your key is never sent to PulseFlow servers.
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

            <div className="px-6 py-5">
              <OpenAiKeySetup
                embedded
                onKeyValidated={() => {
                  onKeySaved?.()
                  onClose()
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
