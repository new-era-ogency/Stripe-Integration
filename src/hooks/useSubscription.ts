"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  getSubscriptionFlags,
  toSubscriptionRecord,
  type SubscriptionFlags,
  type SubscriptionRecord,
} from "@/lib/subscription"

type UseSubscriptionResult = SubscriptionFlags & {
  record: SubscriptionRecord | null
  credits: number | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  refresh: () => Promise<void>
}

const SUBSCRIPTION_SELECT =
  "tier, credits, stripe_customer_id, stripe_subscription_id, stripe_price_id, subscription_status, subscription_period_end"

export function useSubscription(): UseSubscriptionResult {
  const supabase = useMemo(() => createClient(), [])
  const [record, setRecord] = useState<SubscriptionRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!user) {
        setIsAuthenticated(false)
        setRecord(null)
        return
      }

      setIsAuthenticated(true)

      const { data, error: profileError } = await supabase
        .from("users")
        .select(SUBSCRIPTION_SELECT)
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) {
        throw profileError
      }

      if (!data) {
        setRecord({
          tier: "starter",
          credits: 0,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          subscriptionStatus: null,
          subscriptionPeriodEnd: null,
        })
        return
      }

      setRecord(toSubscriptionRecord(data))
    } catch (caught) {
      setRecord(null)
      setError(
        caught instanceof Error
          ? caught.message
          : "Failed to load subscription state"
      )
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    void refresh()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event) => {
      void refresh()
    })

    return () => subscription.unsubscribe()
  }, [refresh, supabase.auth])

  const flags = getSubscriptionFlags(
    record?.tier ?? "starter",
    record?.subscriptionStatus ?? null
  )

  return {
    ...flags,
    record,
    credits: record?.credits ?? null,
    isLoading,
    isAuthenticated,
    error,
    refresh,
  }
}
