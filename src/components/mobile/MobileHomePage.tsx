"use client"

import { PerfModeProvider } from "@/hooks/usePerfMode"
import ByokLandingBanner from "@/components/marketing/ByokLandingBanner"
import FaqAccordion from "@/components/landing/FaqAccordion"
import LaunchBetaSection from "@/components/landing/LaunchBetaSection"
import PricingAnchorSection from "@/components/landing/PricingAnchorSection"
import MobileFeaturesSection from "@/components/mobile/MobileFeaturesSection"
import MobileLandingHero from "@/components/mobile/MobileLandingHero"
import MobileLandingNav from "@/components/mobile/MobileLandingNav"
import { LANDING_FRAME } from "@/lib/landing-styles"

export default function MobileHomePage() {
  return (
    <PerfModeProvider>
      <div className={`${LANDING_FRAME} mobile-safe-bottom min-h-screen bg-black text-white`}>
        <MobileLandingNav />
        <ByokLandingBanner />
        <MobileLandingHero />
        <MobileFeaturesSection />
        <PricingAnchorSection />
        <FaqAccordion />
        <LaunchBetaSection />
      </div>
    </PerfModeProvider>
  )
}
