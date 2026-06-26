"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PerfModeProvider } from "@/hooks/usePerfMode"
import AnimatedSection from "@/components/landing/AnimatedSection"
import ChangelogSection from "@/components/landing/ChangelogSection"
import CredibilitySection from "@/components/landing/CredibilitySection"
import FaqAccordion from "@/components/landing/FaqAccordion"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import JobsSection from "@/components/landing/JobsSection"
import LandingHero from "@/components/landing/LandingHero"
import LandingNav from "@/components/landing/LandingNav"
import PricingAnchorSection from "@/components/landing/PricingAnchorSection"
import ProofLoopSection from "@/components/landing/ProofLoopSection"
import ScreenshotsSection from "@/components/landing/ScreenshotsSection"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import UseCaseStrip from "@/components/landing/UseCaseStrip"
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
} from "@/lib/landing-styles"
import { finalCta } from "@/lib/landing-content"

export default function HomePage() {
  return (
    <PerfModeProvider>
      <div className="min-h-screen bg-black text-white">
        <LandingNav />
        <LandingHero />
        <UseCaseStrip />
        <HowItWorksSection />
        <JobsSection />
        <ScreenshotsSection />
        <ProofLoopSection />
        <PricingAnchorSection />
        <CredibilitySection />
        <ChangelogSection />
        <FaqAccordion />

        <SectionShell divider={false} className="pb-28 pt-8 md:pb-36">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 via-zinc-950 to-zinc-950 p-8 md:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="relative max-w-2xl">
                <SectionHeader
                  label={finalCta.label}
                  title={finalCta.title}
                  description={finalCta.description}
                />
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className={`group inline-flex ${BTN_PRIMARY}`}>
                    {finalCta.primaryCta}
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link href="/pricing" className={BTN_SECONDARY}>
                    {finalCta.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </SectionShell>
      </div>
    </PerfModeProvider>
  )
}
