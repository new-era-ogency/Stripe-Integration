"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import FlowDiagram from "@/components/landing/FlowDiagram"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { ACCENT_TEXT, CARD_INTERACTIVE } from "@/lib/landing-styles"
import { proofMetrics, realWorkflows } from "@/lib/landing-content"

export default function ProofSection() {
  return (
    <SectionShell id="proof" tone="default">
      <AnimatedSection>
        <SectionHeader
          label={proofMetrics.label}
          title={proofMetrics.title}
          description={proofMetrics.description}
          centered
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofMetrics.stats.map((stat, index) => (
            <StaggerItem key={stat.label} index={index}>
              <div className={`${CARD_INTERACTIVE} p-5`}>
                <p className={`text-2xl font-bold md:text-3xl ${ACCENT_TEXT}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
                <p className="mt-1 text-[11px] text-zinc-600">{stat.delta}</p>
              </div>
            </StaggerItem>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {realWorkflows.slice(0, 3).map((workflow, index) => (
            <StaggerItem key={workflow.id} index={index}>
              <article className={`${CARD_INTERACTIVE} p-5`}>
                <p className="text-sm font-semibold text-white">{workflow.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{workflow.trigger}</p>
                <div className="mt-4">
                  <FlowDiagram
                    nodes={workflow.steps.map((step) => step.label)}
                    compact
                  />
                </div>
                <p className="mt-3 text-[11px] font-medium text-violet-400/90">
                  {workflow.metric}
                </p>
              </article>
            </StaggerItem>
          ))}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
