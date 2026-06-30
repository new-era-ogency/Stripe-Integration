"use client"

import Link from "next/link"
import { BookOpen, ChevronDown, ExternalLink } from "lucide-react"
import { useState } from "react"
import {
  directApiUsage,
  getOpenRouterKeySteps,
  guideFaq,
  OPENROUTER_API_KEY_GUIDE_PATH,
  openRouterLinks,
  useKeyInPulseFlowSteps,
  type GuideStep,
} from "@/lib/guides/openrouter-api-key"
import { cn } from "@/lib/utils"

type OpenRouterApiKeyGuideProps = {
  variant?: "full" | "compact"
  className?: string
  defaultExpanded?: boolean
}

function GuideLink({
  label,
  href,
  external,
}: {
  label: string
  href: string
  external?: boolean
}) {
  const className =
    "inline-flex items-center gap-1 text-violet-400 transition-colors hover:text-violet-300"

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ExternalLink className="size-3" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

function StepList({
  steps,
  startIndex = 1,
}: {
  steps: GuideStep[]
  startIndex?: number
}) {
  return (
    <ol className="space-y-5">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-200"
            aria-hidden
          >
            {startIndex + index}
          </span>
          <div className="min-w-0 space-y-1.5 pt-0.5">
            <h3 className="text-sm font-medium text-zinc-100">{step.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{step.body}</p>
            {step.links?.length ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
                {step.links.map((link) => (
                  <GuideLink key={link.href} {...link} />
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function OpenRouterApiKeyGuide({
  variant = "full",
  className,
  defaultExpanded = false,
}: OpenRouterApiKeyGuideProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3.5",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="inline-flex w-full items-center justify-between gap-2 text-left text-sm text-zinc-200 transition-colors hover:text-white"
          aria-expanded={expanded}
        >
          <span className="inline-flex items-center gap-2">
            <BookOpen className="size-4 text-violet-400" aria-hidden />
            How to get and use your OpenRouter key
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-zinc-500 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "mt-4 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-6 border-t border-zinc-800/80 pt-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Get your key
              </p>
              <StepList steps={getOpenRouterKeySteps.slice(0, 3)} />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Use it in PulseFlow
              </p>
              <StepList steps={useKeyInPulseFlowSteps.slice(0, 2)} startIndex={4} />
            </div>
            <p className="text-sm text-zinc-500">
              Full guide with direct API examples:{" "}
              <Link
                href={OPENROUTER_API_KEY_GUIDE_PATH}
                className="text-violet-400 hover:text-violet-300"
              >
                OpenRouter setup guide
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-10", className)}>
      <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 px-5 py-4">
        <p className="text-sm leading-relaxed text-zinc-300">
          PulseFlow is free — you bring your own OpenRouter API key. OpenRouter
          bills you directly for AI usage. This guide shows where to create a
          key, how to connect it in PulseFlow, and how to call OpenRouter
          yourself if you want to go beyond the dashboard.
        </p>
        <p className="mt-3 text-sm">
          <a
            href={openRouterLinks.home}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
          >
            openrouter.ai
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white">
          Part 1 — Get your OpenRouter API key
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Takes about two minutes. You only need to do this once per browser.
        </p>
        <div className="mt-6">
          <StepList steps={getOpenRouterKeySteps} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          Part 2 — Use your key in PulseFlow
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          After saving your key, generation works from the dashboard and the
          landing-page demo.
        </p>
        <div className="mt-6">
          <StepList steps={useKeyInPulseFlowSteps} startIndex={5} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">{directApiUsage.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {directApiUsage.description}
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          PulseFlow uses model{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-violet-200">
            {directApiUsage.model}
          </code>{" "}
          — you can use the same model in your own requests.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
          <code>{directApiUsage.curlExample}</code>
        </pre>
        <p className="mt-3 text-sm text-zinc-500">
          <a
            href={openRouterLinks.quickstart}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
          >
            OpenRouter API quickstart
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </p>
        <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm leading-relaxed text-zinc-400">
          {directApiUsage.pulseFlowApiNote}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">Common questions</h2>
        <dl className="mt-6 space-y-5">
          {guideFaq.map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-medium text-zinc-200">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
