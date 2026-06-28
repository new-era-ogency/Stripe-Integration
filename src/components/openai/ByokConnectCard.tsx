"use client"

import { KeyRound, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type ByokConnectCardProps = {
  onConnectClick: () => void
}

export default function ByokConnectCard({ onConnectClick }: ByokConnectCardProps) {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-zinc-950/80 to-zinc-950/80 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-300">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">
            100% free usage. Absolute privacy.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
            PulseFlow runs entirely on your own OpenAI API key. Your key stays in
            this browser, generation calls OpenAI directly, and you pay only
            OpenAI&apos;s per-request rates — no PulseFlow subscription required.
          </p>
          <Button
            type="button"
            onClick={onConnectClick}
            className="mt-4 h-10 rounded-lg bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200"
          >
            <KeyRound className="mr-2 size-4" aria-hidden />
            Connect OpenAI key in 1 click
          </Button>
        </div>
      </div>
    </div>
  )
}
