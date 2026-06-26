"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { steps } from "@/lib/landing-content"

export default function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works">
      <AnimatedSection>
        <SectionHeader label="How it works" title="Three steps. That's it." centered />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((item, index) => (
            <StaggerItem key={item.step} index={index}>
              <li className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 text-center md:p-8">
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-sm font-bold text-violet-300">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white md:text-xl">
                  {item.title}
                </h3>
              </li>
            </StaggerItem>
          ))}
        </ol>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
