export const PRO_PLAN = {
  id: "pro" as const,
  name: "Pro",
  price: "€19",
  period: "per month",
  credits: "50 credits / month",
  description:
    "Deep Content Pack for creators who publish across X, LinkedIn, and Telegram.",
  features: [
    "50 generations per month",
    "Deep 4-part Content Pack",
    "LinkedIn articles + Shorts scripts",
    "Custom brand voice",
    "Generation history",
    "Telegram auto-publish",
  ],
  buttonLabel: "Upgrade to Pro",
  badge: "Most Popular",
}

export const PRO_MAX_PLAN = {
  id: "pro_max" as const,
  name: "Pro Max",
  price: "€49",
  period: "per month",
  credits: "200 credits / month",
  description:
    "Everything in Pro plus our Viral Shorts Finder — timestamp-based hook extraction.",
  features: [
    "200 generations per month",
    "Everything in Pro",
    "🔥 Viral Shorts Hooks extractor",
    "Timestamped clip windows + hook scores",
    "Ready-to-speak scripts + shot lists",
    "Premium AI model (Sonnet 4 class)",
  ],
  buttonLabel: "Go Pro Max",
  badge: "AI Content Factory",
}

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
