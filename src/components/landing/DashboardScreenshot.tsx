"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import { demoContent, productAnnotations } from "@/lib/landing-content"

type Platform = "x" | "linkedin" | "telegram"

type DashboardScreenshotProps = {
  activePlatform?: Platform
  onPlatformChange?: (platform: Platform) => void
  compact?: boolean
  showAnnotations?: boolean
  highlight?: boolean
}

const platformLabels: Record<Platform, string> = {
  x: "X thread",
  linkedin: "LinkedIn post",
  telegram: "Telegram drop",
}

const platformColors: Record<Platform, string> = {
  x: "data-[state=active]:text-sky-300",
  linkedin: "data-[state=active]:text-blue-300",
  telegram: "data-[state=active]:text-cyan-300",
}

export default function DashboardScreenshot({
  activePlatform = "x",
  onPlatformChange,
  compact = false,
  showAnnotations = true,
  highlight = false,
}: DashboardScreenshotProps) {
  return (
    <div className="relative">
      {showAnnotations
        ? productAnnotations.map((note) => (
            <div
              key={note.id}
              className={`absolute z-20 hidden max-w-[10.5rem] rounded-lg border border-violet-500/25 bg-zinc-900/95 px-3 py-2 text-[11px] leading-snug text-zinc-300 shadow-lg lg:block ${
                note.position === "top-left"
                  ? "-left-3 top-6 -translate-x-full"
                  : "-right-3 bottom-20 translate-x-full"
              }`}
            >
              <span className="mb-1 block font-medium text-violet-300">→</span>
              {note.label}
            </div>
          ))
        : null}

      <div
        className={`overflow-hidden rounded-2xl border bg-zinc-950 ${
          highlight
            ? "border-violet-500/25 shadow-[0_24px_80px_-24px_rgba(139,92,246,0.45)]"
            : "border-zinc-800 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <PulseFlowLogo size={28} />
            <div>
              <p className="text-xs font-semibold text-white">PulseFlow</p>
              <p className="text-[10px] text-zinc-500">Dashboard</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            Live
          </span>
        </div>

        <div className={compact ? "p-4" : "p-5 md:p-6"}>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            YouTube URL
          </label>
          <div className="mt-2 flex h-10 items-center rounded-lg border border-zinc-800 bg-black/60 px-3 font-mono text-xs text-zinc-400 ring-1 ring-violet-500/10">
            youtube.com/watch?v=dQw4w9WgXcQ
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Credits", value: "12" },
              { label: "Runtime", value: "~47s" },
              { label: "Outputs", value: "3" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2 py-2 text-center"
              >
                <p className="text-sm font-semibold text-white">{stat.value}</p>
                <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Tabs
            value={activePlatform}
            onValueChange={(value) => onPlatformChange?.(value as Platform)}
            className="mt-4 w-full"
          >
            <TabsList className="grid h-10 w-full grid-cols-3 border border-zinc-800 bg-black/40 p-1">
              {(["x", "linkedin", "telegram"] as const).map((platform) => (
                <TabsTrigger
                  key={platform}
                  value={platform}
                  className={`rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-500 transition-colors data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm ${platformColors[platform]}`}
                >
                  {platform === "x" ? "X" : platform}
                </TabsTrigger>
              ))}
            </TabsList>

            {(["x", "linkedin", "telegram"] as const).map((platform) => (
              <TabsContent key={platform} value={platform} className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    {platformLabels[platform]}
                  </p>
                  <span className="text-[10px] text-zinc-600">Editable</span>
                </div>
                <div
                  className={`whitespace-pre-line rounded-xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/50 to-black/80 text-left text-xs leading-relaxed text-zinc-300 ${
                    compact ? "min-h-[150px] p-3.5" : "min-h-[210px] p-4"
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
    </div>
  )
}
