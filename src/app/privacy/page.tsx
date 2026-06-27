import type { Metadata } from "next"
import Link from "next/link"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"

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
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
            <PulseFlowLogo size="xs" showWordmark />
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
        <p className="mt-2 text-sm text-zinc-500">Last updated: June 27, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-medium text-zinc-200">Overview</h2>
            <p className="mt-3">
              PulseFlow is an AI-powered SaaS platform that transforms YouTube
              videos into social media content. This policy explains what we
              collect, how we use it, and how we keep it secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Cookies and authentication
            </h2>
            <p className="mt-3">
              We use essential cookies and local storage to keep you signed in
              and to protect your account. These session cookies are required for
              authentication and are managed through Supabase Auth. We do not use
              third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Information we collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Account email and authentication data via Supabase
              </li>
              <li>
                YouTube URLs, generated content, credits, and optional settings
                (brand voice, Telegram channel)
              </li>
              <li>
                Payment metadata processed by Stripe (we never store full card
                numbers)
              </li>
              <li>
                Optional feedback you submit (rating, comment, optional contact)
              </li>
              <li>
                Limited technical metadata for abuse prevention (e.g. truncated IP
                address on feedback submissions)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Data minimization and retention
            </h2>
            <p className="mt-3">
              We collect only what is needed to run the product. YouTube URLs and
              generated content are stored to power your dashboard history.
              Feedback is retained for product improvement and may be deleted on
              request. Account data is removed when you delete your account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">Your rights</h2>
            <p className="mt-3">
              You may request access, correction, or deletion of your personal
              data. Contact us at the address below and we will respond within 30
              days where applicable under GDPR and similar laws.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Data security
            </h2>
            <p className="mt-3">
              User data is stored in Supabase with row-level security policies.
              Access to your profile, credits, and generation history is
              restricted to your authenticated session. API keys for AI and
              messaging services are kept server-side and are never exposed to
              the browser. We use HTTPS everywhere, validate and size-limit API
              requests, rate-limit abuse-prone endpoints, and return generic
              error messages to clients while logging details server-side.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">
              Third-party services
            </h2>
            <p className="mt-3">
              We use Supabase (auth and database), Stripe (payments), OpenRouter
              (AI generation), and Telegram (optional publishing). Each provider
              processes data under their own policies and our data agreements.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-zinc-200">Contact</h2>
            <p className="mt-3">
              Questions or data requests:{" "}
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
