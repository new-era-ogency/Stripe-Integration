"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { demoContent } from "@/lib/landing-content"
import { Sparkles } from "lucide-react"

type Platform = "x" | "linkedin" | "telegram"

type ProductPreviewMockupProps = {
  activePlatform?: Platform
  onPlatformChange?: (platform: Platform) => void
  compact?: boolean
}

export default function ProductPreviewMockup({
  activePlatform = "x",
  onPlatformChange,
  compact = false,
}: ProductPreviewMockupProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-violet-500/20 bg-zinc-950/70 shadow-[0_0_80px_-20px_rgba(139,92,246,0.45)] backdrop-blur-xl ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 size-36 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/20 text-violet-200">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-xs font-medium text-white">PulseFlow Studio</p>
              <p className="text-[10px] text-zinc-500">Live generation preview</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
            Ready
          </span>
        </div>

        <div className="mb-4 space-y-2">
          <label className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            YouTube URL
          </label>
          <div className="flex h-10 items-center rounded-lg border border-zinc-800 bg-black/60 px-3 font-mono text-xs text-zinc-400">
            youtube.com/watch?v=...
          </div>
        </div>

        <Tabs
          value={activePlatform}
          onValueChange={(value) => onPlatformChange?.(value as Platform)}
          className="w-full"
        >
          <TabsList className="grid h-9 w-full grid-cols-3 border border-zinc-800 bg-zinc-900/80 p-1">
            {(["x", "linkedin", "telegram"] as const).map((platform) => (
              <TabsTrigger
                key={platform}
                value={platform}
                className="rounded-md text-[10px] uppercase tracking-wider text-zinc-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                {platform === "x" ? "X" : platform}
              </TabsTrigger>
            ))}
          </TabsList>
          {(["x", "linkedin", "telegram"] as const).map((platform) => (
            <TabsContent key={platform} value={platform} className="mt-3">
              <div
                className={`whitespace-pre-line rounded-lg border border-zinc-800 bg-black/50 text-left text-xs leading-relaxed text-zinc-300 ${
                  compact ? "min-h-[160px] p-3" : "min-h-[200px] p-4"
                }`}
              >
                {demoContent[platform].slice(0, compact ? 280 : undefined)}
                {compact ? "…" : ""}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
