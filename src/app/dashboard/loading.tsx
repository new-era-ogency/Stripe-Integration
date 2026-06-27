export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07),transparent_55%)]" />

      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="h-5 w-24 animate-pulse rounded-md bg-zinc-900" />
            <div className="flex gap-2">
              <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-900" />
              <div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-900" />
            </div>
          </div>
          <div className="flex gap-2 border-t border-zinc-800/80 py-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-9 w-20 animate-pulse rounded-lg bg-zinc-900"
              />
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <div className="h-[420px] animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950" />
            <div className="h-48 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950/40" />
            <div className="h-56 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950/40" />
          </div>
          <div className="hidden space-y-3 xl:block">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-950"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
