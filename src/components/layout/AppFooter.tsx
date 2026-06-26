import Link from "next/link"
import { Code2, Share2 } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Demo", href: "/#demo" },
  ],
  resources: [
    { label: "Documentation", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

export default function AppFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white">
              PulseFlow
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              Turn YouTube videos into platform-native social content with
              secure Stripe billing and AI-powered generation.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
                aria-label="Share on social"
              >
                <Share2 className="size-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
                aria-label="View source code"
              >
                <Code2 className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Product
            </p>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Resources
            </p>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-6 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} PulseFlow. All rights reserved.
          </p>
          <a
            href="mailto:privacy@pulseflow.app"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            privacy@pulseflow.app
          </a>
        </div>
      </div>
    </footer>
  )
}
