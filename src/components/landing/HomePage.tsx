"use client"

import { useState } from "react"
import Link from "next/link"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import HeroVideoBackground from "@/components/landing/HeroVideoBackground"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  benefits,
  collections,
  demoContent,
  exploreLinks,
  faqs,
  featureBlocks,
  platformCategories,
  steps,
  styleShowcase,
  testimonials,
  useCases,
} from "@/lib/landing-content"

type Platform = "x" | "linkedin" | "telegram"

const navLinks = [
  { href: "#collections", label: "Categories" },
  { href: "#features", label: "Features" },
  { href: "#use-cases", label: "Use Cases" },
  { href: "#styles", label: "Styles" },
  { href: "#demo", label: "Demo" },
  { href: "#faq", label: "FAQ" },
]

const sectionLabel = "text-xs uppercase tracking-[0.35em] text-zinc-600"
const sectionTitle =
  "text-2xl font-light tracking-tight text-white md:text-3xl"
const cardClass =
  "rounded-xl border border-zinc-900 bg-[#050505] p-6 transition-colors hover:border-zinc-800"

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("x")
  const [activeStyle, setActiveStyle] = useState<string | null>(null)

  const scrollToDemo = (platform?: Platform) => {
    if (platform) setActivePlatform(platform)
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000000] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#000000]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className="shrink-0 text-sm font-black uppercase tracking-[0.35em] text-white"
          >
            PulseFlow
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-[11px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-3 py-2 text-[11px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-white sm:inline-flex"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="hidden rounded-lg px-3 py-2 text-[11px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-white md:inline-flex"
            >
              Pricing
            </Link>
            <AuthNavButtons />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-16 md:pt-24">
        <HeroVideoBackground />
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <p className="mb-4 font-mono text-[11px] text-zinc-600">
            Join creators repurposing YouTube into daily social output
          </p>
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-violet-400/80">
            AI Content Repurposing Engine
          </p>
          <h1 className="mx-auto max-w-4xl text-3xl font-light leading-tight tracking-tight text-white md:text-5xl md:leading-[1.15] lg:text-6xl">
            REPURPOSE YOUTUBE INTO{" "}
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text font-normal text-transparent">
              VIRAL CONTENT
            </span>{" "}
            INSTANTLY.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed tracking-wide text-zinc-500 md:text-base">
            Paste a link. Get X threads, LinkedIn posts, and Telegram drops —
            engineered for hooks, structure, and reach. No sign-in required to
            explore.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-black shadow-[0_4px_24px_rgba(255,255,255,0.18)] transition-all duration-300 hover:bg-zinc-200"
            >
              Explore the Demo
            </a>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] px-8 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/30 hover:text-white"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Collections / Categories */}
      <section id="collections" className="scroll-mt-24 border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={sectionLabel}>Collections</p>
          <h2 className={`mt-3 ${sectionTitle}`}>
            Create your first repurposed post today
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-zinc-500">
            Pick a platform or content style to preview what PulseFlow generates.
            X threads, LinkedIn authority posts, Telegram drops — all from one
            YouTube link.
          </p>

          <div className="mt-10">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {collections.platforms.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToDemo(item.id as Platform)}
                  className="group flex items-center gap-2 rounded-lg border border-zinc-900 bg-[#050505] px-4 py-2.5 text-left transition-all hover:border-zinc-700 hover:bg-[#0a0a0a]"
                >
                  <span className="text-sm text-zinc-300 group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-600">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Content Styles
            </p>
            <div className="flex flex-wrap gap-2">
              {collections.styles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveStyle(item.label)
                    scrollToDemo()
                  }}
                  className={`rounded-md border px-3 py-2 font-mono text-[11px] transition-all ${
                    activeStyle === item.label
                      ? "border-zinc-600 bg-zinc-900 text-zinc-200"
                      : "border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section id="features" className="scroll-mt-24 border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={`${sectionLabel} text-center`}>Features</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            YouTube in. Social everywhere out.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {featureBlocks.map((block) => (
              <div key={block.title} className={cardClass}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-violet-400/70">
                  {block.eyebrow}
                </p>
                <h3 className="mt-3 text-lg font-medium uppercase tracking-wide text-white">
                  {block.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="scroll-mt-24 border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={`${sectionLabel} text-center`}>Use Cases</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            Unlimited reach for everyone, everywhere
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500">
            Whether you&apos;re a solo creator, growth team, or educator — turn
            long-form video into platform-native content that matches how each
            audience reads.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="bg-[#000000] p-8 transition-colors hover:bg-[#050505]"
              >
                <h3 className="text-lg font-medium uppercase tracking-widest text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-zinc-900 px-2 py-0.5 font-mono text-[9px] text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PulseFlow */}
      <section className="border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={`${sectionLabel} text-center`}>Why PulseFlow</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            Built for speed, quality, and scale
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div key={item.title} className={`${cardClass} p-5`}>
                <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform category deep-dive */}
      <section className="border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={sectionLabel}>Output Categories</p>
          <h2 className={`mt-3 ${sectionTitle}`}>
            A universe of platform-native formats
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-zinc-500">
            Each channel gets its own voice. Same transcript — three distinct,
            publish-ready outputs.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {platformCategories.map((cat) => (
              <div key={cat.id} className={cardClass}>
                <h3 className="text-base font-medium uppercase tracking-widest text-white">
                  {cat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {cat.description}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToDemo(cat.id as Platform)}
                  className="mt-5 font-mono text-[11px] text-zinc-400 transition-colors hover:text-white"
                >
                  {cat.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style showcase */}
      <section id="styles" className="scroll-mt-24 border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={sectionLabel}>Styles</p>
          <h2 className={`mt-3 ${sectionTitle}`}>
            Skip the blank page — pick a preset
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-zinc-500">
            Tone and format presets tailored for every vibe. Select on the
            dashboard before you generate — consistent branding with minimal
            effort.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {styleShowcase.map((style) => (
              <button
                key={style.name}
                type="button"
                onClick={() => {
                  setActiveStyle(style.name)
                  scrollToDemo()
                }}
                className="flex items-center justify-between rounded-lg border border-zinc-900 bg-[#050505] px-4 py-3 text-left transition-all hover:border-zinc-700"
              >
                <div>
                  <p className="font-mono text-[9px] uppercase text-zinc-600">
                    {style.category}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-300">{style.name}</p>
                </div>
                <span className="font-mono text-[9px] text-zinc-700">
                  PulseFlow
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section id="demo" className="scroll-mt-24 border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className={`${sectionLabel} text-center`}>Live Preview</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            See the output before you sign up
          </h2>
          {activeStyle && (
            <p className="mt-3 text-center font-mono text-[11px] text-zinc-500">
              Previewing style:{" "}
              <span className="text-zinc-300">{activeStyle}</span>
            </p>
          )}
          <div className="mt-10 rounded-2xl border border-violet-500/10 bg-[#050505]/80 p-6 shadow-[0_0_60px_-12px_rgba(139,92,246,0.2)] backdrop-blur-xl md:p-8">
            <div className="mb-6 space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500">
                YouTube URL
              </label>
              <div className="flex h-11 items-center rounded-lg border border-zinc-800 bg-[#020202] px-4 font-mono text-sm text-zinc-400">
                https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </div>
            </div>
            <Tabs
              value={activePlatform}
              onValueChange={(v) => setActivePlatform(v as Platform)}
              className="w-full"
            >
              <TabsList className="grid h-10 w-full grid-cols-3 border border-zinc-800 bg-[#09090b] p-1">
                <TabsTrigger
                  value="x"
                  className="rounded-md text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:bg-[#141414] data-[state=active]:text-white"
                >
                  X
                </TabsTrigger>
                <TabsTrigger
                  value="linkedin"
                  className="rounded-md text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:bg-[#141414] data-[state=active]:text-white"
                >
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger
                  value="telegram"
                  className="rounded-md text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:bg-[#141414] data-[state=active]:text-white"
                >
                  Telegram
                </TabsTrigger>
              </TabsList>
              {(["x", "linkedin", "telegram"] as const).map((platform) => (
                <TabsContent key={platform} value={platform} className="mt-4">
                  <div className="min-h-[220px] whitespace-pre-line rounded-lg border border-zinc-800 bg-[#020202] p-4 text-left text-sm leading-relaxed text-zinc-300">
                    {demoContent[platform]}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-7 text-sm font-medium text-black transition-all hover:bg-zinc-200"
            >
              Generate Your Own — Free
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={`${sectionLabel} text-center`}>How It Works</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            Three steps to every platform
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-[#000000] p-8 transition-colors hover:bg-[#050505]"
              >
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-violet-400/70">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-medium uppercase tracking-widest text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={`${sectionLabel} text-center`}>Testimonials</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            Trusted by creators who ship daily
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.author} className={cardClass}>
                <p className="text-sm leading-relaxed text-zinc-400">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 border-t border-zinc-900 pt-4">
                  <p className="text-sm text-zinc-300">{t.author}</p>
                  <p className="font-mono text-[10px] text-zinc-600">
                    {t.role}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Explore more */}
      <section className="border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={`${sectionLabel} text-center`}>Explore</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            Everything you need to start
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${cardClass} block hover:border-violet-500/20`}
              >
                <h3 className="text-sm font-medium uppercase tracking-wide text-white">
                  {link.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {link.description}
                </p>
                <span className="mt-4 inline-block font-mono text-[11px] text-zinc-400">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className={`${sectionLabel} text-center`}>Support</p>
          <h2 className={`mt-3 text-center ${sectionTitle}`}>
            Frequently asked questions
          </h2>
          <p className="mt-4 text-center text-sm text-zinc-500">
            Everything you need to know about PulseFlow. Can&apos;t find an
            answer?{" "}
            <Link href="/login" className="text-zinc-300 hover:text-white">
              Get in touch
            </Link>
          </p>
          <div className="mt-10 space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-zinc-900 bg-[#050505] open:border-zinc-800"
              >
                <summary className="cursor-pointer list-none px-5 py-4 text-sm text-zinc-300 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="font-mono text-zinc-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-zinc-900 px-5 py-4 text-sm leading-relaxed text-zinc-500">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-zinc-900 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className={sectionLabel}>Get Started</p>
          <h2 className={`mt-3 ${sectionTitle}`}>
            Starting with PulseFlow is easy, fast, and free
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-500">
            Ready to turn your next YouTube upload into a week of social content?
            Create a free account and generate your first outputs in under a
            minute.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-black transition-all hover:bg-zinc-200"
            >
              Create Free Account
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] px-8 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="text-sm font-semibold text-zinc-500">PulseFlow</span>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Terms
            </Link>
          </div>
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} PulseFlow
          </p>
        </div>
      </footer>
    </div>
  )
}
