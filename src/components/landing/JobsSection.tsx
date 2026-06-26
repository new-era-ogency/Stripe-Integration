"use client"

import {
  CreditCard,
  GitBranch,
  Plug,
  RefreshCw,
  UserPlus,
  Webhook,
  type LucideIcon,
} from "lucide-react"
import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { CARD_INTERACTIVE } from "@/lib/landing-styles"
import { jobBlocks } from "@/lib/landing-content"

const iconMap: Record<(typeof jobBlocks)[number]["icon"], LucideIcon> = {
  stripe: CreditCard,
  api: GitBranch,
  webhook: Webhook,
  onboarding: UserPlus,
  sync: RefreshCw,
  integrations: Plug,
}

export default function JobsSection() {
  return (
    <SectionShell id="features">
      <AnimatedSection>
        <SectionHeader
          label="What you can build"
          title="Outcomes, not adjectives"
          description="Each feature answers one question: what can I actually ship with this?"
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobBlocks.map((job, index) => {
            const Icon = iconMap[job.icon]
            return (
              <StaggerItem key={job.title} index={index}>
                <article className={`group h-full ${CARD_INTERACTIVE} p-6`}>
                  <div className="mb-4 flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-violet-500/25 group-hover:bg-violet-500/10">
                    <Icon className="size-4 text-zinc-400 transition-colors group-hover:text-violet-300" />
                  </div>
                  <h3 className="text-base font-bold leading-snug text-white">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {job.outcome}
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
