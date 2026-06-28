"use client"

import { PerfModeProvider } from "@/hooks/usePerfMode"
import ChangelogSection from "@/components/landing/ChangelogSection"
import CredibilitySection from "@/components/landing/CredibilitySection"
import FaqAccordion from "@/components/landing/FaqAccordion"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import LandingHero from "@/components/landing/LandingHero"
import LandingNav from "@/components/landing/LandingNav"
import LaunchBetaSection from "@/components/landing/LaunchBetaSection"
import ByokLandingBanner from "@/components/marketing/ByokLandingBanner"
import RealWorkflowsSection from "@/components/landing/RealWorkflowsSection"
import { LANDING_FRAME } from "@/lib/landing-styles"

export default function HomePage() {
  return (
    <PerfModeProvider>
      <div className={`${LANDING_FRAME} min-h-screen bg-black text-white`}>
        <LandingNav />
        <ByokLandingBanner />
        <LandingHero />
        <RealWorkflowsSection />
        <HowItWorksSection />
        <CredibilitySection />
        <ChangelogSection />
        <FaqAccordion />
        <LaunchBetaSection />
      </div>
    </PerfModeProvider>
  )
}
