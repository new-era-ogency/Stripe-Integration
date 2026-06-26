"use client"

import { ArrowRight } from "lucide-react"
import AnimatedSection from "@/components/landing/AnimatedSection"
import { LANDING_CONTAINER } from "@/lib/landing-styles"
import { useCaseFlows } from "@/lib/landing-content"

function FlowBlock({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-lg border px-3 py-2 text-xs font-medium md:text-sm ${
        accent
          ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
          : "border-zinc-700 bg-zinc-900/80 text-zinc-300"
      }`}
    >
      {label}
    </span>
  )
}

function FlowRow({
  title,
  nodes,
}: {
  title: string
  nodes: readonly string[]
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/60 p-4 md:p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
        {nodes.map((node, index) => (
          <span key={node} className="flex items-center gap-2 md:gap-2.5">
            <FlowBlock label={node} accent={index === 0} />
            {index < nodes.length - 1 ? (
              <ArrowRight
                className="size-3.5 shrink-0 text-violet-500/70"
                aria-hidden
              />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function UseCaseStrip() {
  return (
    <section
      id="use-cases"
      className="border-b border-zinc-900 bg-zinc-950/40 py-12 md:py-16"
    >
      <div className={LANDING_CONTAINER}>
        <AnimatedSection>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
            What PulseFlow actually does
          </p>
          <h2 className="mt-3 text-center text-xl font-bold text-white md:text-2xl">
            Real flows — not abstract features
          </h2>
        </AnimatedSection>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {useCaseFlows.map((flow, index) => (
            <AnimatedSection key={flow.title} delay={index * 0.06}>
              <FlowRow title={flow.title} nodes={flow.nodes} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
