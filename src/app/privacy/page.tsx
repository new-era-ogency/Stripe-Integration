import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | PulseFlow",
  description:
    "How PulseFlow collects, uses, and protects your data when you use our AI content generation service.",
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: June 21, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-medium text-zinc-200">
              1. Overview
            </h2>
            <p className="mt-3">
              PulseFlow (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides
              an AI-powered SaaS platform that transforms YouTube videos into
              social media content. This Privacy Policy explains how we collect,
              use, and safeguard information when you use our website and
              services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              2. Information we collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-zinc-300">Account information:</strong>{" "}
                When you sign up, we collect your email address and basic
                authentication data through our identity provider (Supabase).
              </li>
              <li>
                <strong className="text-zinc-300">Usage data:</strong> YouTube
                URLs you submit, generated content, credit balance, subscription
                status, and optional settings such as brand voice or Telegram
                channel configuration.
              </li>
              <li>
                <strong className="text-zinc-300">Payment information:</strong>{" "}
                Payments are processed by Stripe. We do not store full credit
                card numbers on our servers.
              </li>
              <li>
                <strong className="text-zinc-300">Technical data:</strong>{" "}
                Standard logs such as IP address, browser type, and pages visited
                may be collected for security and analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              3. How we use your information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To provide, operate, and improve the PulseFlow service</li>
              <li>To process AI content generation requests</li>
              <li>To manage credits, subscriptions, and billing</li>
              <li>To communicate service updates and support responses</li>
              <li>To detect fraud, abuse, and security incidents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              4. Third-party services
            </h2>
            <p className="mt-3">
              We use trusted third parties to deliver our service, including
              Supabase (authentication and database), Stripe (payments),
              OpenRouter (AI generation), and Telegram (optional publishing).
              These providers process data according to their own privacy policies
              and our agreements with them.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              5. Data retention
            </h2>
            <p className="mt-3">
              We retain account and generation history for as long as your
              account is active or as needed to provide the service. You may
              request deletion of your account by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              6. Your rights
            </h2>
            <p className="mt-3">
              Depending on your location, you may have the right to access,
              correct, delete, or export your personal data. Contact us at{" "}
              <a
                href="mailto:privacy@pulseflow.app"
                className="text-violet-400 hover:text-violet-300"
              >
                privacy@pulseflow.app
              </a>{" "}
              to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              7. Contact
            </h2>
            <p className="mt-3">
              Questions about this policy? Email{" "}
              <a
                href="mailto:privacy@pulseflow.app"
                className="text-violet-400 hover:text-violet-300"
              >
                privacy@pulseflow.app
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-12 border-t border-zinc-800 pt-8 text-sm text-zinc-500">
          <Link href="/terms" className="text-zinc-400 hover:text-white">
            Terms of Service
          </Link>
        </footer>
      </article>
    </div>
  )
}
