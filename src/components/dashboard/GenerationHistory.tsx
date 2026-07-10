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
import { dash } from "@/lib/dashboard/theme-classes"
import { cn } from "@/lib/utils"

type GenerationHistoryProps = {
  generations: GenerationRecord[]
  isGuest: boolean
  authChecked: boolean
  activeId?: string | null
  onView: (record: GenerationRecord) => void
  onCopy: (record: GenerationRecord) => void
  variant?: "full" | "embedded"
  emptyMessage?: string
  filter?: "all" | "month"
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

function filterGenerationsByMonth(
  records: GenerationRecord[]
): GenerationRecord[] {
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  return records.filter((record) => new Date(record.created_at) >= monthStart)
}

export default function GenerationHistory({
  generations,
  isGuest,
  authChecked,
  activeId,
  onView,
  onCopy,
  variant = "full",
  emptyMessage = "No generations yet",
  filter = "all",
}: GenerationHistoryProps) {
  const visibleGenerations =
    filter === "month" ? filterGenerationsByMonth(generations) : generations
  const monthEmptyMessage = "No generations this month yet. Create one to get started."
  const resolvedEmptyMessage =
    filter === "month" ? monthEmptyMessage : emptyMessage
  const sectionClassName =
    variant === "embedded"
      ? ""
      : "border-t border-zinc-900 pt-8 light:border-violet-200"

  if (!authChecked) {
    return (
      <section className={sectionClassName}>
        <div className={`mb-5 h-4 w-40 ${dash.skeleton}`} />
        <div className="grid gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className={`h-28 rounded-2xl border border-zinc-900/80 ${dash.card}`}
            />
          ))}
        </div>
      </section>
    )
  }

  if (isGuest) {
    return (
      <section className={sectionClassName}>
        {variant === "full" ? (
          <header className="mb-5">
            <p className={`text-[10px] uppercase tracking-[0.35em] ${dash.label}`}>
              Generation History
            </p>
          </header>
        ) : null}
        <div className={dash.emptyBox}>
          <History className="mx-auto mb-3 size-8 text-zinc-700 light:text-violet-400" />
          <p className={dash.body}>Sign in to save and revisit your generations.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={sectionClassName}>
      {variant === "full" ? (
        <header className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className={dash.label}>Generation History</p>
            <h2 className={`mt-1 ${dash.subheading}`}>
              {filter === "month" ? "This month" : "Your past outputs"}
            </h2>
          </div>
          <span className={dash.badge}>{visibleGenerations.length} saved</span>
        </header>
      ) : null}

      {visibleGenerations.length === 0 ? (
        <div
          className={
            variant === "embedded"
              ? "py-10 text-center"
              : `relative overflow-hidden rounded-2xl border border-dashed border-zinc-800/80 bg-gradient-to-b from-zinc-950/80 to-black px-6 py-14 text-center light:border-violet-200 light:from-violet-50/40 light:to-white`
          }
        >
          {variant === "full" ? (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_65%)]" />
          ) : null}
          <div className={variant === "full" ? "relative" : undefined}>
            {variant === "full" ? (
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                <Sparkles className="size-6 text-violet-400" />
              </div>
            ) : null}
            <p className={dash.emptyText}>{resolvedEmptyMessage}</p>
            {variant === "full" ? (
              <p className={`mx-auto mt-2 max-w-sm ${dash.muted}`}>
                Paste a YouTube link above to start. Every run is saved here so you
                can view or copy without regenerating.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <ul className="grid gap-3">
          {visibleGenerations.map((record) => {
            const preview = truncate(getPreviewText(record.generated_content))
            const isActive = activeId === record.id

            return (
              <li
                key={record.id}
                className={cn(
                  "group",
                  dash.historyItem,
                  isActive ? dash.historyItemActive : dash.historyItemIdle
                )}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-200/90 light:border-red-200 light:bg-red-50 light:text-red-700">
                        <Video className="size-3.5" />
                        {getVideoLabel(record.youtube_url)}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-xs ${dash.muted}`}>
                        <Calendar className="size-3.5" />
                        {formatGenerationDate(record.created_at)}
                      </span>
                    </div>

                    <a
                      href={record.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex max-w-full items-center gap-1.5 truncate ${dash.monoLink}`}
                    >
                      <span className="truncate">{record.youtube_url}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>

                    <p className={dash.preview}>{preview}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {record.generated_content.outputX ||
                      record.generated_content.twitterThread?.length ? (
                        <span className={dash.tag}>X</span>
                      ) : null}
                      {record.generated_content.outputLinkedIn ||
                      record.generated_content.linkedinArticle ? (
                        <span className={dash.tag}>LinkedIn</span>
                      ) : null}
                      {record.generated_content.outputTelegram ||
                      record.generated_content.telegramPost ? (
                        <span className={dash.tag}>Telegram</span>
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
                      className={`${dash.actionBtn} flex-1 md:flex-none`}
                    >
                      <Eye className="size-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopy(record)}
                      className={`${dash.actionBtnGhost} flex-1 md:flex-none`}
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
