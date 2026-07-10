import { cn } from "@/lib/utils"

type NavCountBadgeProps = {
  count: number
  className?: string
}

export default function NavCountBadge({ count, className }: NavCountBadgeProps) {
  if (count <= 0) {
    return null
  }

  const label = count > 99 ? "99+" : String(count)

  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white",
        className
      )}
      aria-label={`${count} unseen`}
    >
      {label}
    </span>
  )
}
