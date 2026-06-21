"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Loader2, Sparkles, Zap } from "lucide-react"
import { STARTER_PLAN } from "@/config/pricing-display"

export default function PricingPlans() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(() =>
    searchParams.get("checkout") === "canceled"
      ? "Checkout was canceled. You can try again when you're ready."
      : null
  )

  const handleCheckout = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter" }),
      })

      const data = (await response.json()) as {
        url?: string
        error?: string
      }

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok || !data.url) {
        setError(data.error ?? "Unable to start checkout. Please try again.")
        return
      }

      window.location.href = data.url
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const plan = STARTER_PLAN

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(99,102,241,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto max-w-lg px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 backdrop-blur-md">
            <Sparkles className="size-3.5 text-blue-400" />
            PulseFlow Pricing
          </div>
          <h1 className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            Get started with Starter
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400">
            One pack, 20 generations. Turn YouTube videos into posts for X,
            LinkedIn, and Telegram.
          </p>
        </motion.div>

        {error ? (
          <motion.div
            role="alert"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-100/90 backdrop-blur-md"
          >
            {error}
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.25 } }}
          className="relative mx-auto max-w-md"
        >
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 opacity-80 blur-sm" />

          <div className="relative flex flex-col rounded-2xl border border-white/[0.12] bg-white/[0.03] p-6 shadow-[0_0_60px_-12px_rgba(59,130,246,0.45)] backdrop-blur-md md:p-8">
            <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-200">
              <Zap className="size-3 fill-blue-400 text-blue-400" />
              {plan.badge}
            </div>

            <div className="mb-2">
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
            </div>

            <div className="my-6 border-b border-white/[0.06] pb-6">
              <div className="flex items-end justify-center gap-1">
                <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
                  {plan.price}
                </span>
              </div>
              <p className="mt-2 text-center text-xs uppercase tracking-widest text-slate-500">
                {plan.period}
              </p>
              <p className="mt-3 text-center text-sm font-medium text-emerald-400">
                {plan.credits}
              </p>
            </div>

            <ul className="mb-8 space-y-3.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check
                      className="size-3 text-emerald-400"
                      strokeWidth={2.5}
                    />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              type="button"
              whileHover={!isLoading ? { scale: 1.02 } : undefined}
              whileTap={!isLoading ? { scale: 0.98 } : undefined}
              disabled={isLoading}
              onClick={handleCheckout}
              className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.75)] disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting to Stripe…
                </>
              ) : (
                plan.buttonLabel
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center text-xs text-slate-600"
        >
          Secure checkout powered by Stripe · Credits applied instantly after
          payment
        </motion.p>
      </div>
    </div>
  )
}
