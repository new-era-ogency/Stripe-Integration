"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import InteractiveCard from "@/components/landing/InteractiveCard"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  CARD_BASE,
  CARD_HOVER,
  SECTION_HEADER_CENTERED,
} from "@/lib/landing-styles"
import { steps } from "@/lib/landing-content"

export default function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works" tone="spotlight">
      <AnimatedSection className={SECTION_HEADER_CENTERED}>
        <SectionHeader
          centered
          label="How It Works"
          title="Three steps to every platform"
          description="From YouTube URL to publish-ready drafts in under a minute."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="relative">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-violet-500/35 to-transparent md:block" />

          <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8">
            {steps.map((item, index) => (
              <StaggerItem key={item.step} index={index}>
                <InteractiveCard
                  className={`relative h-full ${CARD_BASE} ${CARD_HOVER} p-8 md:p-9`}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/15 text-lg font-bold text-violet-100">
                      {item.step}
                    </div>
                    {index < steps.length - 1 ? (
                      <div className="hidden h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent md:block" />
                    ) : null}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </div>
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
