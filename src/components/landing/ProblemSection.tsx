"use client"

import { AlertTriangle } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { BODY_TEXT, CARD_INTERACTIVE } from "@/lib/landing-styles"
import { problemSection } from "@/lib/landing-content"

export default function ProblemSection() {
  return (
    <SectionShell id="problem" tone="default">
      <AnimatedSection>
        <SectionHeader
          label={problemSection.label}
          title={problemSection.title}
          description={
            <>
              <p>{problemSection.description}</p>
              <p className="mt-4">{problemSection.descriptionContinued}</p>
            </>
          }
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-5 md:grid-cols-3">
          {problemSection.pains.map((pain, index) => (
            <StaggerItem key={pain.title} index={index}>
              <article className={`flex h-full flex-col ${CARD_INTERACTIVE} p-6 md:p-7`}>
                <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                  <AlertTriangle className="size-4 text-amber-300" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{pain.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {pain.body}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-500">
                  {pain.detail}
                </p>
                <ul className="mt-4 space-y-2 border-t border-zinc-800/80 pt-4">
                  {pain.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm leading-relaxed text-zinc-500"
                    >
                      <span
                        className="mt-2 size-1 shrink-0 rounded-full bg-amber-400/70"
                        aria-hidden
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </div>

        <AnimatedSection className="mt-10">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] via-zinc-950 to-transparent px-6 py-5 md:px-8 md:py-6">
            <p className={`${BODY_TEXT} max-w-none text-zinc-400`}>
              {problemSection.closingNote}
            </p>
          </div>
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
