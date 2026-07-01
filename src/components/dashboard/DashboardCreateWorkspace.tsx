"use client"

import { useCallback, useRef, useState } from "react"
import {
  FileAudio,
  FileText,
  Globe,
  Link2,
  Sparkles,
  Square,
  Upload,
  Video,
  Wand2,
  Zap,
} from "lucide-react"
import GenerationProgressPanel from "@/components/dashboard/GenerationProgressPanel"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { ContentSourceInput, ContentSourceTab } from "@/lib/content-sources/types"
import type { GenerationProgressState } from "@/lib/generation/progress"
import type { UserTier } from "@/lib/profile"
import {
  validateWhisperUploadFile,
  WHISPER_MAX_FILE_BYTES,
} from "@/lib/openai/whisper-transcribe"
import { cn } from "@/lib/utils"

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
  { icon: Link2, label: "Add source" },
  { icon: Wand2, label: "Pick tone" },
  { icon: Sparkles, label: "Generate" },
] as const

const TAB_ITEMS: {
  id: ContentSourceTab
  label: string
  icon: typeof Video
}[] = [
  { id: "youtube", label: "YouTube", icon: Video },
  { id: "article", label: "Article", icon: Globe },
  { id: "text", label: "Text", icon: FileText },
  { id: "media", label: "Media", icon: FileAudio },
]

const tabTriggerClassName = cn(
  "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-transparent px-2 text-xs font-medium text-zinc-400 transition-colors sm:px-3 sm:text-sm",
  "after:hidden",
  "data-[state=active]:border-violet-500/40 data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-100 data-[state=active]:shadow-none",
  "dark:data-[state=active]:border-violet-500/40 dark:data-[state=active]:bg-violet-500/15 dark:data-[state=active]:text-violet-100"
)

const sourcePanelClassName =
  "space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5"

const inputClassName =
  "demo-input-glow h-12 rounded-xl border-zinc-800 bg-zinc-900/80 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 disabled:opacity-60"

const textareaClassName =
  "min-h-[160px] resize-y rounded-xl border-zinc-800 bg-zinc-900/80 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 disabled:opacity-60"

type DashboardCreateWorkspaceProps = {
  stylePreset: StylePreset
  onStylePresetChange: (preset: StylePreset) => void
  isLoading: boolean
  generationProgress?: GenerationProgressState | null
  tier: UserTier
  isGuest: boolean
  hasOpenAiKey: boolean
  onGenerate: (source: ContentSourceInput) => void
  onStopGeneration?: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DashboardCreateWorkspace({
  stylePreset,
  onStylePresetChange,
  isLoading,
  generationProgress,
  tier,
  isGuest,
  hasOpenAiKey,
  onGenerate,
  onStopGeneration,
}: DashboardCreateWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<ContentSourceTab>("youtube")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [articleUrl, setArticleUrl] = useState("")
  const [articleText, setArticleText] = useState("")
  const [rawText, setRawText] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const assignMediaFile = useCallback((file: File | null) => {
    if (!file) {
      setMediaFile(null)
      setMediaError(null)
      return
    }

    const error = validateWhisperUploadFile(file)
    if (error) {
      setMediaFile(null)
      setMediaError(error)
      return
    }

    setMediaFile(file)
    setMediaError(null)
  }, [])

  const hasSourceInput = (() => {
    switch (activeTab) {
      case "youtube":
        return Boolean(youtubeUrl.trim())
      case "article":
        return Boolean(articleText.trim() || articleUrl.trim())
      case "text":
        return Boolean(rawText.trim())
      case "media":
        return Boolean(mediaFile)
      default:
        return false
    }
  })()

  const canSubmit = hasSourceInput && !isLoading && !isGuest && hasOpenAiKey

  const buildSourceInput = (): ContentSourceInput | null => {
    switch (activeTab) {
      case "youtube":
        return youtubeUrl.trim()
          ? { type: "youtube", url: youtubeUrl.trim() }
          : null
      case "article":
        return articleText.trim() || articleUrl.trim()
          ? {
              type: "article",
              url: articleUrl.trim(),
              pastedText: articleText.trim(),
            }
          : null
      case "text":
        return rawText.trim() ? { type: "text", rawText: rawText.trim() } : null
      case "media":
        return mediaFile ? { type: "media", file: mediaFile } : null
      default:
        return null
    }
  }

  const handleGenerateClick = () => {
    const source = buildSourceInput()
    if (source) {
      onGenerate(source)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files?.[0] ?? null
    assignMediaFile(file)
  }

  const keyHelper = hasOpenAiKey ? (
    <p className="text-xs text-emerald-400/90">
      Generates using your connected OpenAI key (direct client fetch).
    </p>
  ) : !isGuest ? (
    <p className="text-xs text-violet-400/90">
      An OpenAI API key is required before you can generate. Use the{" "}
      <span className="font-medium text-violet-300">API Key Missing</span> badge
      in the header to connect yours.
    </p>
  ) : (
    <p className="text-xs text-zinc-600">
      Sign in and connect your OpenAI key to start generating.
    </p>
  )

  return (
    <section id="create" className="scroll-mt-36">
      <Card className="overflow-hidden gap-0 rounded-2xl border-violet-500/20 bg-zinc-950 py-0 shadow-[0_24px_80px_-40px_rgba(139,92,246,0.45)]">
        <div className="border-b border-violet-500/15 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-transparent px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
              BYOK dashboard
            </span>
            <span className="text-xs text-zinc-500">
              YouTube · articles · raw text · audio/video
            </span>
          </div>
          <CardHeader className="space-y-2 px-0 pt-4 pb-0">
            <CardTitle className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Create your content
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm text-zinc-400">
              Choose any source, pick a tone, and generate with your connected
              OpenAI key — privately, from your browser.
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
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ContentSourceTab)}
            className="gap-3"
          >
            <TabsList
              variant="line"
              className="flex h-auto w-full gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1.5"
            >
              {TAB_ITEMS.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    disabled={isGuest}
                    className={tabTriggerClassName}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value="youtube" className="mt-0 focus-visible:outline-none">
              <div className={sourcePanelClassName}>
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
                onChange={(event) => setYoutubeUrl(event.target.value)}
                disabled={isGuest || isLoading}
                className={inputClassName}
              />
              <p className="text-xs text-zinc-600">
                We try our server first, then your OpenRouter key with a
                web-enabled model if YouTube blocks cloud IPs.
              </p>
              </div>
            </TabsContent>

            <TabsContent value="article" className="mt-0 focus-visible:outline-none">
              <div className={cn(sourcePanelClassName, "space-y-4")}>
              <div className="space-y-2">
                <Label htmlFor="article-url" className="text-sm text-zinc-300">
                  Article URL
                </Label>
                <Input
                  id="article-url"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder="https://example.com/blog/your-article"
                  value={articleUrl}
                  onChange={(event) => setArticleUrl(event.target.value)}
                  disabled={isGuest || isLoading}
                  className={inputClassName}
                />
                <p className="text-xs text-zinc-600">
                  We try a direct browser fetch first. Most sites block this —
                  paste the article body below when that happens.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-text" className="text-sm text-zinc-300">
                  Or paste article text
                </Label>
                <Textarea
                  id="article-text"
                  value={articleText}
                  onChange={(event) => setArticleText(event.target.value)}
                  disabled={isGuest || isLoading}
                  placeholder="Paste the full article, newsletter, or blog post here…"
                  className={textareaClassName}
                />
              </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0 focus-visible:outline-none">
              <div className={sourcePanelClassName}>
              <Label htmlFor="raw-text" className="text-sm text-zinc-300">
                Raw source text
              </Label>
              <Textarea
                id="raw-text"
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                disabled={isGuest || isLoading}
                placeholder="Paste a video script, brainstorm notes, transcript draft, or any source material…"
                className="min-h-[220px] resize-y rounded-xl border-zinc-800 bg-zinc-900/80 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 disabled:opacity-60"
              />
              <p className="text-xs text-zinc-600">
                Skips all transcript fetching — your text goes straight into
                generation.
              </p>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-0 focus-visible:outline-none">
              <div className={cn(sourcePanelClassName, "space-y-3")}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.mp4,.m4a,audio/mpeg,audio/wav,video/mp4,audio/mp4"
                className="hidden"
                onChange={(event) => {
                  assignMediaFile(event.target.files?.[0] ?? null)
                }}
              />
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-all",
                  isDragOver
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-zinc-700 bg-zinc-900/40 hover:border-violet-500/30 hover:bg-violet-500/5",
                  (isGuest || isLoading) && "pointer-events-none opacity-50"
                )}
              >
                <span className="mb-3 flex size-12 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-300">
                  <Upload className="size-5" />
                </span>
                <p className="text-sm font-medium text-white">
                  Drop audio or video here
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  mp3, wav, mp4, m4a · max{" "}
                  {formatFileSize(WHISPER_MAX_FILE_BYTES)}
                </p>
                <p className="mt-3 text-xs text-violet-400/90">
                  Transcribed via Whisper using your OpenAI key
                </p>
              </div>

              {mediaFile ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-100/90">
                  <span className="font-medium">{mediaFile.name}</span>
                  <span className="text-emerald-200/70">
                    {" "}
                    · {formatFileSize(mediaFile.size)}
                  </span>
                </div>
              ) : null}

              {mediaError ? (
                <p className="text-sm text-red-400" role="alert">
                  {mediaError}
                </p>
              ) : null}
              </div>
            </TabsContent>
          </Tabs>

          {keyHelper}

          <div className="space-y-3">
            <Label className="text-sm text-zinc-300">Tone / style preset</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {STYLE_PRESETS.map((preset) => {
                const selected = stylePreset === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onStylePresetChange(preset.id)}
                    disabled={isGuest || isLoading}
                    className={cn(
                      "flex min-h-[4.5rem] flex-col rounded-xl border px-4 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50",
                      selected
                        ? "border-violet-500/50 bg-violet-500/10 ring-1 ring-violet-500/30"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-medium",
                        selected ? "text-white" : "text-zinc-200"
                      )}
                    >
                      {preset.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                      {preset.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            {isLoading && generationProgress ? (
              <GenerationProgressPanel progress={generationProgress} tier={tier} />
            ) : null}

            {isLoading ? (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onStopGeneration}
                  className="h-11 w-full rounded-xl border-red-500/30 bg-red-500/5 text-sm font-medium text-red-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-100"
                >
                  <span className="flex items-center gap-2">
                    <Square className="size-3.5 fill-current" />
                    Stop generation
                  </span>
                </Button>
                <p className="text-center text-xs text-zinc-500">
                  Stops transcript fetch and AI calls from this browser. If
                  generation already reached the server, that run may still use
                  tokens.
                </p>
              </div>
            ) : (
              <Button
                onClick={handleGenerateClick}
                disabled={!canSubmit}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.5)] transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.6)] disabled:opacity-40 disabled:shadow-none"
              >
                {isGuest ? (
                  "Sign in to generate"
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Generate X, LinkedIn & Telegram
                  </span>
                )}
              </Button>
            )}

            {!isGuest && !hasOpenAiKey && hasSourceInput && !isLoading ? (
              <p className="text-center text-xs text-zinc-500">
                Generation is locked until you connect an OpenAI API key.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export type { StylePreset }
