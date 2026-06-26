export const useCaseFlows = [
  {
    title: "Stripe checkout flow",
    nodes: ["Stripe payment", "Create user", "Send email", "Update database"],
  },
  {
    title: "Signup automation",
    nodes: ["New signup", "Slack notification", "CRM entry"],
  },
  {
    title: "API event chain",
    nodes: ["API event", "Webhook", "Automation chain"],
  },
] as const

export const jobBlocks = [
  {
    title: "Trigger workflows from Stripe events",
    icon: "stripe" as const,
  },
  {
    title: "Build API chains without backend code",
    icon: "api" as const,
  },
  {
    title: "Automate onboarding in one flow",
    icon: "onboarding" as const,
  },
  {
    title: "Connect tools like Notion, Slack, Stripe",
    icon: "integrations" as const,
  },
] as const

export const steps = [
  { step: "1", title: "Connect your tools" },
  { step: "2", title: "Build workflow visually" },
  { step: "3", title: "Run and automate instantly" },
] as const

export const proofLoop = {
  headline:
    "People use PulseFlow to automate Stripe payments, onboarding, and API workflows in minutes instead of writing backend logic.",
  examples: [
    {
      title: "Stripe payments",
      description: "Checkout completes → user provisioned → email sent. No custom webhook glue.",
      nodes: ["Stripe", "Create user", "Email", "Database"],
    },
    {
      title: "Onboarding",
      description: "New signup triggers notifications and CRM updates in one pass.",
      nodes: ["Signup", "Slack", "CRM"],
    },
    {
      title: "API workflows",
      description: "Incoming events fan out through a chain — no redeploy for each step.",
      nodes: ["API event", "Webhook", "Chain"],
    },
  ],
} as const

export const pricingAnchors = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Start building. 7-day trial with credits included.",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€19",
    period: "/mo",
    description: "50 generations/month. Full content pack + Telegram publish.",
    highlighted: true,
  },
  {
    name: "Team",
    price: "€49",
    period: "/mo",
    description: "200 generations/month. Pro Max with viral shorts finder.",
    highlighted: false,
  },
] as const

export const credibility = {
  stats: [
    { value: "v0.4", label: "released this week" },
    { value: "120+", label: "workflows created" },
    { value: "18", label: "integrations supported" },
    { value: "40+", label: "early users" },
  ],
  releaseNote: "v0.4 shipped Jun 2026 — Pro Max, viral shorts, trial extensions.",
  builderNote: "Built by an indie developer. Shipping weekly, not pitching forever.",
  githubUrl: "https://github.com/new-era-ogency/Stripe-Integration",
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
    a: "No. Connect your tools, drag steps into a flow, and run. Backend logic is handled for you — you configure triggers and actions, not servers.",
  },
  {
    q: "Does it work with Stripe events?",
    a: "Yes. Stripe checkout and subscription webhooks are built in. Payment success can create users, send emails, and update your database in one automated chain.",
  },
  {
    q: "Can I run workflows in real-time?",
    a: "Yes. Events trigger flows immediately — typically under a few seconds from webhook to completion, depending on chain length.",
  },
  {
    q: "Is this production-ready?",
    a: "We're in active development (v0.4). Core flows — Stripe billing, auth, and content generation — are live and used by early users. Check the changelog for what's shipping weekly.",
  },
  {
    q: "What integrations are supported today?",
    a: "Stripe, Supabase, Telegram, and OpenRouter are live. Slack, Notion, and additional connectors are rolling out — see the roadmap in our GitHub repo.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Subscriptions are managed through Stripe. Cancel from your billing page — no lock-in, no sales call.",
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
  { href: "#features", label: "Jobs", id: "features" },
  { href: "#product", label: "Product", id: "product" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#faq", label: "FAQ", id: "faq" },
]

export const heroCopy = {
  title: "Automate your workflows in",
  titleAccent: "minutes, not hours",
  subtitle:
    "PulseFlow helps you turn repetitive tasks into simple automated flows — without writing complex logic or managing multiple tools.",
  supportingLine:
    "Start building automations that actually save time from day one.",
  primaryCta: "Get started",
  secondaryCta: "View demo",
  trustLine: "Trusted by creators and indie teams",
}

export const finalCta = {
  label: "Ready when you are",
  title: "Build your first flow in minutes",
  description:
    "Connect Stripe, set up one automation, and see it run. Free trial — no card required.",
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
    { label: "GitHub", href: "https://github.com/new-era-ogency/Stripe-Integration", external: true },
    { label: "Changelog", href: "/#changelog" },
    { label: "Roadmap", href: "https://github.com/new-era-ogency/Stripe-Integration/issues", external: true },
    { label: "Status", href: "https://github.com/new-era-ogency/Stripe-Integration/commits/main", external: true },
  ],
  resources: [
    { label: "Documentation", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const
