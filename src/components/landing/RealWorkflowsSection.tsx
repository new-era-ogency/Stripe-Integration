"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { realWorkflows } from "@/lib/landing-content"

export default function RealWorkflowsSection() {
  return (
    <SectionShell id="workflows">
      <AnimatedSection>
        <SectionHeader
          label="Real product flows"
          title="What actually runs in the dashboard today"
          description="Not mockups — these are the exact steps beta users take. Stripe automations are on the roadmap."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-2">
          {realWorkflows.map((workflow, index) => (
            <StaggerItem key={workflow.id} index={index}>
              <article className={`h-full ${CARD_INTERACTIVE} p-6`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-white">{workflow.title}</h3>
                  <span className="shrink-0 rounded-md border border-zinc-800 bg-black/50 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                    {workflow.metric}
                  </span>
                </div>
                <p className="mt-2 font-mono text-xs text-zinc-600">
                  trigger: {workflow.trigger}
                </p>

                <ol className="mt-5 space-y-0">
                  {workflow.steps.map((step, stepIndex) => (
                    <li
                      key={step.id}
                      className="relative flex gap-3 pb-4 last:pb-0"
                    >
                      {stepIndex < workflow.steps.length - 1 ? (
                        <span
                          className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-zinc-800"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-[10px] font-bold text-zinc-400">
                        {stepIndex + 1}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-zinc-200">
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </StaggerItem>
          ))}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
