"use client"

import Link from "next/link"
import { Flame, Loader2, Sparkles, Zap } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import {
  getSubscriptionLabel,
  getSubscriptionUpgradeHint,
} from "@/lib/subscription/display"
import type { SubscriptionTier } from "@/lib/subscription"
import { cn } from "@/lib/utils"

type SubscriptionTierBadgeProps = {
  tier?: SubscriptionTier | null
  isLoading?: boolean
  isGuest?: boolean
  className?: string
  /** When true, always links to /pricing (upgrade path). */
  linkToPricing?: boolean
}

const tierStyles: Record<
  SubscriptionTier,
  { className: string; icon: typeof Zap }
> = {
  starter: {
    className:
      "border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900",
    icon: Zap,
  },
  pro: {
    className:
      "border-violet-500/40 bg-violet-500/10 text-violet-200 hover:border-violet-400/50 hover:bg-violet-500/15 shadow-[0_0_20px_-8px_rgba(139,92,246,0.5)]",
    icon: Sparkles,
  },
  pro_max: {
    className:
      "border-orange-500/40 bg-gradient-to-r from-orange-500/15 to-rose-500/15 text-orange-100 hover:border-orange-400/50 hover:from-orange-500/20 hover:to-rose-500/20 shadow-[0_0_22px_-8px_rgba(249,115,22,0.55)]",
    icon: Flame,
  },
}

export default function SubscriptionTierBadge({
  tier: tierProp,
  isLoading: isLoadingProp,
  isGuest = false,
  className,
  linkToPricing = true,
}: SubscriptionTierBadgeProps) {
  const subscription = useSubscription()

  const isLoading =
    isLoadingProp ?? (tierProp === undefined ? subscription.isLoading : false)
  const tier =
    tierProp ??
    (subscription.isAuthenticated ? subscription.tier : ("starter" as const))

  if (isGuest) {
    return null
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "h-9 w-[7.5rem] animate-pulse rounded-full bg-zinc-900",
          className
        )}
        aria-hidden
      />
    )
  }

  const resolvedTier = tier ?? "starter"
  const label = getSubscriptionLabel(resolvedTier)
  const upgradeHint = getSubscriptionUpgradeHint(resolvedTier)
  const { className: tierClassName, icon: Icon } = tierStyles[resolvedTier]

  const content = (
    <>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="font-semibold">{label}</span>
      {upgradeHint ? (
        <span className="hidden text-[10px] font-normal opacity-70 sm:inline">
          · {upgradeHint}
        </span>
      ) : null}
    </>
  )

  const baseClassName = cn(
    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[11px] uppercase tracking-wider transition-all",
    tierClassName,
    className
  )

  if (linkToPricing && resolvedTier !== "pro_max") {
    return (
      <Link
        href="/pricing"
        className={baseClassName}
        title={upgradeHint ?? `${label} plan`}
      >
        {content}
      </Link>
    )
  }

  if (linkToPricing && resolvedTier === "pro_max") {
    return (
      <Link
        href="/dashboard"
        className={baseClassName}
        title={`${label} plan — active`}
      >
        {content}
      </Link>
    )
  }

  return (
    <span className={baseClassName} title={`${label} plan`}>
      {content}
    </span>
  )
}

export function SubscriptionTierBadgeLoading() {
  return <Loader2 className="size-3.5 animate-spin text-zinc-500" />
}
