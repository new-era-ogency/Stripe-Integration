"use client"

import { GitBranch, Link2, Zap, type LucideIcon } from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { steps } from "@/lib/landing-content"

const iconMap: Record<(typeof steps)[number]["icon"], LucideIcon> = {
  link: Link2,
  workflow: GitBranch,
  zap: Zap,
}

export default function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="How it works"
          title="Three steps. No rabbit holes."
          centered
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((item, index) => {
            const Icon = iconMap[item.icon]
            return (
              <StaggerItem key={item.step} index={index}>
                <li className={`${CARD_INTERACTIVE} p-6 text-center md:p-8`}>
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10">
                    <Icon className="size-5 text-violet-300" />
                  </div>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                </li>
              </StaggerItem>
            )
          })}
        </ol>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
