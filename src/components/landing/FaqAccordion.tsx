"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "@/components/landing/AnimatedSection"
import SectionHeader from "@/components/landing/SectionHeader"
import SectionShell from "@/components/landing/SectionShell"
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  SECTION_CONTENT_GAP,
  SECTION_HEADER_CENTERED,
} from "@/lib/landing-styles"
import { faqs } from "@/lib/landing-content"

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionShell id="faq" tone="elevated">
      <AnimatedSection className={SECTION_HEADER_CENTERED}>
        <SectionHeader
          centered
          label="Support"
          title="Frequently asked questions"
          description="Everything you need to know about PulseFlow billing, security, and generation workflow."
        />
      </AnimatedSection>

      <div className={`mx-auto max-w-3xl space-y-3 ${SECTION_CONTENT_GAP}`}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <AnimatedSection key={faq.q} delay={index * 0.04}>
              <div
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-violet-500/35 bg-violet-500/[0.06] shadow-[0_12px_40px_-18px_rgba(139,92,246,0.35)]"
                    : "border-zinc-800/80 bg-zinc-950/55 hover:border-zinc-700 hover:bg-zinc-950/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base font-medium transition-colors ${
                      isOpen ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-zinc-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-violet-300" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="border-t border-zinc-800/80 px-5 py-5 text-base leading-relaxed text-zinc-400 md:px-6">
                        {faq.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          )
        })}
      </div>

      <AnimatedSection className={`mx-auto max-w-xl text-center ${SECTION_CONTENT_GAP}`}>
        <p className="text-base text-zinc-400">Still have questions?</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className={BTN_PRIMARY}>
            Talk to Support
          </Link>
          <Link href="/pricing" className={BTN_SECONDARY}>
            View Pricing
          </Link>
        </div>
      </AnimatedSection>
    </SectionShell>
  )
}
