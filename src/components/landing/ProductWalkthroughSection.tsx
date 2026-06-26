"use client"

import AnimatedSection, { StaggerItem } from "@/components/landing/AnimatedSection"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import { BODY_TEXT, CARD_BASE } from "@/lib/landing-styles"
import { walkthroughSteps } from "@/lib/landing-content"
import { Copy, Sliders, Sparkles } from "lucide-react"

const stepVisuals = [
  { type: "screenshot" as const },
  {
    type: "presets" as const,
    presets: ["Viral Thread", "Deep Dive", "Punchy Short"],
  },
  {
    type: "actions" as const,
    actions: ["Copy per tab", "Edit inline", "Publish to Telegram"],
  },
]

function StepVisual({ index }: { index: number }) {
  const visual = stepVisuals[index]

  if (visual.type === "screenshot") {
    return <DashboardScreenshot compact showAnnotations />
  }

  if (visual.type === "presets") {
    return (
      <div className={`${CARD_BASE} p-6 md:p-8`}>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <Sliders className="size-4 text-violet-400" />
          Tone presets
        </div>
        <div className="space-y-2">
          {visual.presets.map((preset, i) => (
            <div
              key={preset}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                i === 0
                  ? "border-violet-500/40 bg-violet-500/10 text-white"
                  : "border-zinc-800 text-zinc-400"
              }`}
            >
              {preset}
              {i === 0 ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  Active
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${CARD_BASE} p-6 md:p-8`}>
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">
        <Copy className="size-4 text-violet-400" />
        Ready to ship
      </div>
      <div className="grid gap-2">
        {visual.actions.map((action, i) => (
          <div
            key={action}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-300"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-bold text-zinc-500">
              {i + 1}
            </span>
            {action}
            {i === 2 ? (
              <Sparkles className="ml-auto size-3.5 text-violet-400" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductWalkthroughSection() {
  return (
    <SectionShell id="product">
      <AnimatedSection>
        <SectionHeader
          label="The product"
          title="What you see after you paste a link"
          description="This is the actual dashboard flow — not a marketing mockup with lorem ipsum."
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className="space-y-20 md:space-y-28">
          {walkthroughSteps.map((step, index) => {
            const reversed = step.align === "right"

            return (
              <StaggerItem key={step.title} index={index}>
                <div
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className={reversed ? "lg:pl-6" : "lg:pr-6"}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                      Step {index + 1}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                      {step.title}
                    </h3>
                    <p className={`mt-4 ${BODY_TEXT}`}>{step.description}</p>
                  </div>

                  <div className="landing-product-glow">
                    <StepVisual index={index} />
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
