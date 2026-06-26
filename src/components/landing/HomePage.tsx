"use client"

import { useState } from "react"
import Link from "next/link"
import { PerfModeProvider } from "@/hooks/usePerfMode"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import FaqAccordion from "@/components/landing/FaqAccordion"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import InteractiveCard from "@/components/landing/InteractiveCard"
import LandingHero from "@/components/landing/LandingHero"
import LandingNav from "@/components/landing/LandingNav"
import ProductPreviewMockup from "@/components/landing/ProductPreviewMockup"
import ScrollProgress from "@/components/landing/ScrollProgress"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import SocialProofSection from "@/components/landing/SocialProofSection"
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_BASE,
  CARD_HOVER,
  CHIP_INTERACTIVE,
  SECTION_CONTENT_GAP,
  SECTION_HEADER_CENTERED,
} from "@/lib/landing-styles"
import {
  collections,
  exploreLinks,
  styleShowcase,
  useCases,
} from "@/lib/landing-content"

type Platform = "x" | "linkedin" | "telegram"

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("x")
  const [activeStyle, setActiveStyle] = useState<string | null>(null)

  const scrollToDemo = (platform?: Platform) => {
    if (platform) {
      setActivePlatform(platform)
    }
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <PerfModeProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
        <ScrollProgress />
        <div className="page-grid-bg pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <LandingNav />

      <LandingHero
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
      />

      <SectionShell id="collections" tone="default">
        <AnimatedSection>
          <SectionHeader
            label="Collections"
            title="Create your first repurposed post today"
            description="Pick a platform or content style to preview what PulseFlow generates across X, LinkedIn, and Telegram."
          />
        </AnimatedSection>

        <SectionHeaderSpacer>
          <AnimatedSection delay={0.06}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Platforms
            </p>
            <div className="flex flex-wrap gap-3">
              {collections.platforms.map((item, index) => (
                <StaggerItem key={item.id} index={index}>
                  <button
                    type="button"
                    onClick={() => scrollToDemo(item.id as Platform)}
                    className={`${CARD_BASE} ${CARD_HOVER} flex min-h-[52px] items-center gap-3 px-5 py-3 text-left`}
                  >
                    <span className="text-sm font-semibold text-zinc-100">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {item.tag}
                    </span>
                  </button>
                </StaggerItem>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-10" delay={0.1}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Content Styles
            </p>
            <div className="flex flex-wrap gap-2.5">
              {collections.styles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveStyle(item.label)
                    scrollToDemo()
                  }}
                  className={`min-h-[48px] rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    activeStyle === item.label
                      ? "border-violet-500/45 bg-violet-500/12 text-violet-100 shadow-[0_8px_24px_-12px_rgba(139,92,246,0.45)]"
                      : `border-zinc-800/90 bg-zinc-950/60 text-zinc-500 ${CHIP_INTERACTIVE}`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </SectionHeaderSpacer>
      </SectionShell>

      <FeaturesSection />

      <SectionShell id="use-cases" tone="accent">
        <AnimatedSection className={SECTION_HEADER_CENTERED}>
          <SectionHeader
            centered
            label="Use Cases"
            title="Unlimited reach for everyone, everywhere"
            description="Whether you're a solo creator, growth team, or educator — turn long-form video into platform-native content."
          />
        </AnimatedSection>

        <SectionHeaderSpacer>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8">
            {useCases.map((item, index) => (
              <StaggerItem key={item.title} index={index}>
                <InteractiveCard
                  className={`h-full ${CARD_BASE} ${CARD_HOVER} p-8 md:p-9`}
                >
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </div>
        </SectionHeaderSpacer>
      </SectionShell>

      <SectionShell id="styles" tone="default">
        <AnimatedSection>
          <SectionHeader
            label="Styles"
            title="Skip the blank page — pick a preset"
            description="Tone and format presets tailored for every vibe. Select on the dashboard before you generate."
          />
        </AnimatedSection>

        <SectionHeaderSpacer>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {styleShowcase.map((style, index) => (
              <StaggerItem key={style.name} index={index}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStyle(style.name)
                    scrollToDemo()
                  }}
                  className={`flex w-full min-h-[60px] items-center justify-between ${CARD_BASE} ${CARD_HOVER} px-5 py-4 text-left`}
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {style.category}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">
                      {style.name}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-zinc-600">
                    Preset
                  </span>
                </button>
              </StaggerItem>
            ))}
          </div>
        </SectionHeaderSpacer>
      </SectionShell>

      <SectionShell id="demo" tone="spotlight" className="!pb-28 md:!pb-32">
        <AnimatedSection className={SECTION_HEADER_CENTERED}>
          <SectionHeader
            centered
            label="Live Preview"
            title="See the output before you sign up"
            description={
              activeStyle
                ? `Previewing style: ${activeStyle}`
                : "Explore real sample outputs across X, LinkedIn, and Telegram — no account required."
            }
          />
        </AnimatedSection>

        <SectionHeaderSpacer>
          <AnimatedSection delay={0.1} className="mx-auto max-w-3xl">
            <ProductPreviewMockup
              activePlatform={activePlatform}
              onPlatformChange={setActivePlatform}
            />
          </AnimatedSection>

          <AnimatedSection className="mt-10 text-center" delay={0.16}>
            <Link href="/signup" className={BTN_PRIMARY}>
              Generate Your Own — Free
            </Link>
          </AnimatedSection>
        </SectionHeaderSpacer>
      </SectionShell>

      <HowItWorksSection />
      <SocialProofSection />

      <SectionShell tone="default">
        <AnimatedSection className={SECTION_HEADER_CENTERED}>
          <SectionHeader
            centered
            label="Explore"
            title="Everything you need to start"
          />
        </AnimatedSection>

        <SectionHeaderSpacer>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {exploreLinks.map((link, index) => (
              <StaggerItem key={link.href} index={index}>
                <Link href={link.href} className="block h-full">
                  <InteractiveCard
                    className={`h-full ${CARD_BASE} ${CARD_HOVER} p-7`}
                  >
                    <h3 className="text-base font-bold text-white">
                      {link.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {link.description}
                    </p>
                    <span className="mt-5 inline-block text-sm font-semibold text-violet-300 transition-colors group-hover:text-white">
                      Open →
                    </span>
                  </InteractiveCard>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </SectionHeaderSpacer>
      </SectionShell>

      <FaqAccordion />

      <SectionShell tone="spotlight" divider={false} className="!pb-36 md:!pb-44">
        <AnimatedSection className={SECTION_HEADER_CENTERED}>
          <SectionHeader
            centered
            label="Get Started"
            title="Starting with PulseFlow is easy, fast, and free"
            description="Turn your next YouTube upload into a week of social content. Create a free account and generate your first outputs in under a minute."
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link href="/signup" className={BTN_PRIMARY}>
              Create Free Account
            </Link>
            <Link href="/pricing" className={BTN_SECONDARY}>
              View Pro Plans
            </Link>
          </div>
        </AnimatedSection>
      </SectionShell>
    </div>
    </PerfModeProvider>
  )
}
