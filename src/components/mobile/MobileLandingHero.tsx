"use client"

import { MonitorSmartphone } from "lucide-react"
import DashboardCtaLink from "@/components/marketing/DashboardCtaLink"
import {
  BTN_SECONDARY,
  HERO_BADGE_PILL,
  HERO_BYOK_BADGE,
} from "@/lib/landing-styles"
import { brandIdentity, ctaStrategy, heroCopy } from "@/lib/landing-content"

export default function MobileLandingHero() {
  return (
    <section id="hero" className="scroll-mt-20 px-4 pb-10 pt-8">
      <span className={HERO_BADGE_PILL}>{heroCopy.badge}</span>
      <span className={`mt-3 inline-flex ${HERO_BYOK_BADGE}`}>
        {heroCopy.byokBadge}
      </span>

      <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white">
        {heroCopy.title}
        <br />
        <span className="text-violet-400">{heroCopy.titleAccent}</span>
      </h1>

      <p className="mt-4 text-base leading-relaxed text-zinc-400">
        {brandIdentity.supportLine}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <DashboardCtaLink variant="primary" label={heroCopy.primaryCta} />
        <a href={ctaStrategy.primary.href} className={BTN_SECONDARY}>
          {heroCopy.secondaryCta}
        </a>
      </div>

      <p className="mt-5 text-sm text-zinc-500">{heroCopy.microTrust}</p>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="flex items-start gap-3">
          <MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-violet-400" />
          <p className="text-sm leading-relaxed text-zinc-400">
            The full interactive workspace demo is optimized for larger screens.
            On mobile you can sign in, generate content, and manage history from
            the dashboard.
          </p>
        </div>
      </div>
    </section>
  )
}
