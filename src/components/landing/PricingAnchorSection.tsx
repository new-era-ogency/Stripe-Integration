"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { BTN_PRIMARY, BTN_SECONDARY, CARD_BASE } from "@/lib/landing-styles"
import { ctaStrategy, pricingAnchors, pricingSection } from "@/lib/landing-content"

function planHref(planName: string): string {
  if (planName === "Early access") {
    return ctaStrategy.secondary.href
  }

  if (planName === "AI usage") {
    return "/guide/openrouter-key"
  }

  return ctaStrategy.pricing.href
}

export default function PricingAnchorSection() {
  return (
    <SectionShell id="pricing" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="Pricing"
          title="Start free. Pay for AI only when you generate."
          description={pricingSection.description}
          centered
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:items-stretch">
          {pricingAnchors.map((plan, index) => (
            <StaggerItem key={plan.name} index={index}>
              <article
                className={`relative flex h-full flex-col rounded-2xl p-6 md:p-8 ${CARD_BASE} ${
                  plan.highlighted
                    ? "border-emerald-500/25 bg-gradient-to-b from-emerald-500/[0.06] to-zinc-950/80 shadow-[0_24px_64px_-32px_rgba(52,211,153,0.35)]"
                    : "bg-zinc-950/70"
                }`}
              >
                <div className="mb-5 flex min-h-7 items-center">
                  {"badge" in plan && plan.badge ? (
                    <span className="inline-flex w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                <p className="text-sm font-medium text-zinc-400">{plan.name}</p>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  {plan.period ? (
                    <span className="text-sm font-medium text-zinc-500">
                      {plan.period}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-500">
                  {plan.description}
                </p>

                <Link
                  href={planHref(plan.name)}
                  className={`mt-8 w-full ${
                    plan.highlighted ? BTN_PRIMARY : BTN_SECONDARY
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </div>

        <AnimatedSection className="mt-12 border-t border-zinc-800/70 pt-10 text-center">
          <p className="text-sm text-zinc-500">Want a guided walkthrough?</p>
          <a
            href={ctaStrategy.footer.href}
            className={`mt-4 inline-flex ${BTN_SECONDARY}`}
          >
            <Calendar className="mr-2 size-4" />
            {ctaStrategy.footer.label}
          </a>
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
