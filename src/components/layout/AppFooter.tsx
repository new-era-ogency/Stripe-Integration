import Link from "next/link"

export default function AppFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} PulseFlow
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Terms of Service
          </Link>
          <a
            href="mailto:privacy@pulseflow.app"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            privacy@pulseflow.app
          </a>
        </nav>
      </div>
    </footer>
  )
}
