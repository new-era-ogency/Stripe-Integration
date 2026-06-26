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
import {
  BODY_TEXT,
  CARD_BASE,
  CARD_HOVER,
  LANDING_CONTAINER,
  LANDING_SECTION,
  SECTION_LABEL,
  SECTION_TITLE,
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
    <section id="features" className={LANDING_SECTION}>
      <div className={LANDING_CONTAINER}>
        <AnimatedSection className="text-center">
          <p className={SECTION_LABEL}>Features</p>
          <h2 className={`mt-3 ${SECTION_TITLE}`}>
            YouTube in. Social everywhere out.
          </h2>
          <p className={`mx-auto mt-4 ${BODY_TEXT}`}>
            Everything you need to repurpose long-form video into high-performing
            social content — fast, on-brand, and platform-native.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {featureBlocks.map((block, index) => {
            const Icon = iconMap[block.icon]

            return (
              <StaggerItem key={block.title} index={index}>
                <article
                  className={`group relative h-full ${CARD_BASE} ${CARD_HOVER} p-8`}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 to-violet-500/0 opacity-0 transition-opacity duration-250 group-hover:from-violet-500/5 group-hover:to-indigo-500/5 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/20 text-violet-200">
                      <Icon className="size-5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wider text-violet-300/80">
                      {block.eyebrow}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {block.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {block.description}
                    </p>
                    <Link
                      href={block.learnMoreHref}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition-colors hover:text-white"
                    >
                      Learn more
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            )
          })}
        </div>
      </div>
    </section>
  )
}
