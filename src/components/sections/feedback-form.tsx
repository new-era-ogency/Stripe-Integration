"use client"

import { useEffect, useState } from "react"
import { Loader2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export type FeedbackTrigger = "post_generation" | "trial_exhausted" | "manual"

type FeedbackFormProps = {
  open: boolean
  onClose: () => void
  trigger: FeedbackTrigger
  metadata?: Record<string, unknown>
}

const RATING_OPTIONS = [
  { value: 1, emoji: "😞", label: "Poor" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "🤩", label: "Love it" },
] as const

export default function FeedbackForm({
  open,
  onClose,
  trigger,
  metadata = {},
}: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [contact, setContact] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, isSubmitting, onClose])

  useEffect(() => {
    if (!open) {
      setRating(null)
      setComment("")
      setContact("")
      setSubmitted(false)
      setError(null)
      setIsSubmitting(false)
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (rating === null) {
      setError("Pick a rating before submitting.")
      return
    }

    if (!comment.trim()) {
      setError("Tell us one thing we could improve.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          contact: contact.trim() || undefined,
          metadata: {
            trigger,
            ...metadata,
          },
        }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Could not send feedback. Try again.")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Network error — check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const title =
    trigger === "trial_exhausted"
      ? "Out of free previews — help us improve"
      : "Quick feedback"

  const subtitle =
    trigger === "trial_exhausted"
      ? "Share honest feedback and we'll prioritize you for early-access invites."
      : "You just generated a thread — how did we do?"

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close feedback"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => {
          if (!isSubmitting) onClose()
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="feedback-panel-enter relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-violet-500/20 bg-zinc-950/90 shadow-[0_32px_80px_-24px_rgba(139,92,246,0.45)] backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 px-5 py-4">
          <div>
            <h2 id="feedback-title" className="text-base font-semibold text-white">
              {submitted ? "Thank you" : title}
            </h2>
            {!submitted ? (
              <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
            ) : null}
          </div>
          {!submitted ? (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-zinc-800 p-1.5 text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {submitted ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm leading-relaxed text-zinc-300">
              Thank you, Rodion received your feedback. Joining the early-access
              club shortly…
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                How was it?
              </p>
              <div className="flex justify-between gap-1">
                {RATING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRating(option.value)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-1 py-2.5 transition-all ${
                      rating === option.value
                        ? "border-violet-500/50 bg-violet-500/15 scale-105"
                        : "border-zinc-800 bg-black/40 hover:border-zinc-600"
                    }`}
                    aria-label={`${option.value} stars — ${option.label}`}
                  >
                    <span className="text-xl leading-none">{option.emoji}</span>
                    <span className="text-[9px] text-zinc-500">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-comment"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                What is one thing we could improve?
              </label>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Be honest. What tripped you up or what feature is missing?"
                rows={4}
                disabled={isSubmitting}
                className="resize-none border-zinc-800 bg-black/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-contact"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Contact <span className="normal-case text-zinc-600">(optional)</span>
              </label>
              <Input
                id="feedback-contact"
                type="text"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="Telegram @handle or email for early-access invites"
                disabled={isSubmitting}
                className="border-zinc-800 bg-black/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20"
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send feedback"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
