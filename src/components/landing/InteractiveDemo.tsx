"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2, Play } from "lucide-react"
import AnimatedSection from "@/components/landing/AnimatedSection"
import DashboardScreenshot from "@/components/landing/DashboardScreenshot"
import SectionHeader, { SectionHeaderSpacer } from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  BTN_PRIMARY,
  CARD_INTERACTIVE,
  LANDING_GRID,
} from "@/lib/landing-styles"
import {
  corePromise,
  realWorkflows,
  type RealWorkflowId,
} from "@/lib/landing-content"

type Platform = "x" | "linkedin" | "telegram"

export default function InteractiveDemo() {
  const [workflowId, setWorkflowId] = useState<RealWorkflowId>("viral-thread")
  const [activeStep, setActiveStep] = useState(0)
  const [activePlatform, setActivePlatform] = useState<Platform>("x")
  const [hasRun, setHasRun] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const workflow =
    realWorkflows.find((w) => w.id === workflowId) ?? realWorkflows[0]

  const runSimulation = useCallback(() => {
    setIsRunning(true)
    setHasRun(false)
    setActiveStep(0)

    const stepInterval = 420
    workflow.steps.forEach((_, index) => {
      setTimeout(() => setActiveStep(index), stepInterval * (index + 1))
    })

    setTimeout(() => {
      setIsRunning(false)
      setHasRun(true)
      setActivePlatform(workflow.outputPreview)
      setActiveStep(workflow.steps.length - 1)
    }, stepInterval * (workflow.steps.length + 1))
  }, [workflow])

  const selectWorkflow = (id: RealWorkflowId) => {
    setWorkflowId(id)
    setActiveStep(0)
    setHasRun(false)
    setIsRunning(false)
    const next = realWorkflows.find((w) => w.id === id)
    if (next) setActivePlatform(next.outputPreview)
  }

  return (
    <SectionShell id="demo" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="Interactive demo"
          title="Click through a real workflow — no signup"
          description={corePromise.proofPoint}
        />
      </AnimatedSection>

      <SectionHeaderSpacer>
        <div className={`${LANDING_GRID} gap-y-8`}>
          <div className="col-span-12 lg:col-span-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Pick a workflow
            </p>
            <div className="flex flex-col gap-2">
              {realWorkflows.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => selectWorkflow(w.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${
                    workflowId === w.id
                      ? "border-violet-500/40 bg-violet-500/10"
                      : "border-zinc-800 bg-zinc-950/80 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">
                      {w.title}
                    </span>
                    <span className="shrink-0 text-[10px] font-medium text-zinc-500">
                      {w.metric}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-zinc-600">
                    {w.trigger}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Steps in this flow
              </p>
              <ol className="space-y-2">
                {workflow.steps.map((step, index) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
                        activeStep === index
                          ? "border-violet-500/35 bg-violet-500/10"
                          : "border-zinc-800/80 bg-black/40 hover:border-zinc-700"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-zinc-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-medium text-zinc-200">
                        {step.label}
                      </p>
                      {activeStep === index ? (
                        <p className="mt-1 text-xs text-zinc-500">
                          {step.detail}
                        </p>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={isRunning}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:opacity-70 sm:w-auto`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Running step {activeStep + 1}…
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  {hasRun ? "Run again" : "Simulate this workflow"}
                </>
              )}
            </button>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className={`${CARD_INTERACTIVE} p-2 md:p-3`}>
              <DashboardScreenshot
                activePlatform={activePlatform}
                onPlatformChange={setActivePlatform}
                showAnnotations={hasRun}
                highlight
              />
              {!hasRun && !isRunning ? (
                <p className="mt-3 px-2 text-center text-xs text-zinc-600">
                  Hit &ldquo;Simulate this workflow&rdquo; to walk through steps
                  and reveal sample outputs.
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                This is the real dashboard UI — sign up to run it on your videos.
              </p>
              <Link href="/signup" className={`group inline-flex ${BTN_PRIMARY}`}>
                Start free beta
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </SectionHeaderSpacer>
    </SectionShell>
  )
}
