"use client"

import { PerfModeProvider } from "@/hooks/usePerfMode"
import { useViewport } from "@/hooks/useViewport"
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
import MobileHomePage from "@/components/mobile/MobileHomePage"
import { LANDING_FRAME } from "@/lib/landing-styles"

function DesktopHomePage() {
  return (
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
  )
}

function HomePageFallback() {
  return <div className="min-h-screen bg-black" aria-hidden />
}

export default function HomePage() {
  const { isMobile, ready } = useViewport()

  if (!ready) {
    return <HomePageFallback />
  }

  if (isMobile) {
    return <MobileHomePage />
  }

  return (
    <PerfModeProvider>
      <DesktopHomePage />
    </PerfModeProvider>
  )
}
