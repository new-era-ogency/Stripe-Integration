"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroVideoBackground from "@/components/landing/HeroVideoBackground"
import DemoPreview from "@/components/sections/demo-preview"
import AnimatedSection from "@/components/landing/AnimatedSection"
import {
  ACCENT_TEXT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  HERO_BADGE_PILL,
  HERO_BYOK_BADGE,
  HERO_MICRO_TRUST,
  HERO_SECTION,
  HERO_SUBTEXT,
  HERO_TITLE,
  LANDING_CONTAINER,
  LANDING_GRID,
} from "@/lib/landing-styles"
import { corePromise, heroCopy } from "@/lib/landing-content"

export default function LandingHero() {
  return (
    <section id="demo" className={HERO_SECTION}>
      <HeroVideoBackground />

      <div className={`${LANDING_CONTAINER} relative z-10 w-full`}>
        <div className={`${LANDING_GRID} items-center gap-y-10`}>
          <AnimatedSection className="col-span-12 flex flex-col lg:col-span-5">
            <span className={HERO_BADGE_PILL}>{heroCopy.badge}</span>

            <span className={`mt-3 ${HERO_BYOK_BADGE}`}>
              {heroCopy.byokBadge}
            </span>

            <h1 className={`mt-6 ${HERO_TITLE}`}>
              {heroCopy.title}
              <br />
              <span className={ACCENT_TEXT}>{heroCopy.titleAccent}</span>
            </h1>

            <p className={`mt-6 ${HERO_SUBTEXT}`}>{heroCopy.subtitle}</p>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
              {corePromise.headline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/dashboard" className={`group ${BTN_PRIMARY}`}>
                {heroCopy.primaryCta}
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a href="#trial-demo" className={BTN_SECONDARY}>
                {heroCopy.secondaryCta}
              </a>
            </div>

            <p className={`mt-6 ${HERO_MICRO_TRUST}`}>{heroCopy.microTrust}</p>
          </AnimatedSection>

          <AnimatedSection
            delay={0.08}
            className="col-span-12 lg:col-span-7"
          >
            <div className="landing-product-glow relative">
              <DemoPreview id="trial-demo" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
