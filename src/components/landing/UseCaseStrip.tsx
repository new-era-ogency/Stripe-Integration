"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import FlowDiagram from "@/components/landing/FlowDiagram"
import { CARD_INTERACTIVE, LANDING_CONTAINER, SECTION_LABEL } from "@/lib/landing-styles"
import { useCaseFlows } from "@/lib/landing-content"

export default function UseCaseStrip() {
  return (
    <section
      id="use-cases"
      className="border-y border-zinc-900 bg-zinc-950/60 py-16 md:py-20"
    >
      <div className={LANDING_CONTAINER}>
        <AnimatedSection className="max-w-2xl">
          <p className={SECTION_LABEL}>What it does</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Real workflows you can build today
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-500">
            Not abstract features — concrete flows with triggers, steps, and outputs.
          </p>
        </AnimatedSection>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {useCaseFlows.map((flow, index) => (
            <StaggerItem key={flow.title} index={index}>
              <article className={`h-full ${CARD_INTERACTIVE} p-5 md:p-6`}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {flow.title}
                </p>
                <FlowDiagram nodes={flow.nodes} animated={index === 0} />
              </article>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  )
}
