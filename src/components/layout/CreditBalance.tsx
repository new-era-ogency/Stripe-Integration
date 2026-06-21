"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type CreditBalanceProps = {
  credits?: number | null
  loading?: boolean
  className?: string
  linkToPricing?: boolean
}

export default function CreditBalance({
  credits: creditsProp,
  loading: loadingProp,
  className = "",
  linkToPricing = true,
}: CreditBalanceProps) {
  const [credits, setCredits] = useState<number | null>(creditsProp ?? null)
  const [loading, setLoading] = useState(loadingProp ?? creditsProp === undefined)

  useEffect(() => {
    if (creditsProp !== undefined) {
      setCredits(creditsProp)
      setLoading(loadingProp ?? false)
      return
    }

    let cancelled = false

    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/user-data")
        if (!response.ok) {
          if (!cancelled) {
            setCredits(null)
            setLoading(false)
          }
          return
        }

        const data = (await response.json()) as { credits: number }
        if (!cancelled) {
          setCredits(data.credits)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setCredits(null)
          setLoading(false)
        }
      }
    }

    fetchCredits()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchCredits()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [creditsProp, loadingProp])

  const content = loading ? (
    <span className="inline-block h-4 w-16 animate-pulse rounded bg-zinc-800" />
  ) : (
    <span>Credits: {credits ?? "—"}</span>
  )

  const baseClassName = `rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 ${className}`

  if (linkToPricing) {
    return (
      <Link
        href="/pricing"
        className={`${baseClassName} transition-colors hover:border-violet-500/30 hover:text-white`}
        title="View pricing plans"
      >
        {content}
      </Link>
    )
  }

  return <div className={baseClassName}>{content}</div>
}
