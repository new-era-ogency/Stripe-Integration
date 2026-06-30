"use client"

import Link from "next/link"
import { ArrowRight, Calendar, ExternalLink, MessageSquarePlus } from "lucide-react"
import AnimatedSection from "@/components/landing/AnimatedSection"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_INTERACTIVE,
} from "@/lib/landing-styles"
import { betaFeedback, ctaStrategy, finalCta } from "@/lib/landing-content"

export default function LaunchBetaSection() {
  return (
    <SectionShell divider={false} className="pb-28 pt-4 md:pb-36">
      <AnimatedSection>
        <div className={`${CARD_INTERACTIVE} border-violet-500/15 p-8 md:p-12`}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <SectionHeader
                label={finalCta.label}
                title={finalCta.title}
                description={finalCta.description}
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={ctaStrategy.primary.href}
                  className={`group inline-flex ${BTN_PRIMARY}`}
                >
                  {finalCta.primaryCta}
                  <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <Link
                  href={ctaStrategy.secondary.href}
                  className={`inline-flex ${BTN_SECONDARY}`}
                >
                  {finalCta.secondaryCta}
                </Link>
                <a
                  href={finalCta.bookDemoHref}
                  className={`inline-flex ${BTN_SECONDARY}`}
                >
                  <Calendar className="mr-2 size-4" />
                  Book Demo
                </a>
                <a
                  href={finalCta.feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex ${BTN_SECONDARY}`}
                >
                  <MessageSquarePlus className="mr-2 size-4" />
                  Leave feedback
                  <ExternalLink className="ml-2 size-3 opacity-60" />
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Beta feedback → shipped
              </p>
              <ul className="mt-4 space-y-3">
                {betaFeedback.map((item) => (
                  <li
                    key={item.text}
                    className="rounded-lg border border-zinc-800/80 bg-black/40 px-4 py-3"
                  >
                    <p className="text-sm text-zinc-300">&ldquo;{item.text}&rdquo;</p>
                    <p
                      className={`mt-2 text-xs font-medium ${
                        item.type === "open"
                          ? "text-amber-500/90"
                          : "text-emerald-500/90"
                      }`}
                    >
                      → {item.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </SectionShell>
  )
}
