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
  CARD_BASE,
  SECTION_CONTENT_GAP,
} from "@/lib/landing-styles"
import { faqs } from "@/lib/landing-content"

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionShell id="faq" tone="elevated">
      <AnimatedSection>
        <SectionHeader
          label="Questions"
          title="Things people ask before they paste a link"
        />
      </AnimatedSection>

      <div className={`max-w-2xl space-y-2 ${SECTION_CONTENT_GAP}`}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={faq.q}
              className={`${CARD_BASE} overflow-hidden transition-colors ${
                isOpen ? "border-violet-500/30" : ""
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
                  className={`size-4 shrink-0 text-violet-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen ? (
                <p className="border-t border-zinc-800/80 px-5 py-4 text-sm leading-relaxed text-zinc-400 md:px-6">
                  {faq.a}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      <AnimatedSection className={`max-w-2xl ${SECTION_CONTENT_GAP}`}>
        <p className="text-sm text-zinc-500">Still stuck?</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className={BTN_PRIMARY}>
            Contact us
          </Link>
          <Link href="/pricing" className={BTN_SECONDARY}>
            See pricing
          </Link>
        </div>
      </AnimatedSection>
    </SectionShell>
  )
}
