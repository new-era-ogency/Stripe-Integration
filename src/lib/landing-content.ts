export const collections = {
  platforms: [
    { id: "x", label: "X / Twitter", tag: "THREADS" },
    { id: "linkedin", label: "LinkedIn", tag: "LONG-FORM" },
    { id: "telegram", label: "Telegram", tag: "CHANNEL" },
  ],
  styles: [
    { id: "viral", label: "Viral Thread", tag: "HOOKS" },
    { id: "deep", label: "Deep Dive", tag: "AUTHORITY" },
    { id: "punchy", label: "Punchy / Short", tag: "SNACKABLE" },
    { id: "thought", label: "Thought Leader", tag: "INSIGHT" },
    { id: "cta", label: "CTA-Heavy", tag: "CONVERT" },
    { id: "newsletter", label: "Newsletter Drop", tag: "EMAIL" },
  ],
} as const

export const featureBlocks = [
  {
    eyebrow: "Introducing",
    title: "YouTube to multi-platform content",
    description:
      "Your video transcript, our engine. Paste a link and receive platform-native drafts for X, LinkedIn, and Telegram — each tuned for how that audience actually reads.",
    icon: "layers" as const,
    learnMoreHref: "#demo",
  },
  {
    eyebrow: "Speed",
    title: "From link to posts in under 60 seconds",
    description:
      "Transcript extraction, parallel AI generation, and formatted output — all in one pass. No copy-paste chaos between tools.",
    icon: "zap" as const,
    learnMoreHref: "#how-it-works",
  },
  {
    eyebrow: "Precision",
    title: "Tailored outputs for every channel",
    description:
      "X threads with hooks and line breaks. LinkedIn posts with structure and authority. Telegram drops that scan fast on mobile. One source, three distinct voices.",
    icon: "target" as const,
    learnMoreHref: "#features",
  },
  {
    eyebrow: "Flexibility",
    title: "Explore tone presets that match your brand",
    description:
      "Viral thread, deep dive, punchy short — pick a style preset and let the model adapt tone, length, and CTA intensity before you publish.",
    icon: "palette" as const,
    learnMoreHref: "#styles",
  },
]

export const useCases = [
  {
    title: "Creators",
    description:
      "Turn every YouTube upload into a week of social content. Threads, posts, and channel drops — without rewriting from scratch.",
    tags: ["YOUTUBERS", "PODCASTERS", "STREAMERS"],
  },
  {
    title: "Businesses",
    description:
      "Repurpose webinars, demos, and founder updates into LinkedIn thought leadership and X distribution at scale.",
    tags: ["B2B", "SAAS", "AGENCIES"],
  },
  {
    title: "Educators",
    description:
      "Convert lectures and tutorials into digestible social snippets that drive students back to the full video.",
    tags: ["COACHES", "COURSES", "TEACHERS"],
  },
]

export const benefits = [
  {
    title: "3 platforms, one pass",
    description: "X, LinkedIn, and Telegram outputs generated in parallel from a single transcript.",
  },
  {
    title: "Claude 3.5 Sonnet quality",
    description: "Powered by OpenRouter for sharp hooks, clean structure, and platform-native tone.",
  },
  {
    title: "Under 60 seconds",
    description: "Most generations complete in under a minute — from URL paste to copy-ready drafts.",
  },
  {
    title: "Any device, anytime",
    description: "Works in the browser on desktop, tablet, or mobile. Credits sync to your account.",
  },
]

export const platformCategories = [
  {
    id: "x",
    title: "X / Twitter",
    description:
      "Thread-ready hooks, punchy lines, and reply-bait structure. Optimized for scroll-stopping openers and viral cadence.",
    cta: "Preview X output",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description:
      "Long-form posts with authority tone, scannable paragraphs, and professional CTAs that fit the feed.",
    cta: "Preview LinkedIn output",
  },
  {
    id: "telegram",
    title: "Telegram",
    description:
      "Channel-native articles — conversational, high-energy, and formatted for mobile readers who skim fast.",
    cta: "Preview Telegram output",
  },
]

export const styleShowcase = [
  { category: "Tone", name: "Viral Thread", preset: "viral-thread" },
  { category: "Tone", name: "Deep Dive", preset: "deep-dive" },
  { category: "Tone", name: "Punchy / Short", preset: "punchy-short" },
  { category: "Format", name: "Hook-First", preset: "hook-first" },
  { category: "Format", name: "Thread Breakdown", preset: "thread" },
  { category: "Format", name: "CTA-Heavy", preset: "cta-heavy" },
  { category: "Audience", name: "Thought Leader", preset: "thought-leader" },
  { category: "Audience", name: "Community Drop", preset: "community" },
  { category: "Audience", name: "Newsletter Tease", preset: "newsletter" },
]

export const testimonials = [
  {
    quote:
      "PulseFlow cut my repurposing time from 2 hours to 5 minutes. I paste the YouTube link and ship to three platforms the same day.",
    author: "Sarah Chen",
    role: "Content Creator, 120K subs",
  },
  {
    quote:
      "Our agency uses it for every client webinar. LinkedIn posts are consistently on-brand without a copywriter in the loop.",
    author: "Marcus Webb",
    role: "Head of Growth, Stackline Agency",
  },
]

export const faqs = [
  {
    q: "How do I generate content with PulseFlow?",
    a: "Sign in, paste a public YouTube URL on the dashboard, pick a style preset, and click Generate. You'll receive X, LinkedIn, and Telegram drafts in seconds.",
  },
  {
    q: "Do I need to sign in to explore the product?",
    a: "No. The landing page demo lets you preview sample outputs across all three platforms without an account. Sign in only when you're ready to generate your own.",
  },
  {
    q: "What AI model powers the generation?",
    a: "PulseFlow uses Claude 3.5 Sonnet via OpenRouter for high-quality, platform-native copy with strong hooks and structure.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. New accounts start with free trial credits so you can test the full pipeline before upgrading.",
  },
  {
    q: "Can I use outputs commercially?",
    a: "Yes. Generated content is yours to publish, edit, and use across your channels and client work.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "You'll be redirected to pricing where you can purchase more credits. Your generation history stays saved to your account.",
  },
]

export const exploreLinks = [
  {
    title: "Dashboard",
    description: "Paste a link, pick a preset, and generate all three platform outputs.",
    href: "/dashboard",
  },
  {
    title: "Pricing",
    description: "Starter and Pro plans with credit packs for consistent publishing.",
    href: "/pricing",
  },
  {
    title: "Sign In",
    description: "Create a free account and start generating in under a minute.",
    href: "/login",
  },
]

export const demoContent = {
  x: `🚨 Stop letting your YouTube videos die after upload.

I fed one 18-minute video into PulseFlow and got:

→ A punchy X thread with a killer hook
→ A LinkedIn thought-leadership post
→ A Telegram drop ready to publish

The transcript became 3 platform-native drafts in under 60 seconds.

Creators who repurpose win. Creators who don't get forgotten.`,
  linkedin: `Your best content shouldn't live in one place.

Last week I published a deep-dive on YouTube. Strong watch time. Solid comments. Then… silence.

So I ran the transcript through PulseFlow.

In one pass, I had:
• A structured LinkedIn post with a scroll-stopping opener
• A Telegram article formatted for mobile readers
• An X thread engineered for replies and reposts

Repurposing isn't extra work anymore — it's the multiplier.`,
  telegram: `⚡️ NEW DROP: From one YouTube link to three channels

PulseFlow just turned a single transcript into:

— X thread (hook + CTA locked in)
— LinkedIn long-form (authority tone)
— Telegram post (fast, scannable, high energy)

Paste link → AI processes → publish everywhere.

This is how modern creators scale output without scaling hours.`,
}

export const steps = [
  {
    step: "01",
    title: "Paste Link",
    description:
      "Drop any public YouTube URL. PulseFlow pulls the transcript instantly — no manual copying.",
  },
  {
    step: "02",
    title: "AI Processing",
    description:
      "Our models rewrite your transcript into platform-native drafts tuned for X, LinkedIn, and Telegram.",
  },
  {
    step: "03",
    title: "Get Viral Content",
    description:
      "Copy, refine, and publish. Every output is formatted for engagement — hooks, structure, and CTAs included.",
  },
]

export const trustBadges = [
  { label: "Stripe Secure Checkout", icon: "credit-card" as const },
  { label: "256-bit Encryption", icon: "shield" as const },
  { label: "OpenRouter AI", icon: "cpu" as const },
  { label: "99.9% Uptime", icon: "activity" as const },
]

export const companyLogos = [
  "Stackline",
  "CreatorOS",
  "GrowthLab",
  "VidScale",
  "LaunchPad",
  "RepurposeHQ",
]

export const socialProofStats = [
  { value: "12K+", label: "Posts generated" },
  { value: "2.4K+", label: "Active creators" },
  { value: "3", label: "Platform outputs" },
  { value: "99.9%", label: "Uptime SLA" },
]

export const navLinks = [
  { href: "#features", label: "Features", id: "features" },
  { href: "#how-it-works", label: "How It Works", id: "how-it-works" },
  { href: "#demo", label: "Demo", id: "demo" },
  { href: "#testimonials", label: "Reviews", id: "testimonials" },
  { href: "#faq", label: "FAQ", id: "faq" },
]
