export type PlanId = "starter" | "pro"

export interface PlanConfig {
  priceId: string
  credits: number
}

const PLAN_DEFINITIONS: Record<PlanId, Omit<PlanConfig, "priceId">> = {
  starter: { credits: 20 },
  pro: { credits: 100 },
}

const PRICE_ENV_KEYS: Record<PlanId, string> = {
  starter: "STRIPE_PRICE_STARTER",
  pro: "STRIPE_PRICE_PRO",
}

export function getPlanConfig(plan: PlanId): PlanConfig | null {
  const priceId = process.env[PRICE_ENV_KEYS[plan]]

  if (!priceId) {
    return null
  }

  return {
    priceId,
    credits: PLAN_DEFINITIONS[plan].credits,
  }
}
