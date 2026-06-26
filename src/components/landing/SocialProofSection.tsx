"use client"

import { Star } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import CountUp from "@/components/landing/CountUp"
import InteractiveCard from "@/components/landing/InteractiveCard"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  CARD_BASE,
  CARD_HOVER,
  SECTION_CONTENT_GAP,
  SECTION_HEADER_CENTERED,
} from "@/lib/landing-styles"
import { companyLogos, socialProofStats, testimonials } from "@/lib/landing-content"

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star
          key={index}
          className="size-3.5 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  )
}

export default function SocialProofSection() {
  const featured = testimonials.find((item) => item.highlight) ?? testimonials[0]
  const supporting = testimonials.filter((item) => !item.highlight)

  return (
    <SectionShell id="testimonials" tone="accent">
      <AnimatedSection className={SECTION_HEADER_CENTERED}>
        <SectionHeader
          centered
          label="Social Proof"
          title="Loved by creators shipping daily"
          description={
            <>
              <span className="font-semibold text-white">4.9/5</span> average from
              240+ reviews · secure Stripe billing · 99.9% uptime
            </>
          }
        />
      </AnimatedSection>

      <div className={`grid grid-cols-2 gap-8 md:grid-cols-4 ${SECTION_CONTENT_GAP}`}>
        {socialProofStats.map((stat, index) => (
          <StaggerItem key={stat.label} index={index} className="text-center">
            <p className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              <CountUp value={stat.value} />
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              {stat.label}
            </p>
          </StaggerItem>
        ))}
      </div>

      <AnimatedSection className={`${SECTION_CONTENT_GAP} max-w-4xl md:mx-auto`} delay={0.08}>
        <blockquote
          className={`relative ${CARD_BASE} border-violet-500/20 p-8 md:p-10`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-violet-500/10 blur-3xl" />
          <StarRating count={featured.rating} />
          <p className="mt-5 text-lg leading-relaxed text-zinc-200 md:text-xl md:leading-8">
            &ldquo;{featured.quote}&rdquo;
          </p>
          <footer className="mt-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/20 text-sm font-semibold text-violet-100">
              {featured.initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{featured.author}</p>
              <p className="text-xs text-zinc-500">{featured.role}</p>
            </div>
          </footer>
        </blockquote>
      </AnimatedSection>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {supporting.map((item, index) => (
          <StaggerItem key={item.author} index={index}>
            <InteractiveCard
              as="blockquote"
              className={`h-full ${CARD_BASE} ${CARD_HOVER} p-6 md:p-7`}
            >
              <StarRating count={item.rating} />
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-5 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-300">
                  {item.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.author}</p>
                  <p className="text-xs text-zinc-500">{item.role}</p>
                </div>
              </footer>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </div>

      <AnimatedSection className={SECTION_CONTENT_GAP} delay={0.1}>
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.35em] text-zinc-600">
          Trusted by teams at
        </p>
        <div className="logo-marquee relative overflow-hidden">
          <div className="logo-marquee-track flex w-max items-center gap-4">
            {[...companyLogos, ...companyLogos].map((logo, index) => (
              <span
                key={`${logo}-${index}`}
                className="inline-flex rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-5 py-2.5 text-sm font-medium text-zinc-500 backdrop-blur-sm transition-colors hover:border-zinc-700 hover:text-zinc-300"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </SectionShell>
  )
}
