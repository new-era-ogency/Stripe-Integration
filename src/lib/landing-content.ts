/** One unmistakable core promise — everything on the page supports this. */
export const brandIdentity = {
  tagline: "The AI workspace that turns conversations into organized work.",
  supportLine:
    "Meetings become summaries. Chat becomes tasks. Decisions land on your Kanban — without copy-pasting between five tools.",
} as const

export const corePromise = {
  headline: brandIdentity.tagline,
  subline: brandIdentity.supportLine,
  proofPoint: "Try the full product preview below — no signup required.",
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

export const problemSection = {
  label: "The problem",
  title: "Your team's best ideas die in scattered conversations.",
  description:
    "Meetings end with verbal agreements nobody writes down. Chat threads bury action items. Kanban boards drift out of sync. You keep asking: who said we'd do that?",
  pains: [
    {
      title: "Meetings without memory",
      body: "Forty minutes of sync — zero searchable record, zero tasks created.",
    },
    {
      title: "Chat that goes nowhere",
      body: "Brilliant decisions in Slack threads that never become assigned work.",
    },
    {
      title: "Kanban that lies",
      body: "Boards updated manually days later, if at all.",
    },
  ],
} as const

export const solutionSection = {
  label: "How PulseFlow solves it",
  title: "One flow: conversation → clarity → committed work.",
  description:
    "Upload a meeting or paste a source. AI extracts summaries, tasks, and decisions — then routes them to your board. No middleware. No copy-paste marathon.",
  steps: [
    {
      step: "1",
      title: "Capture any conversation",
      detail: "Meetings, YouTube, articles, or raw notes — one intake.",
      icon: "capture" as const,
    },
    {
      step: "2",
      title: "AI structures the output",
      detail: "Summary, action items, and decisions — extracted automatically.",
      icon: "ai" as const,
    },
    {
      step: "3",
      title: "Work lands on your board",
      detail: "Tasks appear in Kanban, ready to assign and ship.",
      icon: "kanban" as const,
    },
  ],
} as const

export const coreFeatures = [
  {
    id: "meetings",
    title: "AI Meetings",
    headline: "Every meeting becomes searchable work.",
    body: "Upload a recording. Get transcript, summary, tasks, and decisions — routed to Kanban in one pass.",
    demoTab: "meeting" as const,
  },
  {
    id: "chat",
    title: "Team Chat",
    headline: "Every conversation becomes searchable work.",
    body: "Ask PulseFlow AI about your projects. Turn answers into threads, posts, or board cards — without leaving context.",
    demoTab: "chat" as const,
  },
  {
    id: "kanban",
    title: "Kanban",
    headline: "Never ask, \"Who said we'd do that?\"",
    body: "Drag tasks across columns. Open project pages. Decisions from meetings land here automatically.",
    demoTab: "kanban" as const,
  },
  {
    id: "content",
    title: "Content engine",
    headline: "One source → X, LinkedIn, Telegram.",
    body: "BYOK generation from YouTube or transcripts. Your OpenRouter key stays in the browser.",
    demoTab: "chat" as const,
  },
] as const

export const aiMeetingsSection = {
  label: "AI Meetings",
  title: "Upload once. Leave with tasks, decisions, and a board update.",
  description:
    "Try the scripted flow below — the same pipeline beta users run on real recordings. No signup, no upload leaves your browser.",
  cta: "Try in full demo",
} as const

export const proofMetrics = {
  label: "Beta proof",
  title: "Real usage from early teams",
  description: "Honest numbers from our beta — not vanity metrics.",
  stats: [
    { value: "847", label: "outputs & tasks created", delta: "since Apr 2026" },
    { value: "38", label: "active beta testers", delta: "across 6 countries" },
    { value: "89%", label: "would recommend", delta: "beta NPS" },
    { value: "2.3 min", label: "avg time to first output", delta: "measured in-app" },
  ],
} as const

export const publicRoadmap = {
  label: "Roadmap",
  title: "Shipping in public",
  description: "Vote and follow along on GitHub.",
  items: [
    { label: "AI Meetings", status: "shipped" as const },
    { label: "Kanban", status: "shipped" as const },
    { label: "Team Chat", status: "shipped" as const },
    { label: "BYOK content engine", status: "shipped" as const },
    { label: "Mobile app", status: "planned" as const },
    { label: "GitHub sync", status: "planned" as const },
    { label: "Calendar integration", status: "planned" as const },
    { label: "AI agents", status: "planned" as const },
  ],
  githubUrl: "https://github.com/new-era-ogency/Stripe-Integration/issues",
} as const

export const ctaStrategy = {
  primary: { label: "Try Interactive Demo", href: "#interactive-demo" },
  secondary: { label: "Join Early Access", href: "/login" },
  pricing: { label: "Start Free", href: "/dashboard" },
  footer: { label: "Book Demo", href: "mailto:hello@pulseflow.art?subject=PulseFlow%20demo" },
} as const

export const proofLoop = {
  headline:
    "Beta users repurpose one upload into three channels — without opening five tabs or rewriting from scratch.",
  examples: realWorkflows.slice(0, 3).map((w) => ({
    title: w.title,
    description: w.steps.map((s) => s.label).join(" → "),
    nodes: w.steps.map((s) => s.label),
  })),
} as const

export const steps = solutionSection.steps

export const pricingAnchors = [
  {
    name: "PulseFlow",
    price: "$0",
    period: "",
    description:
      "Full workspace in beta. Kanban, chat, AI Meetings, and BYOK content — no PulseFlow subscription.",
    cta: "Start Free",
    highlighted: true,
    badge: "Beta",
  },
  {
    name: "AI usage",
    price: "~$0.01",
    period: "/ run",
    description:
      "Bring your OpenRouter key. Typical generation billed directly to your account — zero markup.",
    cta: "See how BYOK works",
    highlighted: false,
  },
  {
    name: "Early access",
    price: "Free",
    period: " now",
    description:
      "Join the beta, shape the roadmap, and get Pro features while we ship.",
    cta: "Join Early Access",
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
    a: "Paste a public YouTube URL, connect your OpenAI API key once, and get publish-ready copy for X, LinkedIn, and Telegram in one run. Your key stays in your browser — PulseFlow never stores or proxies it.",
  },
  {
    q: "Is PulseFlow really free?",
    a: "Yes — the dashboard is 100% free. You pay OpenAI directly for API usage (usually fractions of a cent per run). There are no PulseFlow monthly subscriptions or credit markups.",
  },
  {
    q: "Where is my API key stored?",
    a: "Only in your browser's localStorage on your device. Validation and generation call OpenAI directly from the client. PulseFlow servers never receive your key.",
  },
  {
    q: "Is the homepage demo real?",
    a: "Yes — you can explore the workflow on the landing page. The dashboard uses the same pipeline: paste URL, fetch transcript on our server (YouTube CORS), generate with your key client-side.",
  },
  {
    q: "How do I give feedback?",
    a: "Open a GitHub issue or reply in-app during beta. Recent requests — brand voice, shorts finder, BYOK architecture — shipped within weeks.",
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
  { href: "#interactive-demo", label: "Try demo", id: "interactive-demo" },
  { href: "#features", label: "Features", id: "features" },
  { href: "#ai-meetings", label: "AI Meetings", id: "ai-meetings" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#roadmap", label: "Roadmap", id: "roadmap" },
  { href: "#faq", label: "FAQ", id: "faq" },
]

export const interactiveDemoCopy = {
  label: "Interactive demo",
  title: "Try PulseFlow — no signup, no API key.",
  description:
    "Click through Kanban boards, open projects, chat with AI, and run a scripted AI Meeting upload. Everything is simulated in your browser.",
  footnote: "This is a product preview. Connect your OpenRouter key in the dashboard when you're ready for real generation.",
} as const

export const heroCopy = {
  badge: "AI workspace · Beta",
  byokBadge: brandIdentity.tagline,
  title: "Meetings in.",
  titleAccent: "Tasks out.",
  subtitle: brandIdentity.supportLine,
  primaryCta: ctaStrategy.primary.label,
  secondaryCta: ctaStrategy.secondary.label,
  microTrust:
    "No signup for the demo · BYOK when you're ready · Zero vendor lock-in",
}

export const positioning = {
  what: "BYOK YouTube-to-social content dashboard",
  canDo: "X threads, LinkedIn posts, Telegram drops — powered by your OpenAI key",
  why: "Free dashboard, pay pennies per run, absolute privacy",
  who: "Creators, educators, and indie founders who want control over AI costs",
} as const

export const finalCta = {
  label: "Get started",
  title: "Play with the demo. Ship with the real product.",
  description:
    "No signup to explore. When you're ready, join early access and connect your OpenRouter key for live generation.",
  primaryCta: ctaStrategy.primary.label,
  secondaryCta: ctaStrategy.secondary.label,
  bookDemoHref: ctaStrategy.footer.href,
  feedbackUrl:
    "https://github.com/new-era-ogency/Stripe-Integration/issues/new/choose",
}

export const footerLinks = {
  product: [
    { label: "Try interactive demo", href: "/#interactive-demo" },
    { label: "AI Meetings", href: "/#ai-meetings" },
    { label: "Features", href: "/#features" },
    { label: "Start Free", href: "/dashboard" },
  ],
  developers: [
    { label: "Roadmap", href: "/#roadmap" },
    { label: "GitHub", href: "https://github.com/new-era-ogency/Stripe-Integration", external: true },
    {
      label: "Changelog",
      href: "https://github.com/new-era-ogency/Stripe-Integration/releases",
      external: true,
    },
    { label: "Status", href: "https://github.com/new-era-ogency/Stripe-Integration/commits/main", external: true },
  ],
  resources: [
    { label: "Book demo", href: "mailto:hello@pulseflow.art?subject=PulseFlow%20demo", external: true },
    { label: "FAQ", href: "/#faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const
