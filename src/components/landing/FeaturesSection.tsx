"use client"

import Link from "next/link"
import {
  ArrowRight,
  Layers,
  Palette,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import InteractiveCard from "@/components/landing/InteractiveCard"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  CARD_BASE,
  CARD_HOVER,
  SECTION_HEADER_CENTERED,
} from "@/lib/landing-styles"
import { featureBlocks } from "@/lib/landing-content"

const iconMap: Record<(typeof featureBlocks)[number]["icon"], LucideIcon> = {
  layers: Layers,
  zap: Zap,
  target: Target,
  palette: Palette,
}

export default function FeaturesSection() {
  return (
    <SectionShell id="features" tone="elevated">
      <AnimatedSection className={SECTION_HEADER_CENTERED}>
        <SectionHeader
          centered
          label="Features"
          title="YouTube in. Social everywhere out."
          description="Everything you need to repurpose long-form video into high-performing social content — fast, on-brand, and platform-native."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-8">
          {featureBlocks.map((block, index) => {
            const Icon = iconMap[block.icon]

            return (
              <StaggerItem key={block.title} index={index}>
                <InteractiveCard
                  as="article"
                  className={`h-full ${CARD_BASE} ${CARD_HOVER} p-8 md:p-9`}
                >
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/35 to-indigo-500/20 text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Icon className="size-6" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/85">
                    {block.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
                    {block.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-zinc-400">
                    {block.description}
                  </p>
                  <Link
                    href={block.learnMoreHref}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-white"
                  >
                    Learn more
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </InteractiveCard>
              </StaggerItem>
            )
          })}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
