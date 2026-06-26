"use client"

import { useEffect, useRef, useState } from "react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import {
  BODY_TEXT,
  CARD_BASE,
  CARD_HOVER,
  LANDING_CONTAINER,
  LANDING_SECTION,
  SECTION_LABEL,
  SECTION_TITLE,
} from "@/lib/landing-styles"
import { companyLogos, socialProofStats } from "@/lib/landing-content"

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <p className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>
    </div>
  )
}

export default function SocialProofSection() {
  return (
    <section id="testimonials" className={LANDING_SECTION}>
      <div className={LANDING_CONTAINER}>
        <AnimatedSection className="text-center">
          <p className={SECTION_LABEL}>Social Proof</p>
          <h2 className={`mt-3 ${SECTION_TITLE}`}>
            Trusted by creators and growth teams
          </h2>
          <p className={`mx-auto mt-4 ${BODY_TEXT}`}>
            PulseFlow powers daily publishing workflows with secure Stripe
            billing, reliable infrastructure, and multi-platform output.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {socialProofStats.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        <AnimatedSection className="mt-14">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-zinc-600">
            Used by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {companyLogos.map((logo, index) => (
              <StaggerItem key={logo} index={index}>
                <span className="inline-flex rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-2 text-sm font-medium text-zinc-500 backdrop-blur-sm">
                  {logo}
                </span>
              </StaggerItem>
            ))}
          </div>
        </AnimatedSection>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {[
            "4.9/5 creator rating",
            "Stripe-powered billing",
            "SOC2-ready infrastructure",
          ].map((badge) => (
            <span
              key={badge}
              className={`${CARD_BASE} px-4 py-2 text-xs text-zinc-400 ${CARD_HOVER}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
