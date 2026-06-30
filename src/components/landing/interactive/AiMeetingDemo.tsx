"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import {
  Check,
  FileVideo,
  Kanban,
  Lightbulb,
  ListTodo,
  Loader2,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { meetingScript, meetingTranscriptLines } from "@/lib/interactive-demo-data"

type MeetingPhase =
  | "idle"
  | "uploading"
  | "transcribing"
  | "summary"
  | "tasks"
  | "decision"
  | "kanban"
  | "complete"

const PHASE_DELAY_MS: Record<Exclude<MeetingPhase, "idle" | "complete">, number> =
  {
    uploading: 1400,
    transcribing: 3200,
    summary: 1800,
    tasks: 1600,
    decision: 1400,
    kanban: 1200,
  }

type AiMeetingDemoProps = {
  onKanbanTaskAdded?: (title: string) => void
}

export default function AiMeetingDemo({ onKanbanTaskAdded }: AiMeetingDemoProps) {
  const [phase, setPhase] = useState<MeetingPhase>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [visibleTranscriptLines, setVisibleTranscriptLines] = useState(0)

  const runDemo = useCallback(() => {
    setPhase("uploading")
    setUploadProgress(0)
    setVisibleTranscriptLines(0)
  }, [])

  useEffect(() => {
    if (phase === "idle" || phase === "complete") return

    if (phase === "uploading") {
      const interval = window.setInterval(() => {
        setUploadProgress((value) => {
          if (value >= 100) {
            window.clearInterval(interval)
            return 100
          }
          return value + 12
        })
      }, 120)

      const timer = window.setTimeout(() => {
        window.clearInterval(interval)
        setPhase("transcribing")
      }, PHASE_DELAY_MS.uploading)

      return () => {
        window.clearInterval(interval)
        window.clearTimeout(timer)
      }
    }

    if (phase === "transcribing") {
      const lineInterval = window.setInterval(() => {
        setVisibleTranscriptLines((count) => {
          if (count >= meetingTranscriptLines.length) {
            window.clearInterval(lineInterval)
            return count
          }
          return count + 1
        })
      }, 480)

      const timer = window.setTimeout(() => {
        window.clearInterval(lineInterval)
        setVisibleTranscriptLines(meetingTranscriptLines.length)
        setPhase("summary")
      }, PHASE_DELAY_MS.transcribing)

      return () => {
        window.clearInterval(lineInterval)
        window.clearTimeout(timer)
      }
    }

    const next: Partial<Record<MeetingPhase, MeetingPhase>> = {
      transcribing: "summary",
      summary: "tasks",
      tasks: "decision",
      decision: "kanban",
      kanban: "complete",
    }

    const timer = window.setTimeout(() => {
      const upcoming = next[phase]
      if (upcoming === "kanban") {
        onKanbanTaskAdded?.(meetingScript.decision)
      }
      if (upcoming) {
        setPhase(upcoming)
      }
    }, PHASE_DELAY_MS[phase as keyof typeof PHASE_DELAY_MS])

    return () => window.clearTimeout(timer)
  }, [onKanbanTaskAdded, phase])

  const isRunning = phase !== "idle" && phase !== "complete"

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            AI Meeting
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Upload a recording — get summary, tasks, and decisions auto-routed.
          </p>
        </div>
        {phase === "complete" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
            <Check className="size-3" />
            Added to Kanban
          </span>
        ) : null}
      </div>

      {phase === "idle" ? (
        <button
          type="button"
          onClick={runDemo}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 px-6 py-10 text-center transition-all hover:border-cyan-500/40 hover:bg-cyan-500/5"
        >
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
            <Upload className="size-5" />
          </span>
          <p className="text-sm font-medium text-white">
            Click to upload {meetingScript.fileName}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Simulated demo · {meetingScript.duration} · no file leaves your browser
          </p>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/40 px-4 py-3">
            <FileVideo className="size-5 shrink-0 text-cyan-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {meetingScript.fileName}
              </p>
              <p className="text-xs text-zinc-500">{meetingScript.duration}</p>
            </div>
            {isRunning ? (
              <Loader2 className="size-4 animate-spin text-cyan-400" />
            ) : (
              <Check className="size-4 text-emerald-400" />
            )}
          </div>

          <ol className="space-y-2">
            <PhaseRow
              label="Uploading…"
              active={phase === "uploading"}
              done={phase !== "uploading"}
              detail={
                phase === "uploading" ? `${Math.min(uploadProgress, 100)}%` : undefined
              }
            />
            <PhaseRow
              label="Transcribing…"
              active={phase === "transcribing"}
              done={!["idle", "uploading", "transcribing"].includes(phase)}
            />
            <PhaseRow
              label="Summary"
              active={phase === "summary"}
              done={["tasks", "decision", "kanban", "complete"].includes(phase)}
              icon={<Lightbulb className="size-3.5" />}
            />
            <PhaseRow
              label="Tasks generated"
              active={phase === "tasks"}
              done={["decision", "kanban", "complete"].includes(phase)}
              icon={<ListTodo className="size-3.5" />}
            />
            <PhaseRow
              label="Decision captured"
              active={phase === "decision"}
              done={["kanban", "complete"].includes(phase)}
            />
            <PhaseRow
              label="Added to Kanban"
              active={phase === "kanban"}
              done={phase === "complete"}
              icon={<Kanban className="size-3.5" />}
            />
          </ol>

          {phase === "transcribing" ? (
            <div className="max-h-36 overflow-y-auto rounded-lg border border-cyan-500/20 bg-black/50 p-3 font-mono text-xs leading-relaxed text-cyan-100/90">
              {meetingTranscriptLines.slice(0, visibleTranscriptLines).map((line) => (
                <p key={line} className="transcript-line-appear py-0.5">
                  {line}
                </p>
              ))}
              {visibleTranscriptLines < meetingTranscriptLines.length ? (
                <span className="inline-block h-3 w-1.5 animate-pulse bg-cyan-400/80" />
              ) : null}
            </div>
          ) : null}

          {["summary", "tasks", "decision", "kanban", "complete"].includes(phase) ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 text-sm leading-relaxed text-zinc-300">
              <p className="whitespace-pre-wrap">{meetingScript.summary}</p>
              {["tasks", "decision", "kanban", "complete"].includes(phase) ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-zinc-400">
                  {meetingScript.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              ) : null}
              {["decision", "kanban", "complete"].includes(phase) ? (
                <p className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-violet-200">
                  <span className="font-semibold text-violet-300">Decision: </span>
                  {meetingScript.decision}
                </p>
              ) : null}
            </div>
          ) : null}

          {phase === "complete" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setPhase("idle")}
              className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900"
            >
              Run again
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}

function PhaseRow({
  label,
  active,
  done,
  detail,
  icon,
}: {
  label: string
  active: boolean
  done: boolean
  detail?: string
  icon?: ReactNode
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
          : done
            ? "text-emerald-300/90"
            : "text-zinc-600"
      }`}
    >
      {done ? (
        <Check className="size-4 shrink-0 text-emerald-400" />
      ) : active ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <span className="size-4 shrink-0 rounded-full border border-zinc-700" />
      )}
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {detail ? (
        <span className="ml-auto font-mono text-xs text-cyan-300/80">{detail}</span>
      ) : null}
    </li>
  )
}
