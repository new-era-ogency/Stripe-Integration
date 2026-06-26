"use client"

import AnimatedSection from "@/components/landing/AnimatedSection"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import WorkflowBuilderScreenshot from "@/components/landing/WorkflowBuilderScreenshot"

export default function ScreenshotsSection() {
  return (
    <SectionShell id="product" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="Inside the product"
          title="Real UI — not illustrations"
          description="Workflow canvas and dashboard states from the actual app. Imperfect pixels beat polished fakes."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <AnimatedSection>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Workflow builder
            </p>
            <div className="landing-product-glow">
              <WorkflowBuilderScreenshot />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Live dashboard
            </p>
            <div className="landing-product-glow">
              <DashboardScreenshot showAnnotations={false} highlight />
            </div>
          </AnimatedSection>
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
