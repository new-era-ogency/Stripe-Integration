export const useCaseFlows = [
  {
    title: "Stripe checkout",
    nodes: ["Stripe payment", "Webhook", "Slack message", "Database update"],
  },
  {
    title: "User onboarding",
    nodes: ["Signup", "Onboarding email", "CRM sync"],
  },
  {
    title: "API automation",
    nodes: ["API event", "Automation chain", "Notification"],
  },
  {
    title: "Failed payment recovery",
    nodes: ["Payment failed", "Retry email", "Update subscription"],
  },
  {
    title: "Cross-tool sync",
    nodes: ["Notion update", "Slack alert", "Telegram notify"],
  },
] as const

export const jobBlocks = [
  {
    title: "Trigger workflows from Stripe events",
    outcome: "Checkout, subscriptions, and invoices — without custom webhook servers.",
    icon: "stripe" as const,
  },
  {
    title: "Build API chains without backend code",
    outcome: "Chain HTTP calls, transforms, and responses in one visual flow.",
    icon: "api" as const,
  },
  {
    title: "Handle incoming webhooks",
    outcome: "Validate payloads, route events, and fan out to multiple tools.",
    icon: "webhook" as const,
  },
  {
    title: "Automate user onboarding",
    outcome: "Signup → welcome email → CRM entry → Slack ping in one pass.",
    icon: "onboarding" as const,
  },
  {
    title: "Sync data across tools",
    outcome: "Keep Notion, Slack, Stripe, and Supabase in step automatically.",
    icon: "sync" as const,
  },
  {
    title: "Connect Notion, Slack, and Stripe",
    outcome: "18 integrations supported — add steps without redeploying code.",
    icon: "integrations" as const,
  },
] as const

export const steps = [
  { step: "1", title: "Connect tools", icon: "plug" as const },
  { step: "2", title: "Build workflow", icon: "workflow" as const },
  { step: "3", title: "Run automation", icon: "zap" as const },
] as const

export const proofLoop = {
  headline:
    "Indie devs and small teams use PulseFlow to replace backend glue — Stripe automations, onboarding flows, and API chains that used to take days.",
  examples: [
    {
      title: "Stripe automations",
      description: "Payment succeeds → user created → email sent. No Express route.",
      nodes: ["Stripe", "Webhook", "Email", "Database"],
    },
    {
      title: "Onboarding flows",
      description: "New signup triggers CRM + Slack in seconds, not a sprint ticket.",
      nodes: ["Signup", "Email", "CRM", "Slack"],
    },
    {
      title: "API workflows",
      description: "Incoming events fan out through a chain — change steps without redeploying.",
      nodes: ["API event", "Validate", "Chain", "Notify"],
    },
  ],
} as const

export const pricingAnchors = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Start building. 7-day trial with credits included.",
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€19",
    period: "/mo",
    description: "50 workflow runs/month. Stripe + API chains + Telegram publish.",
    cta: "Get Pro",
    badge: "Most popular",
    highlighted: true,
  },
  {
    name: "Team",
    price: "€49",
    period: "/mo",
    description: "200 runs/month. Everything in Pro + viral shorts finder.",
    cta: "Go Team",
    highlighted: false,
  },
] as const

export const credibility = {
  stats: [
    { value: "120+", label: "workflows created" },
    { value: "40+", label: "active beta users" },
    { value: "18", label: "integrations supported" },
    { value: "v0.4", label: "shipped this week" },
  ],
  tagline: "Used for Stripe automations, onboarding, and API workflows.",
  releaseNote: "v0.4 shipped Jun 2026 — Pro Max, viral shorts, trial extensions.",
  builderNote: "Built by an indie developer. Shipping weekly.",
  githubUrl: "https://github.com/new-era-ogency/Stripe-Integration",
  docsUrl: "/#how-it-works",
} as const

export const techStack = [
  "Stripe",
  "Supabase",
  "Slack",
  "Notion",
  "Telegram",
  "OpenRouter",
  "Next.js",
]

export const changelog = [
  {
    date: "Jun 2026",
    version: "0.4",
    title: "Pro Max + Viral Shorts Finder",
    items: [
      "Pro Max tier with timestamped hook extraction",
      "Stripe checkout for Pro and Pro Max",
      "Trial extensions via share actions",
    ],
  },
  {
    date: "Jun 2026",
    version: "0.3",
    title: "Auth & usernames",
    items: [
      "Separate signup and login flows",
      "Required username for new accounts",
      "OAuth profile completion",
    ],
  },
  {
    date: "May 2026",
    version: "0.2",
    title: "Multi-platform output",
    items: [
      "Parallel X, LinkedIn, and Telegram generation",
      "Generation history saved per account",
      "Brand voice setting for Pro users",
    ],
  },
  {
    date: "Apr 2026",
    version: "0.1",
    title: "First public build",
    items: [
      "YouTube transcript → social drafts",
      "Credit-based free tier",
      "Dashboard with copy-to-clipboard",
    ],
  },
]

export const faqs = [
  {
    q: "Do I need coding skills?",
    a: "No. Connect your tools, add steps to a flow, and run. You configure triggers and actions — PulseFlow handles the backend logic.",
  },
  {
    q: "Does it work with Stripe?",
    a: "Yes. Checkout, subscription, and invoice webhooks are built in. Payment events can trigger user creation, emails, and database updates automatically.",
  },
  {
    q: "Can I run workflows in real time?",
    a: "Yes. Events trigger flows immediately — typically under a few seconds from webhook to completion.",
  },
  {
    q: "Is this production-ready?",
    a: "Core flows — Stripe billing, auth, and workflow execution — are live with early users on v0.4. Check the changelog for weekly shipping cadence.",
  },
  {
    q: "What integrations exist?",
    a: "Stripe, Supabase, Telegram, and OpenRouter are live today. Slack, Notion, and more are rolling out — see the GitHub roadmap.",
  },
]

export const demoContent = {
  x: `Stop letting good videos die on YouTube.

I pasted one 18-min upload into PulseFlow.

Got back:
→ a thread with a proper hook
→ a LinkedIn post I'd actually publish
→ a Telegram drop for my channel

Same transcript. Three formats. About 45 seconds.`,
  linkedin: `Your best ideas shouldn't stay buried in a watch page.

I published a deep-dive last week. Decent watch time. Then nothing on LinkedIn.

Ran the transcript through PulseFlow once.

One structured post with a clear opener — ready to edit and ship.

Repurposing stopped being a separate project.`,
  telegram: `New workflow:

1. Upload to YouTube
2. Paste link in PulseFlow
3. Copy the Telegram tab

That's it. The mobile formatting is already done.`,
}

export const productAnnotations = [
  {
    id: "url",
    label: "Paste any public YouTube URL",
    position: "top-left" as const,
  },
  {
    id: "outputs",
    label: "Three platform tabs — edit before you copy",
    position: "bottom-right" as const,
  },
]

export const navLinks = [
  { href: "#use-cases", label: "Flows", id: "use-cases" },
  { href: "#features", label: "Features", id: "features" },
  { href: "#product", label: "Product", id: "product" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#faq", label: "FAQ", id: "faq" },
]

export const heroCopy = {
  label: "Workflow automation for builders",
  title: "Turn Stripe events into",
  titleAccent: "live workflows",
  subtitle:
    "Connect Stripe, webhooks, and your stack — then run automations without writing backend glue or managing five separate tools.",
  primaryCta: "Get started free",
  secondaryCta: "See live demo",
  trustBadges: ["No setup complexity", "Works with Stripe & APIs"],
}

export const positioning = {
  what: "Workflow automation tool",
  canDo: "Stripe + API + cross-tool workflows",
  why: "Saves hours of backend work per flow",
  who: "Indie devs, builders, and small teams",
} as const

export const finalCta = {
  label: "Start building",
  title: "Your first workflow in under 5 minutes",
  description:
    "Connect Stripe, add three steps, hit run. Free trial — no card required.",
  primaryCta: "Get started free",
  secondaryCta: "View plans",
}

export const footerLinks = {
  product: [
    { label: "Flows", href: "/#use-cases" },
    { label: "Product", href: "/#product" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  developers: [
    { label: "Docs", href: "/#how-it-works" },
    { label: "GitHub", href: "https://github.com/new-era-ogency/Stripe-Integration", external: true },
    { label: "Changelog", href: "/#changelog" },
    { label: "Roadmap", href: "https://github.com/new-era-ogency/Stripe-Integration/issues", external: true },
    { label: "Status", href: "https://github.com/new-era-ogency/Stripe-Integration/commits/main", external: true },
  ],
  resources: [
    { label: "FAQ", href: "/#faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const
