"use client"

import {
  Calendar,
  Copy,
  ExternalLink,
  Eye,
  History,
  Sparkles,
  Video,
} from "lucide-react"
import type { GeneratedContent, GenerationRecord } from "@/lib/generations"

type GenerationHistoryProps = {
  generations: GenerationRecord[]
  isGuest: boolean
  authChecked: boolean
  activeId?: string | null
  onView: (record: GenerationRecord) => void
  onCopy: (record: GenerationRecord) => void
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null
    }
    return parsed.searchParams.get("v")
  } catch {
    return null
  }
}

function getVideoLabel(url: string): string {
  const videoId = extractVideoId(url)
  return videoId ? `YouTube · ${videoId}` : "YouTube video"
}

function formatGenerationDate(dateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString))
}

function getPreviewText(content: GeneratedContent): string {
  const primary = content.outputX?.trim()
  if (primary) {
    return primary.replace(/\s+/g, " ")
  }

  return (
    content.outputLinkedIn?.trim() ||
    content.outputTelegram?.trim() ||
    "Generated content"
  ).replace(/\s+/g, " ")
}

function truncate(text: string, max = 140): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

export default function GenerationHistory({
  generations,
  isGuest,
  authChecked,
  activeId,
  onView,
  onCopy,
}: GenerationHistoryProps) {
  if (!authChecked) {
    return (
      <section className="border-t border-zinc-900 pt-8">
        <div className="mb-5 h-4 w-40 animate-pulse rounded bg-zinc-900" />
        <div className="grid gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-zinc-900/80 bg-zinc-950/50"
            />
          ))}
        </div>
      </section>
    )
  }

  if (isGuest) {
    return (
      <section className="border-t border-zinc-900 pt-8">
        <header className="mb-5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
            Generation History
          </p>
        </header>
        <div className="rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-950/40 px-6 py-12 text-center">
          <History className="mx-auto mb-3 size-8 text-zinc-700" />
          <p className="text-sm text-zinc-400">Sign in to save and revisit your generations.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-zinc-900 pt-8">
      <header className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
            Generation History
          </p>
          <h2 className="mt-1 text-lg font-medium text-white">Your past outputs</h2>
        </div>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-[10px] text-zinc-500">
          {generations.length} saved
        </span>
      </header>

      {generations.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-800/80 bg-gradient-to-b from-zinc-950/80 to-black px-6 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_65%)]" />
          <div className="relative">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
              <Sparkles className="size-6 text-violet-400" />
            </div>
            <p className="text-base font-medium text-zinc-200">
              No generations yet
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
              Paste a YouTube link above to start. Every run is saved here so you
              can view or copy without regenerating.
            </p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-3">
          {generations.map((record) => {
            const preview = truncate(getPreviewText(record.generated_content))
            const isActive = activeId === record.id

            return (
              <li
                key={record.id}
                className={`group rounded-2xl border bg-zinc-950/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-950/80 md:p-5 ${
                  isActive
                    ? "border-violet-500/40 shadow-[0_0_30px_-12px_rgba(139,92,246,0.35)]"
                    : "border-zinc-900"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-200/90">
                        <Video className="size-3.5" />
                        {getVideoLabel(record.youtube_url)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar className="size-3.5" />
                        {formatGenerationDate(record.created_at)}
                      </span>
                    </div>

                    <a
                      href={record.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1.5 truncate font-mono text-[11px] text-zinc-500 transition-colors hover:text-violet-300"
                    >
                      <span className="truncate">{record.youtube_url}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>

                    <p className="text-sm leading-relaxed text-zinc-400">
                      {preview}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {record.generated_content.outputX ||
                      record.generated_content.twitterThread?.length ? (
                        <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                          X
                        </span>
                      ) : null}
                      {record.generated_content.outputLinkedIn ||
                      record.generated_content.linkedinArticle ? (
                        <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                          LinkedIn
                        </span>
                      ) : null}
                      {record.generated_content.outputTelegram ||
                      record.generated_content.telegramPost ? (
                        <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                          Telegram
                        </span>
                      ) : null}
                      {record.generated_content.shortsScript ? (
                        <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet-300/80">
                          Shorts
                        </span>
                      ) : null}
                      {record.generated_content.viralShortsHooks?.length ? (
                        <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-300/80">
                          Viral Hooks
                        </span>
                      ) : null}
                      {record.generated_content.packTier === "pro_max" ? (
                        <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-300/80">
                          Pro Max
                        </span>
                      ) : record.generated_content.packTier === "pro" ? (
                        <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet-300/80">
                          Pro Pack
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 md:flex-col md:items-stretch">
                    <button
                      type="button"
                      onClick={() => onView(record)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 text-xs font-medium text-zinc-200 transition-colors hover:border-violet-500/30 hover:bg-zinc-900 hover:text-white md:flex-none"
                    >
                      <Eye className="size-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopy(record)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-transparent px-4 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white md:flex-none"
                    >
                      <Copy className="size-3.5" />
                      Copy
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
