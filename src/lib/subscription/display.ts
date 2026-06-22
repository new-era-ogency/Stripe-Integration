import type { SubscriptionTier } from "@/lib/subscription/types"

export function getSubscriptionLabel(tier: SubscriptionTier): string {
  if (tier === "pro_max") return "Pro Max"
  if (tier === "pro") return "Pro"
  return "Starter"
}

export function getSubscriptionUpgradeHint(tier: SubscriptionTier): string | null {
  if (tier === "starter") return "Upgrade to Pro"
  if (tier === "pro") return "Upgrade to Pro Max"
  return null
}
