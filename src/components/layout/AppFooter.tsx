import Link from "next/link"
import { Code2, ExternalLink } from "lucide-react"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import { brandIdentity, footerLinks } from "@/lib/landing-content"

function FooterLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className =
    "inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-300"

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ExternalLink className="size-3 opacity-60" />
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export default function AppFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="flex items-center gap-2 text-sm font-bold text-white">
              <PulseFlowLogo size="sm" showWordmark />
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              {brandIdentity.tagline} {brandIdentity.supportLine}
            </p>
            <a
              href={footerLinks.developers[1].href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex size-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
              aria-label="View on GitHub"
            >
              <Code2 className="size-4" />
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Developers
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    label={link.label}
                    external={"external" in link ? link.external : false}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-900 pt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.resources.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-6 sm:flex-row">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} PulseFlow. Built by an indie developer.
          </p>
          <a
            href="mailto:privacy@pulseflow.app"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
          >
            privacy@pulseflow.app
          </a>
        </div>
      </div>
    </footer>
  )
}
