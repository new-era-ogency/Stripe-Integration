"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { ACCENT_TEXT } from "@/lib/landing-styles"
import { changelog } from "@/lib/landing-content"

export default function ChangelogSection() {
  return (
    <SectionShell id="changelog" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="Changelog"
          title="Shipped recently"
          description="PulseFlow is actively developed. Here's what landed in the last few releases."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="relative space-y-0">
          <div
            className="absolute bottom-0 left-[3.25rem] top-0 hidden w-px bg-gradient-to-b from-violet-500/40 via-zinc-800 to-transparent md:block"
            aria-hidden
          />

          {changelog.map((entry, index) => (
            <StaggerItem key={entry.version} index={index}>
              <article className="relative grid gap-4 border-b border-zinc-800/80 py-8 md:grid-cols-[10rem_1fr] md:gap-10 md:py-10">
                <div className="flex items-start gap-4 md:block">
                  <span
                    className="relative z-10 mt-1 hidden size-2.5 shrink-0 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)] md:absolute md:left-[3.05rem] md:mt-2 md:block"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-300">
                      {entry.date}
                    </p>
                    <p className={`mt-1 font-mono text-sm ${ACCENT_TEXT}`}>
                      v{entry.version}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{entry.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {entry.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-zinc-400"
                      >
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-violet-500/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </StaggerItem>
          ))}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
