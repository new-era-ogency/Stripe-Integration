"use client"

import Link from "next/link"
import { ArrowRight, Layers, Palette, Target, Zap, type LucideIcon } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  ACCENT_TEXT,
  CARD_BASE,
  CARD_FEATURED,
  CARD_HOVER,
} from "@/lib/landing-styles"
import { featureBlocks } from "@/lib/landing-content"

const iconMap: Record<(typeof featureBlocks)[number]["icon"], LucideIcon> = {
  layers: Layers,
  zap: Zap,
  target: Target,
  palette: Palette,
}

export default function FeaturesSection() {
  const featured = featureBlocks.find((b) => b.featured) ?? featureBlocks[0]
  const rest = featureBlocks.filter((b) => !b.featured)
  const FeaturedIcon = iconMap[featured.icon]

  return (
    <SectionShell id="features" tone="accent">
      <AnimatedSection>
        <SectionHeader
          label="What it does"
          title="Repurposing without the busywork"
          description="Not another AI writer that dumps a wall of text. PulseFlow is built around one job: turn a video transcript into posts you'd actually publish."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 md:grid-cols-2">
          <StaggerItem index={0} className="md:col-span-2">
            <article
              className={`${CARD_FEATURED} relative overflow-hidden p-8 md:p-10`}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-violet-600/10 blur-3xl" />
              <FeaturedIcon className={`relative mb-4 size-6 ${ACCENT_TEXT}`} />
              <p className="relative text-xs font-semibold uppercase tracking-wider text-violet-400/80">
                {featured.eyebrow}
              </p>
              <h3 className="relative mt-2 max-w-xl text-2xl font-bold tracking-tight text-white md:text-3xl">
                {featured.title}
              </h3>
              <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
                {featured.description}
              </p>
              <Link
                href={featured.learnMoreHref}
                className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
              >
                See it in the product
                <ArrowRight className="size-4" />
              </Link>
            </article>
          </StaggerItem>

          {rest.map((block, index) => {
            const Icon = iconMap[block.icon]
            return (
              <StaggerItem key={block.title} index={index + 1}>
                <article className={`group h-full ${CARD_BASE} ${CARD_HOVER} p-6 md:p-7`}>
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 transition-colors group-hover:border-violet-500/30 group-hover:bg-violet-500/10">
                    <Icon className="size-4 text-zinc-400 transition-colors group-hover:text-violet-300" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {block.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {block.description}
                  </p>
                </article>
              </StaggerItem>
            )
          })}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
