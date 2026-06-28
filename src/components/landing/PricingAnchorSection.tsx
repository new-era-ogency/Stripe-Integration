"use client"

import Link from "next/link"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { BTN_PRIMARY, BTN_SECONDARY, CARD_INTERACTIVE } from "@/lib/landing-styles"
import { pricingAnchors } from "@/lib/landing-content"

export default function PricingAnchorSection() {
  return (
    <SectionShell id="pricing" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="BYOK pricing"
          title="Free dashboard. Pay OpenAI, not us."
          description="PulseFlow never marks up your AI usage. Connect your OpenAI key once and pay only OpenAI's per-request rates."
          centered
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          {pricingAnchors.map((plan, index) => (
            <StaggerItem key={plan.name} index={index}>
              <article
                className={`relative flex h-full flex-col ${CARD_INTERACTIVE} p-6 md:p-7 ${
                  plan.highlighted
                    ? "border-emerald-500/30 bg-zinc-900/80 md:-translate-y-2 md:shadow-[0_20px_60px_-24px_rgba(52,211,153,0.2)]"
                    : ""
                }`}
              >
                {"badge" in plan && plan.badge ? (
                  <span className="mb-4 inline-flex w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    {plan.badge}
                  </span>
                ) : (
                  <span className="mb-4 block h-5" aria-hidden />
                )}
                <p className="text-sm font-semibold text-zinc-400">{plan.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {plan.price}
                  {plan.period ? (
                    <span className="text-base font-normal text-zinc-500">
                      {plan.period}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-500">
                  {plan.description}
                </p>
                <Link
                  href={plan.name === "OpenAI usage" ? "/dashboard#settings" : "/dashboard"}
                  className={`mt-6 inline-flex justify-center ${
                    plan.highlighted ? BTN_PRIMARY : BTN_SECONDARY
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </div>

        <AnimatedSection className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Typical generation: ~$0.003–$0.02 billed directly to your OpenAI account.
          </p>
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
