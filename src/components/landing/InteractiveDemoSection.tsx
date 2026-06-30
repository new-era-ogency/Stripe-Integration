"use client"

import AnimatedSection from "@/components/landing/AnimatedSection"
import InteractiveProductShell from "@/components/landing/interactive/InteractiveProductShell"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BTN_SECONDARY } from "@/lib/landing-styles"
import { ctaStrategy, interactiveDemoCopy } from "@/lib/landing-content"

export default function InteractiveDemoSection() {
  return (
    <SectionShell id="interactive-demo" tone="spotlight">
      <AnimatedSection>
        <SectionHeader
          label={interactiveDemoCopy.label}
          title={interactiveDemoCopy.title}
          description={interactiveDemoCopy.description}
        />
      </AnimatedSection>

      <AnimatedSection delay={0.06} className="mt-10 md:mt-12">
        <InteractiveProductShell />
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mt-6 text-center">
        <p className="text-sm text-zinc-500">{interactiveDemoCopy.footnote}</p>
        <Link
          href={ctaStrategy.secondary.href}
          className={`mt-4 inline-flex ${BTN_SECONDARY}`}
        >
          {ctaStrategy.secondary.label}
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </AnimatedSection>
    </SectionShell>
  )
}
