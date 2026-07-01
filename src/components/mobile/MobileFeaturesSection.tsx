"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CARD_BASE } from "@/lib/landing-styles"
import { coreFeatures } from "@/lib/landing-content"

export default function MobileFeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-zinc-900 px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
        Core features
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
        One workspace for content and tasks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">
        Generate posts from any source, manage outputs, and keep your OpenRouter
        key private in Settings.
      </p>

      <div className="mt-6 space-y-3">
        {coreFeatures.map((feature) => (
          <article key={feature.id} className={`${CARD_BASE} p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              {feature.title}
            </p>
            <h3 className="mt-1 text-base font-semibold text-white">
              {feature.headline}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {feature.body}
            </p>
          </article>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300"
      >
        Open dashboard
        <ArrowRight className="size-3.5" />
      </Link>
    </section>
  )
}
