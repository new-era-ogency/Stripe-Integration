import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | PulseFlow",
  description:
    "Terms of Service for PulseFlow, including credit usage, subscriptions, and AI generation policies.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm font-semibold text-white">
            PulseFlow
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: June 21, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Acceptance
            </h2>
            <p className="mt-3">
              By using PulseFlow, you agree to these Terms of Service. If you do
              not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">The service</h2>
            <p className="mt-3">
              PulseFlow uses artificial intelligence to generate social content
              from YouTube transcripts. You are responsible for reviewing output
              before publishing.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Credits and billing
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>One credit is consumed per successful AI generation.</li>
              <li>
                Subscriptions and credit packs are billed through Stripe.
              </li>
              <li>
                Credits are checked and deducted server-side before any AI
                request is processed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              No-refund policy
            </h2>
            <p className="mt-3">
              All AI generation purchases are non-refundable. Each generation
              instantly consumes third-party API compute costs (OpenRouter and
              related providers). Once a credit is used or a billing period is
              charged, we cannot reverse those costs. Contact{" "}
              <a
                href="mailto:privacy@pulseflow.app"
                className="text-violet-400 hover:text-violet-300"
              >
                privacy@pulseflow.app
              </a>{" "}
              only if you believe a charge was made in error.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Acceptable use
            </h2>
            <p className="mt-3">
              Do not abuse the service, attempt to bypass credit limits, scrape
              the platform, or submit unlawful content. We may suspend accounts
              that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Data and security
            </h2>
            <p className="mt-3">
              Account data is secured via Supabase authentication and
              row-level security. You must keep your login credentials
              confidential and notify us of unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">Contact</h2>
            <p className="mt-3">
              Questions about these terms:{" "}
              <a
                href="mailto:privacy@pulseflow.app"
                className="text-violet-400 hover:text-violet-300"
              >
                privacy@pulseflow.app
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
