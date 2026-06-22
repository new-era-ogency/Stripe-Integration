export type { PlanId } from "@/config/pricing-display"
export { STARTER_PLAN, isStarterPriceConfigured } from "@/config/pricing-display"

import type { PaidPlanId, SubscriptionTier } from "@/lib/subscription/types"

export interface PlanConfig {
  priceId: string
  credits: number
}

export interface SubscriptionPlanConfig extends PlanConfig {
  id: PaidPlanId
  tier: Exclude<SubscriptionTier, "starter">
  name: string
  envVar: string
}

const PRO_MONTHLY_CREDITS = 50
const PRO_MAX_MONTHLY_CREDITS = 200

function normalizePriceId(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/^['"]|['"]$/g, "")
  return trimmed || undefined
}

function validatePriceId(priceId: string, envVar: string): boolean {
  if (!priceId.startsWith("price_")) {
    console.error(
      `${envVar} must be a price_... ID, got "${priceId.slice(0, 12)}..."`
    )
    return false
  }

  return true
}

function buildPlanConfig(
  plan: SubscriptionPlanConfig,
  priceId: string | undefined
): SubscriptionPlanConfig | null {
  if (!priceId) {
    return null
  }

  if (!validatePriceId(priceId, plan.envVar)) {
    return null
  }

  return {
    ...plan,
    priceId,
  }
}

export const SUBSCRIPTION_PLANS: Record<PaidPlanId, Omit<SubscriptionPlanConfig, "priceId">> = {
  pro: {
    id: "pro",
    tier: "pro",
    name: "Pro",
    envVar: "STRIPE_PRICE_PRO",
    credits: PRO_MONTHLY_CREDITS,
  },
  pro_max: {
    id: "pro_max",
    tier: "pro_max",
    name: "Pro Max",
    envVar: "STRIPE_PRICE_PRO_MAX",
    credits: PRO_MAX_MONTHLY_CREDITS,
  },
}

export function getProPriceId(): string | undefined {
  return normalizePriceId(process.env.STRIPE_PRICE_PRO)
}

export function getProMaxPriceId(): string | undefined {
  return normalizePriceId(process.env.STRIPE_PRICE_PRO_MAX)
}

/** @deprecated Use getProPriceId — legacy alias only. */
export function getStarterPriceId(): string | undefined {
  return getProPriceId()
}

export function getProPlanConfig(): SubscriptionPlanConfig | null {
  return buildPlanConfig(
    { ...SUBSCRIPTION_PLANS.pro, priceId: "" },
    getProPriceId()
  )
}

export function getProMaxPlanConfig(): SubscriptionPlanConfig | null {
  return buildPlanConfig(
    { ...SUBSCRIPTION_PLANS.pro_max, priceId: "" },
    getProMaxPriceId()
  )
}

export function getSubscriptionPlanConfig(
  planId: PaidPlanId
): SubscriptionPlanConfig | null {
  if (planId === "pro_max") {
    return getProMaxPlanConfig()
  }

  return getProPlanConfig()
}

export function getAllSubscriptionPlanConfigs(): SubscriptionPlanConfig[] {
  return [getProPlanConfig(), getProMaxPlanConfig()].filter(
    (plan): plan is SubscriptionPlanConfig => plan !== null
  )
}

export function resolvePlanFromPriceId(
  priceId: string | null | undefined
): SubscriptionPlanConfig | null {
  const normalized = normalizePriceId(priceId ?? undefined)
  if (!normalized) {
    return null
  }

  const pro = getProPlanConfig()
  if (pro?.priceId === normalized) {
    return pro
  }

  const proMax = getProMaxPlanConfig()
  if (proMax?.priceId === normalized) {
    return proMax
  }

  return null
}

export function isPaidPlanConfigured(planId: PaidPlanId): boolean {
  return getSubscriptionPlanConfig(planId) !== null
}

/** @deprecated Use getProPlanConfig — legacy alias for Pro checkout. */
export function getStarterPlanConfig(): PlanConfig | null {
  const pro = getProPlanConfig()
  if (!pro) {
    return null
  }

  return {
    priceId: pro.priceId,
    credits: pro.credits,
  }
}

/** @deprecated Use getSubscriptionPlanConfig */
export function getPlanConfig(_plan: "starter" = "starter"): PlanConfig | null {
  return getStarterPlanConfig()
}

export type CheckoutPlanId = PaidPlanId | "starter"
export function resolveCheckoutPlan(
  planId: CheckoutPlanId
): SubscriptionPlanConfig | null {
  if (planId === "pro_max") {
    return getProMaxPlanConfig()
  }

  if (planId === "pro") {
    return getProPlanConfig()
  }

  return getProPlanConfig()
}

export function getMonthlyCreditsForTier(tier: SubscriptionTier): number {
  if (tier === "pro_max") {
    return PRO_MAX_MONTHLY_CREDITS
  }

  if (tier === "pro") {
    return PRO_MONTHLY_CREDITS
  }

  return 0
}

export type CheckoutPlanRequest = {
  plan?: CheckoutPlanId
  tier?: PaidPlanId
  priceId?: string
}

export function resolveCheckoutPlanFromRequest(
  request: CheckoutPlanRequest
): SubscriptionPlanConfig | null {
  const normalizedPriceId = normalizePriceId(request.priceId)

  if (normalizedPriceId) {
    const fromPrice = resolvePlanFromPriceId(normalizedPriceId)
    if (fromPrice) {
      return fromPrice
    }

    console.error(
      `[plans] Unknown checkout priceId "${normalizedPriceId.slice(0, 16)}..."`
    )
    return null
  }

  const planId = request.plan ?? request.tier ?? "pro"
  return resolveCheckoutPlan(planId)
}
