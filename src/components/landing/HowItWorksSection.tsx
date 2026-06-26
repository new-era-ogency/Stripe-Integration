"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { SECTION_CONTENT_GAP } from "@/lib/landing-styles"
import { steps } from "@/lib/landing-content"

export default function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works">
      <AnimatedSection>
        <SectionHeader
          label="How it works"
          title="Three steps. No configuration rabbit hole."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <ol className={`relative space-y-0 ${SECTION_CONTENT_GAP}`}>
          <div
            className="absolute bottom-8 left-5 top-8 hidden w-px bg-gradient-to-b from-violet-500/50 via-zinc-800 to-transparent md:block"
            aria-hidden
          />

          {steps.map((item, index) => (
            <StaggerItem key={item.step} index={index}>
              <li className="relative flex gap-5 py-6 md:gap-8 md:py-8">
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-sm font-bold text-violet-300 shadow-[0_0_24px_-8px_rgba(139,92,246,0.5)]">
                  {item.step}
                </span>
                <div className="flex-1 border-b border-zinc-800/80 pb-6 md:pb-8">
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </li>
            </StaggerItem>
          ))}
        </ol>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
