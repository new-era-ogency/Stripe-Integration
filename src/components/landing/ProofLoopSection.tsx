"use client"

import { ArrowRight } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_BASE } from "@/lib/landing-styles"
import { proofLoop } from "@/lib/landing-content"

function MiniFlow({ nodes }: { nodes: readonly string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {nodes.map((node, index) => (
        <span key={node} className="flex items-center gap-2">
          <span className="rounded-md border border-zinc-800 bg-black/50 px-2 py-1 text-[10px] font-medium text-zinc-400">
            {node}
          </span>
          {index < nodes.length - 1 ? (
            <ArrowRight className="size-3 text-violet-500/60" />
          ) : null}
        </span>
      ))}
    </div>
  )
}

export default function ProofLoopSection() {
  return (
    <SectionShell id="proof" tone="spotlight">
      <AnimatedSection>
        <SectionHeader
          label="Proof loop"
          title={proofLoop.headline}
          centered
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-3">
          {proofLoop.examples.map((example, index) => (
            <StaggerItem key={example.title} index={index}>
              <article className={`h-full ${CARD_BASE} p-5 md:p-6`}>
                <h3 className="font-bold text-white">{example.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {example.description}
                </p>
                <MiniFlow nodes={example.nodes} />
              </article>
            </StaggerItem>
          ))}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
