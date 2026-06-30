import type { Metadata } from "next"
import Link from "next/link"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import OpenRouterApiKeyGuide from "@/components/guides/OpenRouterApiKeyGuide"

export const metadata: Metadata = {
  title: "OpenRouter API Key Setup | PulseFlow",
  description:
    "Step-by-step guide: create an OpenRouter API key, connect it in PulseFlow, and call the OpenRouter API directly from your own tools.",
}

export default function OpenRouterApiKeyGuidePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white"
          >
            <PulseFlowLogo size="xs" showWordmark />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard#settings"
              className="text-violet-400 transition-colors hover:text-violet-300"
            >
              Add key in Settings
            </Link>
            <Link
              href="/"
              className="text-zinc-400 transition-colors hover:text-white"
            >
              Back to home
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          Setup guide
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          OpenRouter API key
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Learn where to get your personal OpenRouter key, how to connect it in
          PulseFlow, and how to use the same key with the OpenRouter API
          directly.
        </p>

        <div className="mt-10">
          <OpenRouterApiKeyGuide variant="full" />
        </div>
      </article>
    </div>
  )
}
