"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import DashboardCtaLink from "@/components/marketing/DashboardCtaLink"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import { navLinks } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

export default function MobileLandingNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <PulseFlowLogo size="sm" showWordmark />
          </Link>

          <div className="flex items-center gap-2">
            <DashboardCtaLink variant="compact" />
            <AuthNavButtons />
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMenuOpen(false)} />
      ) : null}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(100vw-3rem,20rem)] flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="border-b border-zinc-800 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Explore
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
              >
                {link.label}
              </a>
            )
          )}

          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-xl bg-violet-600 px-3 py-3 text-center text-sm font-semibold text-white"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </>
  )
}
