"use client"

import {
  CreditCard,
  GitBranch,
  Plug,
  UserPlus,
  type LucideIcon,
} from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_BASE, CARD_HOVER } from "@/lib/landing-styles"
import { jobBlocks } from "@/lib/landing-content"

const iconMap: Record<(typeof jobBlocks)[number]["icon"], LucideIcon> = {
  stripe: CreditCard,
  api: GitBranch,
  onboarding: UserPlus,
  integrations: Plug,
}

export default function JobsSection() {
  return (
    <SectionShell id="features" tone="accent">
      <AnimatedSection>
        <SectionHeader
          label="What you can do"
          title="Jobs PulseFlow handles — not adjectives"
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-4 sm:grid-cols-2">
          {jobBlocks.map((job, index) => {
            const Icon = iconMap[job.icon]
            return (
              <StaggerItem key={job.title} index={index}>
                <article className={`h-full ${CARD_BASE} ${CARD_HOVER} p-6 md:p-7`}>
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                    <Icon className="size-4 text-violet-300" />
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-white md:text-xl">
                    {job.title}
                  </h3>
                </article>
              </StaggerItem>
            )
          })}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
