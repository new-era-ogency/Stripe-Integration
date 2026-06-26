"use client"

import { useEffect, useState } from "react"
import { usePerfMode } from "@/hooks/usePerfMode"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { demoContent } from "@/lib/landing-content"
import { CheckCircle2, Clock3, Layers3, Sparkles } from "lucide-react"

type Platform = "x" | "linkedin" | "telegram"

type ProductPreviewMockupProps = {
  activePlatform?: Platform
  onPlatformChange?: (platform: Platform) => void
  compact?: boolean
}

const platformLabels: Record<Platform, string> = {
  x: "X Thread",
  linkedin: "LinkedIn",
  telegram: "Telegram",
}

const fullUrl = "youtube.com/watch?v=dQw4w9WgXcQ"

export default function ProductPreviewMockup({
  activePlatform = "x",
  onPlatformChange,
  compact = false,
}: ProductPreviewMockupProps) {
  const { isLite } = usePerfMode()
  const [typedUrl, setTypedUrl] = useState(isLite ? fullUrl : "")

  useEffect(() => {
    if (isLite) {
      setTypedUrl(fullUrl)
      return
    }

    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setTypedUrl(fullUrl.slice(0, index))
      if (index >= fullUrl.length) {
        window.clearInterval(interval)
      }
    }, 48)

    return () => window.clearInterval(interval)
  }, [isLite])

  return (
    <div className={`mockup-float relative ${isLite ? "perf-static-mockup" : ""}`}>
      <div className="pointer-events-none absolute -inset-4 rounded-[1.75rem] bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/15 blur-2xl" />

      <div
        className={`relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-zinc-950/90 shadow-[0_32px_80px_-24px_rgba(139,92,246,0.55)] backdrop-blur-2xl perf-surface ${
          compact ? "p-3" : "p-4 md:p-5"
        }`}
      >
        <div className="mb-4 flex items-center gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-black/70 px-3 py-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="truncate font-mono text-[11px] text-zinc-400">
              {typedUrl}
              {!isLite ? (
                <span className="mockup-cursor ml-px inline-block h-3.5 w-px translate-y-0.5 bg-violet-400" />
              ) : null}
            </span>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/35 to-indigo-500/20 text-violet-100 shadow-inner">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">PulseFlow Studio</p>
              <p className="text-[11px] text-zinc-500">Multi-platform generation</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
            <CheckCircle2 className="size-3" />
            Ready
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { icon: Layers3, label: "3 outputs" },
            { icon: Clock3, label: "47 sec" },
            { icon: Sparkles, label: "Pro quality" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-zinc-800/80 bg-black/40 px-2.5 py-2 text-center"
            >
              <metric.icon className="mx-auto mb-1 size-3.5 text-violet-300/80" />
              <p className="text-[10px] font-medium text-zinc-400">{metric.label}</p>
            </div>
          ))}
        </div>

        <Tabs
          value={activePlatform}
          onValueChange={(value) => onPlatformChange?.(value as Platform)}
          className="w-full"
        >
          <TabsList className="grid h-10 w-full grid-cols-3 border border-zinc-800/90 bg-zinc-900/70 p-1">
            {(["x", "linkedin", "telegram"] as const).map((platform) => (
              <TabsTrigger
                key={platform}
                value={platform}
                className="rounded-lg text-[10px] font-medium uppercase tracking-wider text-zinc-500 transition-colors data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                {platform === "x" ? "X" : platform}
              </TabsTrigger>
            ))}
          </TabsList>

          {(["x", "linkedin", "telegram"] as const).map((platform) => (
            <TabsContent key={platform} value={platform} className="mt-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {platformLabels[platform]}
                </p>
                <span className="text-[10px] text-zinc-600">Preview</span>
              </div>
              <div
                className={`mockup-shimmer relative overflow-hidden whitespace-pre-line rounded-xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 to-black/80 text-left text-xs leading-relaxed text-zinc-300 ${
                  compact ? "min-h-[170px] p-3.5" : "min-h-[220px] p-4"
                }`}
              >
                {demoContent[platform].slice(0, compact ? 300 : undefined)}
                {compact ? "…" : ""}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
