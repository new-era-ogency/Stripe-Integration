"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type DashboardCheckoutSyncProps = {
  onCreditsUpdated: (credits: number) => void
  onRefresh: () => Promise<void>
}

export default function DashboardCheckoutSync({
  onCreditsUpdated,
  onRefresh,
}: DashboardCheckoutSyncProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout")
    const sessionId = searchParams.get("session_id")

    if (checkoutStatus !== "success" || !sessionId) {
      return
    }

    let cancelled = false

    const confirmPurchase = async () => {
      try {
        const response = await fetch("/api/stripe/confirm-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          await onRefresh()
          return
        }

        const data = (await response.json()) as { credits?: number }
        if (!cancelled) {
          if (typeof data.credits === "number") {
            onCreditsUpdated(data.credits)
          }
          await onRefresh()
        }
      } catch (error) {
        console.error("Failed to confirm checkout:", error)
      } finally {
        if (!cancelled) {
          router.replace("/dashboard")
        }
      }
    }

    confirmPurchase()

    return () => {
      cancelled = true
    }
  }, [onCreditsUpdated, onRefresh, router, searchParams])

  return null
}
