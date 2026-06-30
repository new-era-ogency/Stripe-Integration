"use client"

import { PerfModeProvider } from "@/hooks/usePerfMode"
import AiMeetingsSection from "@/components/landing/AiMeetingsSection"
import CoreFeaturesSection from "@/components/landing/CoreFeaturesSection"
import FaqAccordion from "@/components/landing/FaqAccordion"
import InteractiveDemoSection from "@/components/landing/InteractiveDemoSection"
import LandingHero from "@/components/landing/LandingHero"
import LandingNav from "@/components/landing/LandingNav"
import LaunchBetaSection from "@/components/landing/LaunchBetaSection"
import ByokLandingBanner from "@/components/marketing/ByokLandingBanner"
import PricingAnchorSection from "@/components/landing/PricingAnchorSection"
import ProblemSection from "@/components/landing/ProblemSection"
import ProofSection from "@/components/landing/ProofSection"
import PublicRoadmapSection from "@/components/landing/PublicRoadmapSection"
import SolutionSection from "@/components/landing/SolutionSection"
import { LANDING_FRAME } from "@/lib/landing-styles"

export default function HomePage() {
  return (
    <PerfModeProvider>
      <div className={`${LANDING_FRAME} min-h-screen bg-black text-white`}>
        <LandingNav />
        <ByokLandingBanner />
        <LandingHero />
        <InteractiveDemoSection />
        <ProblemSection />
        <SolutionSection />
        <CoreFeaturesSection />
        <AiMeetingsSection />
        <ProofSection />
        <PricingAnchorSection />
        <PublicRoadmapSection />
        <FaqAccordion />
        <LaunchBetaSection />
      </div>
    </PerfModeProvider>
  )
}
