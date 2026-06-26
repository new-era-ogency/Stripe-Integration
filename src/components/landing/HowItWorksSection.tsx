"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import {
  BODY_TEXT,
  CARD_BASE,
  CARD_HOVER,
  LANDING_CONTAINER,
  LANDING_SECTION,
  SECTION_LABEL,
  SECTION_TITLE,
} from "@/lib/landing-styles"
import { steps } from "@/lib/landing-content"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className={LANDING_SECTION}>
      <div className={LANDING_CONTAINER}>
        <AnimatedSection className="text-center">
          <p className={SECTION_LABEL}>How It Works</p>
          <h2 className={`mt-3 ${SECTION_TITLE}`}>
            Three steps to every platform
          </h2>
          <p className={`mx-auto mt-4 ${BODY_TEXT}`}>
            From YouTube URL to publish-ready drafts in under a minute.
          </p>
        </AnimatedSection>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent md:block" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((item, index) => (
              <StaggerItem key={item.step} index={index}>
                <div
                  className={`relative h-full ${CARD_BASE} ${CARD_HOVER} p-8`}
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-indigo-500/15 text-lg font-semibold text-violet-200">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
