"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import DashboardCtaLink from "@/components/marketing/DashboardCtaLink"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import { LANDING_CONTAINER } from "@/lib/landing-styles"
import { navLinks } from "@/lib/landing-content"

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    let frame = 0
    const update = () => {
      setScrolled(window.scrollY > 12)
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const elements = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.2, 0.5] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-zinc-800/80 bg-black/75 perf-surface backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`${LANDING_CONTAINER} flex items-center justify-between gap-4 py-4`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-white"
        >
          <PulseFlowLogo size="sm" showWordmark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const className = `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeId === link.id
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`

            const content = (
              <>
                {activeId === link.id ? (
                  <span className="absolute inset-x-2 -bottom-px h-px bg-violet-500" />
                ) : null}
                {link.label}
              </>
            )

            return link.href.startsWith("/") ? (
              <Link key={link.href} href={link.href} className={className}>
                {content}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={className}>
                {content}
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#interactive-demo"
            className="hidden rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 lg:inline-flex"
          >
            Try demo
          </a>
          <DashboardCtaLink
            variant="nav"
            showIcon
            className="hidden text-xs sm:inline-flex"
          />
          <AuthNavButtons />
        </div>
      </div>
    </nav>
  )
}
