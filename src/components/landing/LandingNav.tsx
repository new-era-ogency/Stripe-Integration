"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
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
          <span className="flex size-6 items-center justify-center rounded-md bg-violet-600 text-[10px] font-bold">
            P
          </span>
          PulseFlow
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeId === link.id
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {activeId === link.id ? (
                <span className="absolute inset-x-2 -bottom-px h-px bg-violet-500" />
              ) : null}
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="hidden text-sm font-medium text-zinc-500 transition-colors hover:text-white sm:inline"
          >
            Pricing
          </Link>
          <AuthNavButtons />
        </div>
      </div>
    </nav>
  )
}
