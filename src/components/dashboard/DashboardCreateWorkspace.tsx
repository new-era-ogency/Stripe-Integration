import Link from "next/link"
import { INSUFFICIENT_CREDITS_MESSAGE } from "@/lib/credits"
import { Loader2, Link2, Sparkles, Wand2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type StylePreset = "viral-thread" | "deep-dive" | "punchy-short"

const STYLE_PRESETS: {
  id: StylePreset
  label: string
  description: string
}[] = [
  {
    id: "viral-thread",
    label: "Viral Thread",
    description: "Hook-driven posts built for shares",
  },
  {
    id: "deep-dive",
    label: "Deep Dive",
    description: "Thoughtful, authority-building content",
  },
  {
    id: "punchy-short",
    label: "Punchy/Short",
    description: "Fast, high-impact snippets",
  },
]

const WORKFLOW_STEPS = [
  { icon: Link2, label: "Paste URL" },
  { icon: Wand2, label: "Pick tone" },
  { icon: Sparkles, label: "Generate" },
] as const

type DashboardCreateWorkspaceProps = {
  youtubeUrl: string
  onYoutubeUrlChange: (value: string) => void
  stylePreset: StylePreset
  onStylePresetChange: (preset: StylePreset) => void
  isLoading: boolean
  isGuest: boolean
  outOfCredits: boolean
  onGenerate: () => void
}

export default function DashboardCreateWorkspace({
  youtubeUrl,
  onYoutubeUrlChange,
  stylePreset,
  onStylePresetChange,
  isLoading,
  isGuest,
  outOfCredits,
  onGenerate,
}: DashboardCreateWorkspaceProps) {
  return (
    <section id="create" className="scroll-mt-36">
      <Card className="overflow-hidden gap-0 rounded-2xl border-violet-500/20 bg-zinc-950 py-0 shadow-[0_24px_80px_-40px_rgba(139,92,246,0.45)]">
        <div className="border-b border-violet-500/15 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-transparent px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
              Start here
            </span>
            <span className="text-xs text-zinc-500">
              One YouTube video → three publish-ready posts
            </span>
          </div>
          <CardHeader className="space-y-2 px-0 pt-4 pb-0">
            <CardTitle className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Create your content
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm text-zinc-400">
              This is the main workspace. Paste any public YouTube or Shorts
              link, choose a writing style, and PulseFlow handles the rest.
            </CardDescription>
          </CardHeader>

          <ol className="mt-5 flex flex-wrap gap-2">
            {WORKFLOW_STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <li
                  key={step.label}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-xs text-zinc-300"
                >
                  <span className="font-mono text-[10px] text-violet-400">
                    {index + 1}
                  </span>
                  <Icon className="size-3.5 text-violet-300" />
                  {step.label}
                </li>
              )
            })}
          </ol>
        </div>

        <CardContent className="space-y-6 px-6 py-6 sm:px-8">
          <div className="space-y-2">
            <Label htmlFor="youtube-url" className="text-sm text-zinc-300">
              YouTube URL
            </Label>
            <Input
              id="youtube-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://www.youtube.com/watch?v=… or /shorts/…"
              value={youtubeUrl}
              onChange={(event) => onYoutubeUrlChange(event.target.value)}
              className="demo-input-glow h-12 rounded-xl border-zinc-800 bg-zinc-900/80 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20"
            />
            <p className="text-xs text-zinc-600">
              Supports standard videos and Shorts. Transcript is fetched
              automatically.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm text-zinc-300">Tone / style preset</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {STYLE_PRESETS.map((preset) => {
                const selected = stylePreset === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onStylePresetChange(preset.id)}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      selected
                        ? "border-violet-500/50 bg-violet-500/10 ring-1 ring-violet-500/30"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        selected ? "text-white" : "text-zinc-200"
                      }`}
                    >
                      {preset.label}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {preset.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {outOfCredits ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-sm text-amber-200/90">
                {INSUFFICIENT_CREDITS_MESSAGE}
              </p>
              <Link
                href="/pricing"
                className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300"
              >
                View pricing →
              </Link>
            </div>
          ) : null}

          <Button
            onClick={onGenerate}
            disabled={!youtubeUrl || isLoading || isGuest || outOfCredits}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.5)] transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.6)] disabled:opacity-40 disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating your posts…
              </span>
            ) : isGuest ? (
              "Sign in to generate"
            ) : outOfCredits ? (
              "Upgrade to generate"
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Generate X, LinkedIn & Telegram
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

export type { StylePreset }
