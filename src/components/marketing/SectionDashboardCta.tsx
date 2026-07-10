import DashboardCtaLink from "@/components/marketing/DashboardCtaLink"

type SectionDashboardCtaProps = {
  title?: string
  description?: string
}

export default function SectionDashboardCta({
  title = "Ready to try it on a real video?",
  description =
    "Open the free dashboard — paste a YouTube link and generate X, LinkedIn, and Telegram posts in one run.",
}: SectionDashboardCtaProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/[0.08] via-zinc-950/50 to-transparent p-6 sm:flex-row sm:items-center md:p-8">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{description}</p>
      </div>
      <DashboardCtaLink variant="primary" className="w-full shrink-0 sm:w-auto" />
    </div>
  )
}
