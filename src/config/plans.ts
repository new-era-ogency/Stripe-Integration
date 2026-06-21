export type { PlanId } from "@/config/pricing-display"
export { STARTER_PLAN, isStarterPriceConfigured } from "@/config/pricing-display"

export interface PlanConfig {
  priceId: string
  credits: number
}

const STARTER_CREDITS = 20

function normalizePriceId(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/^['"]|['"]$/g, "")
  return trimmed || undefined
}

export function getStarterPriceId(): string | undefined {
  return normalizePriceId(process.env.STRIPE_PRICE_STARTER)
}

export function getStarterPlanConfig(): PlanConfig | null {
  const priceId = getStarterPriceId()

  if (!priceId) {
    return null
  }

  if (!priceId.startsWith("price_")) {
    console.error(
      `STRIPE_PRICE_STARTER must be a price_... ID, got "${priceId.slice(0, 12)}..."`
    )
    return null
  }

  return {
    priceId,
    credits: STARTER_CREDITS,
  }
}

/** @deprecated Use getStarterPlanConfig */
export function getPlanConfig(_plan: "starter" = "starter"): PlanConfig | null {
  return getStarterPlanConfig()
}
