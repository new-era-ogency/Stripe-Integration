import { useId } from "react"
import { cn } from "@/lib/utils"

const sizeMap = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
} as const

type PulseFlowLogoProps = {
  size?: keyof typeof sizeMap | number
  showWordmark?: boolean
  wordmarkClassName?: string
  className?: string
  iconClassName?: string
}

export default function PulseFlowLogo({
  size = "sm",
  showWordmark = false,
  wordmarkClassName,
  className,
  iconClassName,
}: PulseFlowLogoProps) {
  const px = typeof size === "number" ? size : sizeMap[size]
  const gradId = useId()

  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
      aria-hidden={!showWordmark ? true : undefined}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", iconClassName)}
        role={showWordmark ? "img" : undefined}
        aria-label={showWordmark ? "PulseFlow" : undefined}
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="4"
            y1="4"
            x2="28"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6D28D9" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${gradId})`} />
        <path
          d="M8 21C8 14 12.5 10 16 16C19.5 22 24 18 24 11"
          stroke="#fff"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />
        <circle cx="9" cy="19" r="2.75" fill="#34D399" />
        <circle cx="16" cy="14.5" r="2.25" fill="#fff" />
        <circle cx="23" cy="19" r="2.75" fill="#DDD6FE" />
        <path
          d="M20.5 17.5L23 19L20.5 20.5"
          stroke="#DDD6FE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span
          className={cn(
            "text-sm font-bold tracking-tight text-white",
            wordmarkClassName
          )}
        >
          PulseFlow
        </span>
      ) : null}
    </span>
  )
}
