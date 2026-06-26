"use client"

import Link from "next/link"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { BTN_SECONDARY, CARD_BASE } from "@/lib/landing-styles"
import { pricingAnchors } from "@/lib/landing-content"

export default function PricingAnchorSection() {
  return (
    <SectionShell id="pricing">
      <AnimatedSection>
        <SectionHeader
          label="Pricing"
          title="Simple plans — start free, scale when ready"
          description="Anchor pricing so you know what you're getting into. Full details on the pricing page."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-3">
          {pricingAnchors.map((plan, index) => (
            <StaggerItem key={plan.name} index={index}>
              <article
                className={`flex h-full flex-col ${CARD_BASE} p-6 md:p-7 ${
                  plan.highlighted
                    ? "border-violet-500/30 bg-gradient-to-b from-violet-500/[0.08] to-zinc-950"
                    : ""
                }`}
              >
                <p className="text-sm font-semibold text-zinc-400">{plan.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {plan.price}
                  {plan.period ? (
                    <span className="text-base font-normal text-zinc-500">
                      {plan.period}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                  {plan.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </div>

        <AnimatedSection className="mt-8 text-center">
          <Link href="/pricing" className={`inline-flex ${BTN_SECONDARY}`}>
            See full pricing & features
          </Link>
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
