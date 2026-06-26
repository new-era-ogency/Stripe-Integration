"use client"

import Link from "next/link"
import { Circle, ExternalLink } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { ACCENT_TEXT, CARD_BASE } from "@/lib/landing-styles"
import { credibility, techStack } from "@/lib/landing-content"

export default function CredibilitySection() {
  return (
    <SectionShell id="credibility" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="Credibility"
          title="Built in the open — not a vaporware demo"
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {credibility.stats.map((stat, index) => (
              <StaggerItem key={stat.label} index={index}>
                <div className={`${CARD_BASE} p-5`}>
                  <p className={`text-2xl font-bold md:text-3xl ${ACCENT_TEXT}`}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </div>

          <AnimatedSection delay={0.1}>
            <div className={`${CARD_BASE} p-5 md:min-w-[16rem]`}>
              <div className="flex items-center gap-2">
                <Circle className="size-2 fill-emerald-400 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">
                  Active development
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{credibility.releaseNote}</p>
              <p className="mt-4 text-sm text-zinc-500">{credibility.builderNote}</p>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={credibility.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  View on GitHub
                  <ExternalLink className="size-3.5" />
                </a>
                <Link
                  href="/#changelog"
                  className="text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Read the changelog →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Integrations & stack
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {techStack.map((name) => (
              <span
                key={name}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-400"
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
