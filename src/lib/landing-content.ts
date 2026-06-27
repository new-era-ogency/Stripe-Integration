/** One unmistakable core promise — everything on the page supports this. */
export const corePromise = {
  headline: "One YouTube video → three publish-ready posts.",
  subline:
    "Paste a link. Get an X thread, LinkedIn post, and Telegram drop — edited and copied in under a minute.",
  proofPoint: "No rewriting marathon. No five-tool pipeline.",
} as const

export const realWorkflows = [
  {
    id: "viral-thread",
    title: "Viral X thread",
    trigger: "youtube.com/watch?v=…",
    steps: [
      { id: "paste", label: "Paste URL", detail: "Public YouTube link — any length." },
      { id: "transcript", label: "Fetch transcript", detail: "Auto-extracted; no manual copy." },
      { id: "style", label: "Pick Viral Thread preset", detail: "Hook-first tone, built for shares." },
      { id: "generate", label: "Generate all outputs", detail: "X, LinkedIn, Telegram in one run." },
      { id: "copy", label: "Copy & publish", detail: "Edit inline, copy to clipboard." },
    ],
    outputPreview: "x" as const,
    metric: "~47s avg",
  },
  {
    id: "linkedin-deep",
    title: "LinkedIn deep-dive",
    trigger: "18-min tutorial upload",
    steps: [
      { id: "paste", label: "Paste URL", detail: "Long-form video works best here." },
      { id: "transcript", label: "Fetch transcript", detail: "Full talk track pulled automatically." },
      { id: "style", label: "Pick Deep Dive preset", detail: "Authority tone, structured opener." },
      { id: "generate", label: "Generate all outputs", detail: "LinkedIn tab is the primary output." },
      { id: "copy", label: "Copy & publish", detail: "One structured post, ready to edit." },
    ],
    outputPreview: "linkedin" as const,
    metric: "1 credit",
  },
  {
    id: "telegram-drop",
    title: "Telegram channel drop",
    trigger: "Weekly video recap",
    steps: [
      { id: "paste", label: "Paste URL", detail: "Same link you already published." },
      { id: "transcript", label: "Fetch transcript", detail: "Mobile-friendly formatting applied." },
      { id: "style", label: "Pick Punchy/Short preset", detail: "Tight copy for channel drops." },
      { id: "generate", label: "Generate all outputs", detail: "Telegram tab formatted for mobile." },
      { id: "copy", label: "Copy & publish", detail: "Paste straight into your channel." },
    ],
    outputPreview: "telegram" as const,
    metric: "3 platforms",
  },
  {
    id: "pro-max-shorts",
    title: "Pro Max — viral shorts hooks",
    trigger: "Pro Max tier",
    steps: [
      { id: "paste", label: "Paste URL", detail: "Same dashboard, Pro Max unlock." },
      { id: "transcript", label: "Fetch transcript", detail: "Timestamp-aware extraction." },
      { id: "style", label: "Run shorts finder", detail: "Hook moments with timestamps." },
      { id: "generate", label: "Get script pack", detail: "Clip-ready hooks + captions." },
      { id: "copy", label: "Copy & cut", detail: "Jump to timestamp, record, post." },
    ],
    outputPreview: "x" as const,
    metric: "Pro Max",
  },
] as const

export type RealWorkflowId = (typeof realWorkflows)[number]["id"]

export const steps = [
  { step: "1", title: "Paste a YouTube URL", icon: "link" as const },
  { step: "2", title: "Pick a style preset", icon: "workflow" as const },
  { step: "3", title: "Copy outputs & publish", icon: "zap" as const },
] as const

export const proofLoop = {
  headline:
    "Beta users repurpose one upload into three channels — without opening five tabs or rewriting from scratch.",
  examples: realWorkflows.slice(0, 3).map((w) => ({
    title: w.title,
    description: w.steps.map((s) => s.label).join(" → "),
    nodes: w.steps.map((s) => s.label),
  })),
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
    { value: "847", label: "content packs generated", delta: "since Apr 2026" },
    { value: "38", label: "active beta testers", delta: "across 6 countries" },
    { value: "2.3 min", label: "avg time to first output", delta: "measured in-app" },
    { value: "89%", label: "beta NPS score", delta: "would recommend" },
  ],
  tagline: "Early numbers from real beta usage — not vanity metrics.",
  releaseNote: "v0.4 shipped Jun 2026 — Pro Max, viral shorts, trial extensions.",
  builderNote: "Built by an indie developer. Shipping weekly based on beta feedback.",
  githubUrl: "https://github.com/new-era-ogency/Stripe-Integration",
  docsUrl: "/#demo",
} as const

export const testimonials = [
  {
    quote:
      "I stopped spending Sunday afternoons rewriting YouTube videos. Paste, generate, copy — done in under 2 minutes.",
    name: "Marcus T.",
    role: "Indie SaaS founder",
    context: "Beta · week 3",
  },
  {
    quote:
      "The LinkedIn tab alone saved me 4 hours on my last tutorial drop. It actually sounds like me after a quick edit.",
    name: "Priya K.",
    role: "Dev educator",
    context: "Beta · Pro user",
  },
  {
    quote:
      "Finally one tool instead of ChatGPT + Notion + manual formatting. The Telegram output is already mobile-ready.",
    name: "Alex R.",
    role: "Content creator",
    context: "Beta · Starter",
  },
] as const

export const betaFeedback = [
  {
    type: "request" as const,
    text: "Add brand voice memory so outputs match my tone every time.",
    status: "Shipped in v0.3",
  },
  {
    type: "request" as const,
    text: "Timestamped hooks for Shorts — I want clip moments, not just text.",
    status: "Shipped in v0.4 (Pro Max)",
  },
  {
    type: "request" as const,
    text: "Trial extension when I share — keeps me in the loop without a card.",
    status: "Shipped this week",
  },
  {
    type: "open" as const,
    text: "Stripe webhook → auto-post when a video goes live.",
    status: "On roadmap · vote on GitHub",
  },
] as const

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
    q: "What does PulseFlow actually do today?",
    a: "Paste a public YouTube URL and get publish-ready copy for X, LinkedIn, and Telegram in one run. Pick a style preset, edit, copy — that's the core product in beta.",
  },
  {
    q: "Is this just marketing mockups on the landing page?",
    a: "No. The interactive demo uses the same dashboard UI you get after signup. Workflows listed on this page match the exact steps in the app.",
  },
  {
    q: "Do I need coding skills?",
    a: "No. If you can paste a YouTube link and click copy, you can use PulseFlow. Pro users can save a brand voice; Pro Max unlocks viral shorts hooks.",
  },
  {
    q: "How do I give feedback?",
    a: "Open a GitHub issue or reply in-app during beta. Recent requests — brand voice, shorts finder, trial extensions — shipped within weeks.",
  },
  {
    q: "What about Stripe workflow automation?",
    a: "On the roadmap. Beta feedback is prioritized by votes on GitHub. Today's focus is shipping the YouTube → multi-platform pipeline reliably.",
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
  { href: "#demo", label: "Try demo", id: "demo" },
  { href: "#workflows", label: "Workflows", id: "workflows" },
  { href: "#proof", label: "Beta proof", id: "proof" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#faq", label: "FAQ", id: "faq" },
]

export const heroCopy = {
  badge: "YouTube → X, LinkedIn & Telegram",
  title: "One video.",
  titleAccent: "Three posts. One minute.",
  subtitle: corePromise.subline,
  primaryCta: "Start free beta",
  secondaryCta: "Try interactive demo",
  microTrust: "38 beta testers · 847 packs generated · No card to start",
}

export const positioning = {
  what: "YouTube-to-social content engine",
  canDo: "X threads, LinkedIn posts, Telegram drops from one URL",
  why: "Cuts 2–4 hours of repurposing per video",
  who: "Creators, educators, and indie founders with a YouTube channel",
} as const

export const finalCta = {
  label: "Join the beta",
  title: "Stop polishing the landing page. Start shipping content.",
  description:
    "We're in active beta — real users, weekly releases, feedback goes straight into the next build. Sign up free and tell us what breaks.",
  primaryCta: "Join free beta",
  secondaryCta: "Leave feedback on GitHub",
  feedbackUrl:
    "https://github.com/new-era-ogency/Stripe-Integration/issues/new/choose",
}

export const footerLinks = {
  product: [
    { label: "Try demo", href: "/#demo" },
    { label: "Workflows", href: "/#workflows" },
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
