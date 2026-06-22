export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07),transparent_55%)]" />

      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="h-5 w-24 animate-pulse rounded-md bg-zinc-900" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-900" />
            <div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-900" />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-md bg-zinc-900" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-zinc-900/80" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-900" />
              <div className="mt-3 h-7 w-32 animate-pulse rounded bg-zinc-900" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-900/70" />
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6 space-y-2">
            <div className="h-5 w-36 animate-pulse rounded bg-zinc-900" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-zinc-900/80" />
          </div>
          <div className="mb-6 h-11 w-full animate-pulse rounded-lg bg-zinc-900" />
          <div className="mb-6 grid gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50"
              />
            ))}
          </div>
          <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-900" />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="h-5 w-48 animate-pulse rounded bg-zinc-900" />
          <div className="mt-4 space-y-3">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
