import Link from "next/link"
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { dash } from "@/lib/dashboard/theme-classes"

type DashboardQuickTryCardProps = {
  className?: string
}

export default function DashboardQuickTryCard({
  className = "",
}: DashboardQuickTryCardProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-violet-500/25 bg-violet-500/5 p-5 light:border-violet-300 light:bg-violet-50/40 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-300 light:bg-violet-100 light:text-violet-700">
          <PlayCircle className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${dash.heading} light:text-violet-950`}>
            Not ready to sign in?
          </p>
          <p className={`mt-1 text-sm ${dash.body}`}>
            Try the live homepage preview first — paste a YouTube link and see a
            thread in seconds. No account required.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-4 h-10 rounded-xl border-violet-500/30 bg-transparent text-violet-200 hover:bg-violet-500/10 hover:text-white light:border-violet-400 light:text-violet-800 light:hover:bg-violet-100 light:hover:text-violet-950"
          >
            <Link href="/#trial-demo">
              <Sparkles className="size-4" />
              Open live preview
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
