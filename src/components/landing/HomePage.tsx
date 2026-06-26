"use client"

import { useState } from "react"
import Link from "next/link"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import FaqAccordion from "@/components/landing/FaqAccordion"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import LandingHero from "@/components/landing/LandingHero"
import LandingNav from "@/components/landing/LandingNav"
import ScrollProgress from "@/components/landing/ScrollProgress"
import SocialProofSection from "@/components/landing/SocialProofSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BODY_TEXT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_BASE,
  CARD_HOVER,
  LANDING_CONTAINER,
  LANDING_SECTION,
  SECTION_LABEL,
  SECTION_TITLE,
} from "@/lib/landing-styles"
import {
  collections,
  demoContent,
  exploreLinks,
  styleShowcase,
  testimonials,
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
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <ScrollProgress />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute left-1/2 top-[40%] size-[520px] -translate-x-1/2 rounded-full bg-violet-600/5 blur-3xl" />

      <LandingNav />

      <LandingHero
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
      />

      {/* Collections */}
      <section id="collections" className={LANDING_SECTION}>
        <div className={LANDING_CONTAINER}>
          <AnimatedSection>
            <p className={SECTION_LABEL}>Collections</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              Create your first repurposed post today
            </h2>
            <p className={`mt-4 ${BODY_TEXT}`}>
              Pick a platform or content style to preview what PulseFlow
              generates across X, LinkedIn, and Telegram.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-10" delay={0.08}>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {collections.platforms.map((item, index) => (
                <StaggerItem key={item.id} index={index}>
                  <button
                    type="button"
                    onClick={() => scrollToDemo(item.id as Platform)}
                    className={`${CARD_BASE} ${CARD_HOVER} flex min-h-[48px] items-center gap-2 px-4 py-2.5 text-left`}
                  >
                    <span className="text-sm font-medium text-zinc-200">
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

          <AnimatedSection className="mt-8" delay={0.12}>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Content Styles
            </p>
            <div className="flex flex-wrap gap-2">
              {collections.styles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveStyle(item.label)
                    scrollToDemo()
                  }}
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-250 ${
                    activeStyle === item.label
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <FeaturesSection />

      {/* Use cases */}
      <section id="use-cases" className={LANDING_SECTION}>
        <div className={LANDING_CONTAINER}>
          <AnimatedSection className="text-center">
            <p className={SECTION_LABEL}>Use Cases</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              Unlimited reach for everyone, everywhere
            </h2>
            <p className={`mx-auto mt-4 ${BODY_TEXT}`}>
              Whether you&apos;re a solo creator, growth team, or educator —
              turn long-form video into platform-native content.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {useCases.map((item, index) => (
              <StaggerItem key={item.title} index={index}>
                <div className={`h-full ${CARD_BASE} ${CARD_HOVER} p-8`}>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] font-medium text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Styles */}
      <section id="styles" className={LANDING_SECTION}>
        <div className={LANDING_CONTAINER}>
          <AnimatedSection>
            <p className={SECTION_LABEL}>Styles</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              Skip the blank page — pick a preset
            </h2>
            <p className={`mt-4 ${BODY_TEXT}`}>
              Tone and format presets tailored for every vibe. Select on the
              dashboard before you generate.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {styleShowcase.map((style, index) => (
              <StaggerItem key={style.name} index={index}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStyle(style.name)
                    scrollToDemo()
                  }}
                  className={`flex w-full min-h-[56px] items-center justify-between ${CARD_BASE} ${CARD_HOVER} px-4 py-3 text-left`}
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      {style.category}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-zinc-200">
                      {style.name}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-600">Preset</span>
                </button>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section id="demo" className={LANDING_SECTION}>
        <div className={`${LANDING_CONTAINER} max-w-4xl`}>
          <AnimatedSection className="text-center">
            <p className={SECTION_LABEL}>Live Preview</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              See the output before you sign up
            </h2>
            {activeStyle ? (
              <p className="mt-3 text-sm text-zinc-500">
                Previewing style:{" "}
                <span className="font-medium text-zinc-300">{activeStyle}</span>
              </p>
            ) : null}
          </AnimatedSection>

          <AnimatedSection className="mt-10" delay={0.1}>
            <div className="rounded-2xl border border-violet-500/15 bg-zinc-950/70 p-6 shadow-[0_0_80px_-20px_rgba(139,92,246,0.35)] backdrop-blur-xl md:p-8">
              <div className="mb-6 space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  YouTube URL
                </label>
                <div className="flex h-12 items-center rounded-xl border border-zinc-800 bg-black/60 px-4 font-mono text-sm text-zinc-400">
                  https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </div>
              </div>

              <Tabs
                value={activePlatform}
                onValueChange={(value) => setActivePlatform(value as Platform)}
                className="w-full"
              >
                <TabsList className="grid h-11 w-full grid-cols-3 border border-zinc-800 bg-zinc-900/80 p-1">
                  {(["x", "linkedin", "telegram"] as const).map((platform) => (
                    <TabsTrigger
                      key={platform}
                      value={platform}
                      className="rounded-lg text-xs font-medium uppercase tracking-wider text-zinc-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                    >
                      {platform === "x" ? "X" : platform}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(["x", "linkedin", "telegram"] as const).map((platform) => (
                  <TabsContent key={platform} value={platform} className="mt-4">
                    <div className="min-h-[240px] whitespace-pre-line rounded-xl border border-zinc-800 bg-black/50 p-5 text-left text-sm leading-relaxed text-zinc-300">
                      {demoContent[platform]}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-8 text-center" delay={0.15}>
            <Link href="/signup" className={BTN_PRIMARY}>
              Generate Your Own — Free
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <HowItWorksSection />
      <SocialProofSection />

      {/* Testimonials */}
      <section className={LANDING_SECTION}>
        <div className={LANDING_CONTAINER}>
          <AnimatedSection className="text-center">
            <p className={SECTION_LABEL}>Testimonials</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              Trusted by creators who ship daily
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((item, index) => (
              <StaggerItem key={item.author} index={index}>
                <blockquote className={`h-full ${CARD_BASE} ${CARD_HOVER} p-8`}>
                  <p className="text-base leading-relaxed text-zinc-300">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <footer className="mt-5 border-t border-zinc-800/80 pt-4">
                    <p className="text-sm font-medium text-white">
                      {item.author}
                    </p>
                    <p className="text-xs text-zinc-500">{item.role}</p>
                  </footer>
                </blockquote>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className={LANDING_SECTION}>
        <div className={LANDING_CONTAINER}>
          <AnimatedSection className="text-center">
            <p className={SECTION_LABEL}>Explore</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              Everything you need to start
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {exploreLinks.map((link, index) => (
              <StaggerItem key={link.href} index={index}>
                <Link
                  href={link.href}
                  className={`block h-full ${CARD_BASE} ${CARD_HOVER} p-6`}
                >
                  <h3 className="text-sm font-semibold text-white">
                    {link.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {link.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-violet-300">
                    Open →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      <FaqAccordion />

      {/* Final CTA */}
      <section className={`${LANDING_SECTION} pb-32`}>
        <div className={`${LANDING_CONTAINER} text-center`}>
          <AnimatedSection>
            <p className={SECTION_LABEL}>Get Started</p>
            <h2 className={`mt-3 ${SECTION_TITLE}`}>
              Starting with PulseFlow is easy, fast, and free
            </h2>
            <p className={`mx-auto mt-4 ${BODY_TEXT}`}>
              Turn your next YouTube upload into a week of social content. Create
              a free account and generate your first outputs in under a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={BTN_PRIMARY}>
                Create Free Account
              </Link>
              <Link href="/pricing" className={BTN_SECONDARY}>
                View Pro Plans
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
