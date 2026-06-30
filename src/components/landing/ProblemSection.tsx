"use client"

import { AlertTriangle } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { problemSection } from "@/lib/landing-content"

export default function ProblemSection() {
  return (
    <SectionShell id="problem" tone="default">
      <AnimatedSection>
        <SectionHeader
          label={problemSection.label}
          title={problemSection.title}
          description={problemSection.description}
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-3">
          {problemSection.pains.map((pain, index) => (
            <StaggerItem key={pain.title} index={index}>
              <article className={`${CARD_INTERACTIVE} p-6 md:p-7`}>
                <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                  <AlertTriangle className="size-4 text-amber-300" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{pain.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{pain.body}</p>
              </article>
            </StaggerItem>
          ))}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
