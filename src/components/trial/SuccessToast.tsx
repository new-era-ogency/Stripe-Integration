"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

type SuccessToastProps = {
  message: string
  open: boolean
  onClose: () => void
}

export default function SuccessToast({
  message,
  open,
  onClose,
}: SuccessToastProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const timer = window.setTimeout(onClose, 4200)
    return () => window.clearTimeout(timer)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[80] flex max-w-sm items-start gap-3 rounded-xl border border-emerald-500/30 bg-zinc-950/95 px-4 py-3 shadow-[0_0_40px_-8px_rgba(16,185,129,0.45)] backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-100">{message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
