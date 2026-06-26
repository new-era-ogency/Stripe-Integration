"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { ACCENT_TEXT, CARD_BASE, SECTION_CONTENT_GAP } from "@/lib/landing-styles"
import { honestStats, techStack, testimonials } from "@/lib/landing-content"

export default function SocialProofSection() {
  const [featured, supporting] = [
    testimonials.find((t) => t.highlight) ?? testimonials[0],
    testimonials.find((t) => !t.highlight) ?? testimonials[1],
  ]

  return (
    <SectionShell id="testimonials" tone="spotlight">
      <AnimatedSection>
        <SectionHeader
          label="From early users"
          title="People who actually ship with it"
          description="We're still early. These are real workflows, not vanity metrics."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-8 sm:grid-cols-3">
          {honestStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`${index === 0 ? "sm:col-span-1" : ""}`}
            >
              <p className={`text-3xl font-bold md:text-4xl ${ACCENT_TEXT}`}>
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-12 grid gap-6 md:grid-cols-2 ${SECTION_CONTENT_GAP}`}>
          {[featured, supporting].map((item, index) => (
            <StaggerItem key={item.author} index={index}>
              <blockquote
                className={`h-full ${CARD_BASE} border-violet-500/10 p-6 md:p-8 ${
                  index === 0
                    ? "bg-gradient-to-br from-violet-500/[0.06] to-zinc-950"
                    : ""
                }`}
              >
                <p className="text-lg leading-relaxed text-zinc-200">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3 text-sm">
                  <span className="flex size-8 items-center justify-center rounded-full bg-violet-600/20 text-xs font-bold text-violet-300">
                    {item.author.charAt(0)}
                  </span>
                  <div>
                    <span className="font-semibold text-white">{item.author}</span>
                    <p className="text-zinc-500">{item.role}</p>
                  </div>
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </div>

        <AnimatedSection className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Built with
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {techStack.map((name) => (
              <span
                key={name}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
