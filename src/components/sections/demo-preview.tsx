"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  Copy,
  Loader2,
  Sparkles,
} from "lucide-react"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import { BTN_PRIMARY } from "@/lib/landing-styles"
import {
  DEFAULT_TRIAL_PREVIEWS,
  initTrialPreviewCount,
  writeTrialPreviewCount,
} from "@/lib/trial/demo-storage"

type DemoPreviewProps = {
  id?: string
  className?: string
}

type PreviewResponse = {
  success?: boolean
  thread?: string[]
  error?: string
}

function ThreadTweetCard({
  tweet,
  index,
  total,
}: {
  tweet: string
  index: number
  total: number
}) {
  const [copied, setCopied] = useState(false)

  const copyTweet = async () => {
    if (!tweet?.trim()) return

    try {
      await navigator.clipboard.writeText(tweet.trim())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (!tweet?.trim()) {
    return null
  }

  return (
    <article
      className="demo-thread-card rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.8)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
          PF
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-white">PulseFlow</span>
            <span className="text-sm text-zinc-500">@pulseflow</span>
            <span className="text-xs text-zinc-600">· {index + 1}/{total}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
            {tweet.trim()}
          </p>
        </div>
        <button
          type="button"
          onClick={copyTweet}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>
    </article>
  )
}

export default function DemoPreview({ id, className = "" }: DemoPreviewProps) {
  const [inputUrl, setInputUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedThread, setGeneratedThread] = useState<string[]>([])
  const [trialCount, setTrialCount] = useState(DEFAULT_TRIAL_PREVIEWS)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTrialCount(initTrialPreviewCount())
    setReady(true)
  }, [])

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      setError(null)

      const url = inputUrl.trim()

      if (!url) {
        setError("Paste a YouTube link to generate your thread.")
        return
      }

      if (trialCount <= 0) {
        setError("No free previews left — sign up to keep generating.")
        return
      }

      setIsGenerating(true)
      setGeneratedThread([])

      try {
        const response = await fetch("/api/trial/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: url }),
        })

        const data = (await response.json()) as PreviewResponse

        if (!response.ok) {
          setError(data.error ?? "Generation failed. Try another link.")
          return
        }

        const thread = Array.isArray(data.thread)
          ? data.thread.filter((chunk) => typeof chunk === "string" && chunk.trim())
          : []

        if (thread.length === 0) {
          setError("No thread was returned. Try again with a different video.")
          return
        }

        const nextCount = trialCount - 1
        writeTrialPreviewCount(nextCount)
        setTrialCount(nextCount)
        setGeneratedThread(thread)
      } catch {
        setError("Network error — check your connection and try again.")
      } finally {
        setIsGenerating(false)
      }
    },
    [inputUrl, trialCount]
  )

  const hasThread = generatedThread.length > 0
  const trialsRemaining = ready ? trialCount : DEFAULT_TRIAL_PREVIEWS

  return (
    <div
      id={id}
      className={`overflow-hidden rounded-2xl border border-violet-500/20 bg-zinc-950 shadow-[0_32px_80px_-32px_rgba(139,92,246,0.35)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <PulseFlowLogo size={32} />
          <div>
            <p className="text-sm font-semibold text-white">Live trial preview</p>
            <p className="text-[10px] text-zinc-500">
              Clip → thread · no account required
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            trialsRemaining > 0
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
          }`}
        >
          {trialsRemaining} free left
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-5">
        <div>
          <label
            htmlFor="demo-video-url"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
          >
            Video link
          </label>
          <input
            id="demo-video-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://youtube.com/watch?v=… or /shorts/…"
            value={inputUrl}
            onChange={(event) => setInputUrl(event.target.value)}
            disabled={isGenerating || trialsRemaining <= 0}
            className="demo-input-glow w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="mt-2 text-[11px] text-zinc-600">
            YouTube &amp; Shorts supported today. TikTok / Reels coming soon.
          </p>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isGenerating || trialsRemaining <= 0 || !inputUrl.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(139,92,246,0.55)] transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating thread…
            </>
          ) : trialsRemaining <= 0 ? (
            "No previews remaining"
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate Thread
            </>
          )}
        </button>
      </form>

      {hasThread ? (
        <div className="space-y-3 border-t border-zinc-800 bg-black/40 p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Your X thread preview
          </p>
          {generatedThread.map((tweet, index) => (
            <ThreadTweetCard
              key={`${index}-${tweet.slice(0, 24)}`}
              tweet={tweet}
              index={index}
              total={generatedThread.length}
            />
          ))}
        </div>
      ) : !isGenerating ? (
        <div className="border-t border-zinc-800/80 px-4 py-6 text-center md:px-5">
          <p className="text-sm text-zinc-500">
            Paste a link and hit Generate — your thread appears here in seconds.
          </p>
        </div>
      ) : (
        <div className="border-t border-zinc-800/80 px-4 py-10 text-center md:px-5">
          <Loader2 className="mx-auto size-6 animate-spin text-violet-400" />
          <p className="mt-3 text-sm text-zinc-500">
            Fetching transcript and writing your hook…
          </p>
        </div>
      )}

      {trialsRemaining <= 0 && !isGenerating ? (
        <div className="border-t border-zinc-800 bg-violet-500/5 px-4 py-4 md:px-5">
          <p className="text-sm text-zinc-400">
            You&apos;ve used all free previews on this device.
          </p>
          <Link
            href="/signup"
            className={`mt-3 inline-flex ${BTN_PRIMARY}`}
          >
            Start free beta
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
