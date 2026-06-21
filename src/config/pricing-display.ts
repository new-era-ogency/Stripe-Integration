export const STARTER_PLAN = {
  id: "starter" as const,
  name: "Starter",
  price: "€19",
  period: "per month",
  credits: "20 credits",
  description: "Everything you need to turn YouTube videos into multi-platform content.",
  features: [
    "20 content generations",
    "Twitter/X, LinkedIn & Telegram outputs",
    "YouTube transcript extraction",
    "Copy to clipboard",
  ],
  buttonLabel: "Buy Credits",
  badge: "Starter Pack",
}

export type PlanId = typeof STARTER_PLAN.id

export function isStarterPriceConfigured(starterPriceId: string | undefined): boolean {
  const id = starterPriceId?.trim()
  return Boolean(id && id.startsWith("price_"))
}
