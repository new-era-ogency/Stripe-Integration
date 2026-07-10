"use client"

import { ArrowRight } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import SectionDashboardCta from "@/components/marketing/SectionDashboardCta"
import { ACCENT_TEXT, CARD_INTERACTIVE } from "@/lib/landing-styles"
import { coreFeatures } from "@/lib/landing-content"
import { navigateToDemoTab } from "@/lib/demo-navigation"

export default function CoreFeaturesSection() {
  return (
    <SectionShell id="features" tone="spotlight">
      <AnimatedSection>
        <SectionHeader
          label="Core features"
          title="One workspace. Every conversation becomes work."
          description="Click any feature to jump into the live demo — Kanban, chat, meetings, and content generation in one shell."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-2">
          {coreFeatures.map((feature, index) => (
            <StaggerItem key={feature.id} index={index}>
              <article className={`${CARD_INTERACTIVE} flex h-full flex-col p-6 md:p-7`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  {feature.title}
                </p>
                <h3 className={`mt-2 text-xl font-bold ${ACCENT_TEXT}`}>
                  {feature.headline}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                  {feature.body}
                </p>
                <button
                  type="button"
                  onClick={() => navigateToDemoTab(feature.demoTab)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition-colors hover:text-violet-200"
                >
                  Try in demo
                  <ArrowRight className="size-3.5" />
                </button>
              </article>
            </StaggerItem>
          ))}
        </div>

        <AnimatedSection delay={0.12} className="mt-12 space-y-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Real output — annotated dashboard
          </p>
          <DashboardScreenshot showAnnotations highlight />
          <SectionDashboardCta
            title="This is the real dashboard — not a mockup"
            description="Open it now to paste a link, connect your OpenRouter key, and generate your first multi-platform pack."
          />
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
