"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroVideoBackground from "@/components/landing/HeroVideoBackground"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import AnimatedSection from "@/components/landing/AnimatedSection"
import {
  ACCENT_TEXT,
  BODY_TEXT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  HERO_TITLE,
  LANDING_CONTAINER,
} from "@/lib/landing-styles"
import { heroCopy } from "@/lib/landing-content"

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20">
      <HeroVideoBackground />

      <div className={`${LANDING_CONTAINER} relative z-10`}>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <AnimatedSection>
            <h1 className={HERO_TITLE}>
              {heroCopy.title}
              <br />
              <span className={ACCENT_TEXT}>{heroCopy.titleAccent}</span>
            </h1>

            <p className={`mt-7 ${BODY_TEXT}`}>{heroCopy.subtitle}</p>
            <p className={`mt-4 ${BODY_TEXT}`}>{heroCopy.supportingLine}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className={`group ${BTN_PRIMARY}`}>
                {heroCopy.primaryCta}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#product" className={BTN_SECONDARY}>
                {heroCopy.secondaryCta}
              </a>
            </div>

            <p className="mt-10 text-sm text-zinc-500">{heroCopy.trustLine}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="landing-product-glow relative lg:translate-y-4">
              <DashboardScreenshot compact showAnnotations highlight />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
