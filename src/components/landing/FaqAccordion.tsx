"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import AnimatedSection from "@/components/landing/AnimatedSection"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_INTERACTIVE,
  SECTION_CONTENT_GAP,
} from "@/lib/landing-styles"
import { faqs } from "@/lib/landing-content"

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionShell id="faq" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="FAQ"
          title="Removing doubt — not explaining the product"
        />
      </AnimatedSection>

      <div className={`max-w-2xl space-y-2 ${SECTION_CONTENT_GAP}`}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={faq.q}
              className={`${CARD_INTERACTIVE} overflow-hidden ${
                isOpen ? "border-violet-500/25" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-zinc-200">{faq.q}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-violet-400 transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-zinc-800/80 px-5 pb-4 pt-3 text-sm leading-relaxed text-zinc-400 md:px-6">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <AnimatedSection className={`max-w-2xl ${SECTION_CONTENT_GAP}`}>
        <p className="text-sm text-zinc-500">Still have doubts?</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/dashboard" className={BTN_PRIMARY}>
            Launch dashboard
          </Link>
          <Link href="/guide/openrouter-key" className={BTN_SECONDARY}>
            OpenRouter setup guide
          </Link>
        </div>
      </AnimatedSection>
    </SectionShell>
  )
}
