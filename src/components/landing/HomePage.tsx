"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PerfModeProvider } from "@/hooks/usePerfMode"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import ChangelogSection from "@/components/landing/ChangelogSection"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import FaqAccordion from "@/components/landing/FaqAccordion"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import LandingHero from "@/components/landing/LandingHero"
import LandingMarquee from "@/components/landing/LandingMarquee"
import LandingNav from "@/components/landing/LandingNav"
import ProductWalkthroughSection from "@/components/landing/ProductWalkthroughSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import SocialProofSection from "@/components/landing/SocialProofSection"
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  BODY_TEXT,
  CARD_BASE,
  CARD_HOVER,
  SECTION_CONTENT_GAP,
} from "@/lib/landing-styles"
import { finalCta, useCases } from "@/lib/landing-content"

type Platform = "x" | "linkedin" | "telegram"

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("x")

  return (
    <PerfModeProvider>
      <div className="min-h-screen bg-black text-white">
        <LandingNav />
        <LandingHero />
        <LandingMarquee />

        <ProductWalkthroughSection />
        <FeaturesSection />
        <HowItWorksSection />

        <SectionShell id="demo" tone="accent">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection>
              <SectionHeader
                label="Sample output"
                title="Read a draft before you sign up"
                description="Switch tabs to see how the same transcript becomes three different posts."
              />
              <p className={`mt-6 ${BODY_TEXT}`}>
                No account needed to read these. When you&apos;re ready, paste your
                own link on the dashboard.
              </p>
              <Link
                href="/signup"
                className={`group mt-8 inline-flex ${BTN_PRIMARY}`}
              >
                Try your own video
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="landing-product-glow">
                <DashboardScreenshot
                  activePlatform={activePlatform}
                  onPlatformChange={setActivePlatform}
                  showAnnotations={false}
                  highlight
                />
              </div>
            </AnimatedSection>
          </div>
        </SectionShell>

        <SectionShell tone="elevated">
          <AnimatedSection>
            <SectionHeader
              label="Who it's for"
              title="Different people, same problem: the video is done but the posts aren't"
            />
          </AnimatedSection>

          <SectionHeaderSpacer>
            <div className={`space-y-4 ${SECTION_CONTENT_GAP}`}>
              {useCases.map((item, index) => (
                <StaggerItem key={item.title} index={index}>
                  <article
                    className={`${CARD_BASE} ${CARD_HOVER} grid gap-6 p-6 md:grid-cols-[14rem_1fr] md:gap-10 md:p-8 ${
                      index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      <span className="text-4xl font-bold text-violet-500/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <div>
                      <p className="text-base leading-relaxed text-zinc-400">
                        {item.description}
                      </p>
                      <p className="mt-4 border-l-2 border-violet-500/30 pl-4 text-sm italic text-zinc-500">
                        {item.example}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </div>
          </SectionHeaderSpacer>
        </SectionShell>

        <SocialProofSection />
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
                  <Link href="/signup" className={BTN_PRIMARY}>
                    Create free account
                  </Link>
                  <Link href="/pricing" className={BTN_SECONDARY}>
                    View plans
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
