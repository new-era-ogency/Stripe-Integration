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
  CARD_INTERACTIVE,
} from "@/lib/landing-styles"
import { finalCta, positioning } from "@/lib/landing-content"

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

        <SectionShell divider={false} className="pb-28 pt-4 md:pb-36">
          <AnimatedSection>
            <div className={`${CARD_INTERACTIVE} border-violet-500/15 p-8 md:p-12`}>
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-xl">
                  <SectionHeader
                    label={finalCta.label}
                    title={finalCta.title}
                    description={finalCta.description}
                  />
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/signup"
                      className={`group inline-flex ${BTN_PRIMARY}`}
                    >
                      {finalCta.primaryCta}
                      <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/pricing" className={BTN_SECONDARY}>
                      {finalCta.secondaryCta}
                    </Link>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm lg:grid-cols-1 lg:text-right">
                  <div>
                    <dt className="text-zinc-600">What is it?</dt>
                    <dd className="font-medium text-zinc-300">{positioning.what}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-600">What can I do?</dt>
                    <dd className="font-medium text-zinc-300">{positioning.canDo}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-600">Why use it?</dt>
                    <dd className="font-medium text-zinc-300">{positioning.why}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-600">Who is it for?</dt>
                    <dd className="font-medium text-zinc-300">{positioning.who}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </AnimatedSection>
        </SectionShell>
      </div>
    </PerfModeProvider>
  )
}
