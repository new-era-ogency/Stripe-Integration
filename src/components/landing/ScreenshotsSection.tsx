"use client"

import AnimatedSection from "@/components/landing/AnimatedSection"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import WorkflowBuilderScreenshot from "@/components/landing/WorkflowBuilderScreenshot"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"

export default function ScreenshotsSection() {
  return (
    <SectionShell id="product">
      <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <AnimatedSection>
          <SectionHeader
            label="See it working"
            title="Real UI — nodes, connections, logic"
            description="This is the actual workflow builder and dashboard. If you can't see it working, you won't trust it."
          />
          <ul className="mt-8 space-y-3 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-violet-500" />
              Drag-and-drop workflow canvas with live node states
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-violet-500" />
              Stripe triggers wired to Slack, email, and database steps
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-violet-500" />
              Run history and connection status in one view
            </li>
          </ul>
        </AnimatedSection>

        <SectionHeaderSpacer className="mt-0 lg:mt-0">
          <div className="space-y-5">
            <AnimatedSection delay={0.05}>
              <div className={`${CARD_INTERACTIVE} p-1`}>
                <WorkflowBuilderScreenshot animated highlight />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className={`${CARD_INTERACTIVE} p-1`}>
                <DashboardScreenshot showAnnotations={false} highlight />
              </div>
            </AnimatedSection>
          </div>
        </SectionHeaderSpacer>
      </div>
    </SectionShell>
  )
}
