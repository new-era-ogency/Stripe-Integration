import Link from "next/link"

type AuthPageShellProps = {
  title: string
  subtitle: string
  backHref?: string
  backLabel?: string
  footer?: React.ReactNode
  children: React.ReactNode
}

export default function AuthPageShell({
  title,
  subtitle,
  backHref = "/",
  backLabel = "← Back to home",
  footer,
  children,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#000000] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
        >
          {backLabel}
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <div className="w-full rounded-2xl border border-violet-500/10 bg-[#050505]/80 p-8 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] backdrop-blur-xl">
            <div className="mb-8 text-center">
              <h1 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-xl font-black uppercase tracking-widest text-transparent">
                {title}
              </h1>
              <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                {subtitle}
              </p>
            </div>
            {children}
            {footer ? <div className="mt-6 text-center">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
