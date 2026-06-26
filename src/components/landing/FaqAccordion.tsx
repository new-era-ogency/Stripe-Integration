"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "@/components/landing/AnimatedSection"
import {
  BODY_TEXT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  LANDING_CONTAINER,
  SECTION_LABEL,
  SECTION_TITLE,
  LANDING_SECTION,
} from "@/lib/landing-styles"
import { faqs } from "@/lib/landing-content"

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className={LANDING_SECTION}>
      <div className={LANDING_CONTAINER}>
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <p className={SECTION_LABEL}>Support</p>
          <h2 className={`mt-3 ${SECTION_TITLE}`}>
            Frequently asked questions
          </h2>
          <p className={`mx-auto mt-4 ${BODY_TEXT}`}>
            Everything you need to know about PulseFlow billing, security, and
            generation workflow.
          </p>
        </AnimatedSection>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <AnimatedSection key={faq.q} delay={index * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-250 ${
                    isOpen
                      ? "border-violet-500/30 bg-violet-500/5 shadow-[0_8px_32px_-16px_rgba(139,92,246,0.35)]"
                      : "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isOpen ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-zinc-500 transition-transform duration-250 ${
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
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <p className="border-t border-zinc-800/80 px-5 py-4 text-sm leading-relaxed text-zinc-400">
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

        <AnimatedSection className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-sm text-zinc-400">Still have questions?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className={BTN_PRIMARY}>
              Talk to Support
            </Link>
            <Link href="/pricing" className={BTN_SECONDARY}>
              View Pricing
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
