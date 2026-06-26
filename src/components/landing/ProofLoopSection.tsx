"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import FlowDiagram from "@/components/landing/FlowDiagram"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { proofLoop } from "@/lib/landing-content"

export default function ProofLoopSection() {
  return (
    <SectionShell id="proof" tone="spotlight">
      <AnimatedSection>
        <SectionHeader label="Proof loop" title={proofLoop.headline} />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-3 md:grid-cols-3">
          {proofLoop.examples.map((example, index) => (
            <StaggerItem key={example.title} index={index}>
              <article className={`h-full ${CARD_INTERACTIVE} p-5 md:p-6`}>
                <h3 className="font-bold text-white">{example.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {example.description}
                </p>
                <div className="mt-4">
                  <FlowDiagram nodes={example.nodes} compact />
                </div>
              </article>
            </StaggerItem>
          ))}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
