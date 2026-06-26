"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import HeroVideoBackground from "@/components/landing/HeroVideoBackground"
import WorkflowBuilderScreenshot from "@/components/landing/WorkflowBuilderScreenshot"
import AnimatedSection from "@/components/landing/AnimatedSection"
import {
  ACCENT_TEXT,
  BODY_TEXT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  HERO_SECTION,
  HERO_TITLE,
  LANDING_CONTAINER,
  SECTION_LABEL,
} from "@/lib/landing-styles"
import { heroCopy } from "@/lib/landing-content"

export default function LandingHero() {
  return (
    <section className={HERO_SECTION}>
      <HeroVideoBackground />

      <div className={`${LANDING_CONTAINER} relative z-10`}>
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 xl:gap-24">
          <AnimatedSection className="max-w-xl lg:max-w-none">
            <p className={SECTION_LABEL}>
              <span className="size-1.5 rounded-full bg-violet-400" />
              {heroCopy.label}
            </p>

            <h1 className={`mt-8 ${HERO_TITLE}`}>
              {heroCopy.title}
              <br />
              <span className={ACCENT_TEXT}>{heroCopy.titleAccent}</span>
            </h1>

            <p className={`mt-8 ${BODY_TEXT}`}>{heroCopy.subtitle}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className={`group ${BTN_PRIMARY}`}>
                {heroCopy.primaryCta}
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a href="#product" className={BTN_SECONDARY}>
                {heroCopy.secondaryCta}
              </a>
            </div>

            <ul className="mt-10 flex flex-col gap-2.5 sm:flex-row sm:gap-6">
              {heroCopy.trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-2 text-sm text-zinc-500"
                >
                  <Check className="size-3.5 shrink-0 text-emerald-500/80" />
                  {badge}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="landing-product-glow relative lg:translate-y-2">
              <WorkflowBuilderScreenshot animated highlight />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
