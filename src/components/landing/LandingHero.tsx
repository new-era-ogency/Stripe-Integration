"use client"

import Link from "next/link"
import HeroVideoBackground from "@/components/landing/HeroVideoBackground"
import ProductPreviewMockup from "@/components/landing/ProductPreviewMockup"
import AnimatedSection from "@/components/landing/AnimatedSection"
import {
  BODY_TEXT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  HERO_TITLE,
  LANDING_CONTAINER,
  SECTION_LABEL,
} from "@/lib/landing-styles"
import { trustBadges } from "@/lib/landing-content"
import {
  Activity,
  Cpu,
  CreditCard,
  Shield,
  type LucideIcon,
} from "lucide-react"

const trustIconMap: Record<(typeof trustBadges)[number]["icon"], LucideIcon> = {
  "credit-card": CreditCard,
  shield: Shield,
  cpu: Cpu,
  activity: Activity,
}

type LandingHeroProps = {
  activePlatform: "x" | "linkedin" | "telegram"
  onPlatformChange: (platform: "x" | "linkedin" | "telegram") => void
}

export default function LandingHero({
  activePlatform,
  onPlatformChange,
}: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 md:pb-32 md:pt-20 lg:pt-24">
      <HeroVideoBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_55%)]" />
      <div className="hero-orb-a pointer-events-none absolute left-[8%] top-24 size-56 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="hero-orb-b pointer-events-none absolute right-[6%] top-40 size-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className={`${LANDING_CONTAINER} relative z-10`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <AnimatedSection>
            <p className={SECTION_LABEL}>AI Content Repurposing Engine</p>
            <h1 className={`mt-4 ${HERO_TITLE}`}>
              Repurpose YouTube into{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-white bg-clip-text text-transparent">
                viral content
              </span>{" "}
              instantly.
            </h1>
            <p className={`mt-6 ${BODY_TEXT}`}>
              Paste a YouTube link and get platform-native X threads, LinkedIn
              posts, and Telegram drops — engineered for hooks, structure, and
              reach.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#demo" className={BTN_PRIMARY}>
                Explore the Demo
              </a>
              <Link href="/signup" className={BTN_SECONDARY}>
                Start Free Trial
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {trustBadges.map((badge) => {
                const Icon = trustIconMap[badge.icon]
                return (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-sm"
                  >
                    <Icon className="size-3.5 text-violet-400" />
                    {badge.label}
                  </span>
                )
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12} className="lg:translate-y-2">
            <ProductPreviewMockup
              activePlatform={activePlatform}
              onPlatformChange={onPlatformChange}
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
