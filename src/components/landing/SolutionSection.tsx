"use client"

import { Brain, Kanban, Mic, type LucideIcon } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import FlowDiagram from "@/components/landing/FlowDiagram"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { solutionSection } from "@/lib/landing-content"
import SectionDashboardCta from "@/components/marketing/SectionDashboardCta"

const iconMap: Record<(typeof solutionSection.steps)[number]["icon"], LucideIcon> = {
  capture: Mic,
  ai: Brain,
  kanban: Kanban,
}

export default function SolutionSection() {
  return (
    <SectionShell id="solution" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label={solutionSection.label}
          title={solutionSection.title}
          description={solutionSection.description}
          centered
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <AnimatedSection className="mb-10 flex justify-center">
          <FlowDiagram
            nodes={solutionSection.steps.map((step) => step.title)}
            animated
          />
        </AnimatedSection>

        <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
          {solutionSection.steps.map((item, index) => {
            const Icon = iconMap[item.icon]
            return (
              <StaggerItem key={item.step} index={index}>
                <li className={`${CARD_INTERACTIVE} p-6 md:p-8`}>
                  <div className="flex size-12 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10">
                    <Icon className="size-5 text-violet-300" />
                  </div>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {item.detail}
                  </p>
                </li>
              </StaggerItem>
            )
          })}
        </ol>

        <AnimatedSection className="mt-10">
          <SectionDashboardCta
            title="See the full workflow in the dashboard"
            description="From transcript to multi-platform drafts in one place — start with a YouTube link and ship in minutes."
          />
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
