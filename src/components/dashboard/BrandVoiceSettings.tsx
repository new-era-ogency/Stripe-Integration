"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Lock, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { isProTier, type UserTier } from "@/lib/profile"

type BrandVoiceSettingsProps = {
  tier: UserTier
  brandVoice: string | null
  isGuest: boolean
  authChecked: boolean
  onSaved: (brandVoice: string | null) => void
}

export default function BrandVoiceSettings({
  tier,
  brandVoice,
  isGuest,
  authChecked,
  onSaved,
}: BrandVoiceSettingsProps) {
  const [draft, setDraft] = useState(brandVoice ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isPro = isProTier(tier)
  const isLocked = isGuest || !isPro

  useEffect(() => {
    setDraft(brandVoice ?? "")
  }, [brandVoice])

  const handleSave = async () => {
    if (isLocked) return

    setIsSaving(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandVoice: draft }),
      })

      const data = (await response.json()) as {
        brandVoice?: string | null
        error?: string
      }

      if (!response.ok) {
        setError(data.error ?? "Failed to save brand voice")
        return
      }

      const saved = data.brandVoice ?? null
      setDraft(saved ?? "")
      onSaved(saved)
      setMessage("Brand voice saved. Future generations will use this persona.")
    } catch {
      setError("Something went wrong while saving.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-zinc-900 bg-[#050505] shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)]">
      <div className="border-b border-zinc-900 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Pro Settings
            </p>
            <h2 className="mt-1 text-base font-medium text-white">
              AI Brand Voice / Persona
            </h2>
          </div>
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-200">
              <Sparkles className="size-3" />
              Pro Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Starter
            </span>
          )}
        </div>
      </div>

      <div className="relative px-5 py-4">
        {!authChecked ? (
          <div className="h-32 animate-pulse rounded-xl bg-zinc-900/80" />
        ) : (
          <>
            <p className="mb-3 text-sm leading-relaxed text-zinc-400">
              Define how PulseFlow writes for you — tone, audience, vocabulary,
              and personality. Injected into every generation when you&apos;re on
              Pro.
            </p>

            <div className="relative">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={isLocked || isSaving}
                placeholder="Example: Write like a sharp SaaS founder — confident, concise, no fluff. Use short paragraphs, strong hooks, and practical CTAs for indie hackers."
                className="min-h-[140px] resize-none rounded-xl border-zinc-800 bg-[#010101] text-sm leading-relaxed text-zinc-200 shadow-inner placeholder:text-zinc-700 focus-visible:border-violet-500 focus-visible:ring-0 disabled:opacity-60"
              />

              {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-zinc-800/80 bg-black/55 backdrop-blur-md">
                  <div className="mx-4 max-w-sm text-center">
                    <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                      <Lock className="size-5 text-violet-300" />
                    </div>
                    <p className="text-sm font-medium text-white">
                      Upgrade to PRO to unlock Custom AI Personas
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      Pro members can save a persistent brand voice that shapes
                      every X, LinkedIn, and Telegram output.
                    </p>
                    <Button
                      asChild
                      className="mt-4 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 text-sm font-semibold text-white hover:from-violet-400 hover:to-indigo-400"
                    >
                      <Link href="/pricing">Upgrade to Pro</Link>
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="mt-3 text-sm text-amber-300/90" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="mt-3 text-sm text-emerald-400/90" role="status">
                {message}
              </p>
            ) : null}

            {!isLocked ? (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-10 rounded-xl bg-white px-5 text-sm font-medium text-black hover:bg-zinc-200"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 size-4" />
                      Save Brand Voice
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
