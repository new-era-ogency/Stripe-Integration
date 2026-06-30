"use client"

import { Check, Circle, ExternalLink } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { changelog, publicRoadmap } from "@/lib/landing-content"

export default function PublicRoadmapSection() {
  return (
    <SectionShell id="roadmap" tone="spotlight">
      <AnimatedSection>
        <SectionHeader
          label={publicRoadmap.label}
          title={publicRoadmap.title}
          description={publicRoadmap.description}
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <AnimatedSection>
            <ul className={`${CARD_INTERACTIVE} divide-y divide-zinc-800/80 p-2`}>
              {publicRoadmap.items.map((item, index) => (
                <StaggerItem key={item.label} index={index}>
                  <li className="flex items-center gap-3 px-4 py-3.5">
                    {item.status === "shipped" ? (
                      <span className="flex size-6 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                        <Check className="size-3.5 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="flex size-6 items-center justify-center rounded-full border border-zinc-700">
                        <Circle className="size-2.5 text-zinc-600" />
                      </span>
                    )}
                    <span
                      className={`text-sm ${
                        item.status === "shipped" ? "text-zinc-200" : "text-zinc-500"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`ml-auto text-[10px] font-semibold uppercase tracking-wider ${
                        item.status === "shipped"
                          ? "text-emerald-400/80"
                          : "text-zinc-600"
                      }`}
                    >
                      {item.status === "shipped" ? "Shipped" : "Planned"}
                    </span>
                  </li>
                </StaggerItem>
              ))}
            </ul>

            <a
              href={publicRoadmap.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"
            >
              Vote on GitHub
              <ExternalLink className="size-3.5 opacity-70" />
            </a>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Recent releases
            </p>
            <div className="mt-4 space-y-4">
              {changelog.slice(0, 3).map((entry) => (
                <article
                  key={entry.version}
                  className={`${CARD_INTERACTIVE} p-5`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-white">{entry.title}</h3>
                    <span className="shrink-0 font-mono text-xs text-violet-400">
                      v{entry.version}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{entry.date}</p>
                  <ul className="mt-3 space-y-1.5">
                    {entry.items.slice(0, 2).map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-relaxed text-zinc-400"
                      >
                        · {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
