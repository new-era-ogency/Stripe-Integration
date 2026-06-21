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
              1. Acceptance of terms
            </h2>
            <p className="mt-3">
              By accessing or using PulseFlow, you agree to these Terms of
              Service. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              2. Service description
            </h2>
            <p className="mt-3">
              PulseFlow is a software-as-a-service platform that uses artificial
              intelligence to generate social media content from YouTube video
              transcripts. Output quality may vary and should be reviewed before
              publishing.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              3. Accounts and eligibility
            </h2>
            <p className="mt-3">
              You must provide accurate account information and keep your
              credentials secure. You are responsible for all activity under
              your account. You must be at least 18 years old to use paid
              features.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              4. Credits and subscriptions
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Content generation consumes credits. One credit is deducted per
                successful generation unless otherwise stated.
              </li>
              <li>
                Paid plans and credit packs are billed through Stripe on a
                recurring or one-time basis as displayed at checkout.
              </li>
              <li>
                Credits do not roll over unless explicitly stated in your plan.
              </li>
              <li>
                We may modify pricing or plan features with reasonable notice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              5. Refund policy
            </h2>
            <p className="mt-3">
              All sales are final. Because AI generations are delivered
              instantly and consume compute resources, we do not offer refunds
              for used or unused credits, partial billing periods, or
              subscription charges once payment has been processed. Contact
              support if you believe a charge was made in error.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              6. Acceptable use
            </h2>
            <p className="mt-3">
              You agree not to misuse the service, including by submitting
              unlawful content, attempting to reverse-engineer the platform,
              reselling access without authorization, or using automated systems
              to abuse rate limits.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              7. Intellectual property
            </h2>
            <p className="mt-3">
              You retain ownership of content you input. Subject to these terms,
              you may use AI-generated output for your own commercial or
              personal purposes. PulseFlow retains all rights to the platform,
              brand, and underlying technology.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              8. Disclaimer and limitation of liability
            </h2>
            <p className="mt-3">
              The service is provided &quot;as is&quot; without warranties of
              any kind. PulseFlow is not liable for indirect, incidental, or
              consequential damages arising from your use of generated content or
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              9. Contact
            </h2>
            <p className="mt-3">
              Questions about these terms? Email{" "}
              <a
                href="mailto:legal@pulseflow.app"
                className="text-violet-400 hover:text-violet-300"
              >
                legal@pulseflow.app
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-12 border-t border-zinc-800 pt-8 text-sm text-zinc-500">
          <Link href="/privacy" className="text-zinc-400 hover:text-white">
            Privacy Policy
          </Link>
        </footer>
      </article>
    </div>
  )
}
