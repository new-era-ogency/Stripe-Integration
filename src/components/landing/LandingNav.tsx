"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import { usePerfMode } from "@/hooks/usePerfMode"
import { LANDING_CONTAINER } from "@/lib/landing-styles"
import { navLinks } from "@/lib/landing-content"

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string>("")
  const { isLite } = usePerfMode()

  useEffect(() => {
    let frame = 0

    const update = () => {
      setScrolled(window.scrollY > 20)
      frame = 0
    }

    const onScroll = () => {
      if (frame) {
        return
      }
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  useEffect(() => {
    const elements = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-32% 0px -58% 0px", threshold: [0.15, 0.4, 0.65] }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
        scrolled
          ? "border-b border-zinc-800/70 bg-black/75 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.85)] backdrop-blur-2xl perf-surface"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`${LANDING_CONTAINER} flex items-center justify-between gap-4 py-4 md:py-5`}
      >
        <Link
          href="/"
          className="shrink-0 text-sm font-bold uppercase tracking-[0.32em] text-white transition-opacity hover:opacity-80"
        >
          PulseFlow
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeId === link.id

            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3.5 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                  isActive ? "text-violet-100" : "text-zinc-500 hover:text-white"
                }`}
              >
                {isActive ? (
                  isLite ? (
                    <span className="absolute inset-0 rounded-lg border border-violet-500/25 bg-violet-500/12" />
                  ) : (
                    <motion.span
                      layoutId="landing-nav-active"
                      className="absolute inset-0 rounded-lg border border-violet-500/25 bg-violet-500/12"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </a>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 transition-colors hover:text-white sm:inline-flex"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="hidden rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 transition-colors hover:text-white md:inline-flex"
          >
            Pricing
          </Link>
          <AuthNavButtons />
        </div>
      </div>
    </nav>
  )
}
