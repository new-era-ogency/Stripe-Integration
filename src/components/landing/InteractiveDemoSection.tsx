"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import AnimatedSection from "@/components/landing/AnimatedSection"
import InteractiveProductShell from "@/components/landing/interactive/InteractiveProductShell"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import DashboardCtaLink from "@/components/marketing/DashboardCtaLink"
import SectionDashboardCta from "@/components/marketing/SectionDashboardCta"
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

      <AnimatedSection delay={0.1} className="mt-8 space-y-6">
        <p className="text-center text-sm text-zinc-500">{interactiveDemoCopy.footnote}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <DashboardCtaLink variant="primary" />
          <Link href={ctaStrategy.secondary.href} className={`inline-flex ${BTN_SECONDARY}`}>
            {ctaStrategy.secondary.label}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
        <SectionDashboardCta
          title="Skip the simulation — use the real dashboard"
          description="Paste a public YouTube URL, connect your OpenRouter key once, and generate publish-ready copy for X, LinkedIn, and Telegram."
        />
      </AnimatedSection>
    </SectionShell>
  )
}
