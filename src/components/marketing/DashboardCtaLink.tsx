import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import { ctaStrategy } from "@/lib/landing-content"
import { BTN_PRIMARY, BTN_SECONDARY } from "@/lib/landing-styles"
import { cn } from "@/lib/utils"

type DashboardCtaVariant = "primary" | "secondary" | "nav" | "compact" | "ghost"

type DashboardCtaLinkProps = {
  variant?: DashboardCtaVariant
  label?: string
  className?: string
  showIcon?: boolean
}

const variantClasses: Record<DashboardCtaVariant, string> = {
  primary: BTN_PRIMARY,
  secondary: BTN_SECONDARY,
  nav: "inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(139,92,246,0.55)] transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_6px_32px_-4px_rgba(139,92,246,0.65)] active:scale-[0.98]",
  compact:
    "inline-flex items-center gap-1.5 rounded-lg border border-violet-500/35 bg-violet-500/15 px-3.5 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:border-violet-400/50 hover:bg-violet-500/25",
  ghost:
    "inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition-colors hover:text-violet-200",
}

export default function DashboardCtaLink({
  variant = "primary",
  label = ctaStrategy.dashboard.label,
  className,
  showIcon = variant === "nav" || variant === "compact",
}: DashboardCtaLinkProps) {
  const isPrimary = variant === "primary"

  return (
    <Link
      href={ctaStrategy.dashboard.href}
      className={cn(
        variantClasses[variant],
        isPrimary && "group",
        className
      )}
    >
      {showIcon ? (
        <LayoutDashboard
          className={cn(
            "size-4",
            variant === "nav" ? "mr-1.5" : "mr-2",
            variant === "compact" && "mr-1.5 size-3.5"
          )}
        />
      ) : null}
      {label}
      {isPrimary || variant === "ghost" ? (
        <ArrowRight
          className={cn(
            "size-4",
            isPrimary && "ml-2 transition-transform duration-200 group-hover:translate-x-1",
            variant === "ghost" && "size-3.5"
          )}
        />
      ) : null}
    </Link>
  )
}
