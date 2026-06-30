"use client"

import { ArrowRight } from "lucide-react"
import AnimatedSection from "@/components/landing/AnimatedSection"
import AiMeetingDemo from "@/components/landing/interactive/AiMeetingDemo"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { BTN_SECONDARY } from "@/lib/landing-styles"
import { aiMeetingsSection } from "@/lib/landing-content"
import { navigateToDemoTab } from "@/lib/demo-navigation"

export default function AiMeetingsSection() {
  return (
    <SectionShell id="ai-meetings" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label={aiMeetingsSection.label}
          title={aiMeetingsSection.title}
          description={aiMeetingsSection.description}
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <AnimatedSection delay={0.06}>
          <AiMeetingDemo />
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigateToDemoTab("meeting")}
            className={`inline-flex ${BTN_SECONDARY}`}
          >
            {aiMeetingsSection.cta}
            <ArrowRight className="ml-2 size-4" />
          </button>
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
