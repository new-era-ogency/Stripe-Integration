"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PerfModeProvider } from "@/hooks/usePerfMode"
import AnimatedSection from "@/components/landing/AnimatedSection"
import ChangelogSection from "@/components/landing/ChangelogSection"
import CredibilitySection from "@/components/landing/CredibilitySection"
import FaqAccordion from "@/components/landing/FaqAccordion"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import InteractiveDemo from "@/components/landing/InteractiveDemo"
import LandingHero from "@/components/landing/LandingHero"
import LandingNav from "@/components/landing/LandingNav"
import LaunchBetaSection from "@/components/landing/LaunchBetaSection"
import PricingAnchorSection from "@/components/landing/PricingAnchorSection"
import RealWorkflowsSection from "@/components/landing/RealWorkflowsSection"
import { LANDING_FRAME } from "@/lib/landing-styles"
import { corePromise } from "@/lib/landing-content"

export default function HomePage() {
  return (
    <PerfModeProvider>
      <div className={`${LANDING_FRAME} min-h-screen bg-black text-white`}>
        <LandingNav />
        <LandingHero />

        <div className="border-b border-zinc-900/80 bg-zinc-950/40 py-4">
          <p className="mx-auto max-w-[1200px] px-6 text-center text-sm font-medium text-zinc-400 sm:px-8 xl:px-[120px]">
            <span className="text-violet-400">Core promise:</span>{" "}
            {corePromise.headline}{" "}
            <span className="hidden text-zinc-600 sm:inline">
              — {corePromise.proofPoint}
            </span>
          </p>
        </div>

        <InteractiveDemo />
        <RealWorkflowsSection />
        <HowItWorksSection />
        <CredibilitySection />
        <PricingAnchorSection />
        <ChangelogSection />
        <FaqAccordion />
        <LaunchBetaSection />
      </div>
    </PerfModeProvider>
  )
}
