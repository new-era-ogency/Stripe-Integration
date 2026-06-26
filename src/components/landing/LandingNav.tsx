"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import { LANDING_CONTAINER } from "@/lib/landing-styles"
import { navLinks } from "@/lib/landing-content"

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.id)
    const elements = sectionIds
      .map((id) => document.getElementById(id))
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
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-800/80 bg-black/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`${LANDING_CONTAINER} flex items-center justify-between gap-4 py-4`}
      >
        <Link
          href="/"
          className="shrink-0 text-sm font-bold uppercase tracking-[0.3em] text-white"
        >
          PulseFlow
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeId === link.id
                  ? "bg-violet-500/15 text-violet-200"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
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

export function LandingSection({
  id,
  children,
  className = "",
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}
