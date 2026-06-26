export const collections = {
  platforms: [
    { id: "x", label: "X / Twitter", tag: "threads" },
    { id: "linkedin", label: "LinkedIn", tag: "long-form" },
    { id: "telegram", label: "Telegram", tag: "channel" },
  ],
  styles: [
    { id: "viral", label: "Viral Thread", tag: "hooks" },
    { id: "deep", label: "Deep Dive", tag: "authority" },
    { id: "punchy", label: "Punchy / Short", tag: "snackable" },
  ],
} as const

export const featureBlocks = [
  {
    eyebrow: "The workflow",
    title: "One YouTube link. Three drafts you can actually post.",
    description:
      "Paste a URL. PulseFlow pulls the transcript, then writes separate outputs for X, LinkedIn, and Telegram — each formatted the way that platform expects.",
    icon: "layers" as const,
    learnMoreHref: "#product",
    featured: true,
  },
  {
    eyebrow: "Speed",
    title: "Under a minute, start to finish",
    description:
      "No tab-hopping between ChatGPT, a thread formatter, and a LinkedIn doc. One pass, three copy-ready drafts.",
    icon: "zap" as const,
    learnMoreHref: "#how-it-works",
    featured: false,
  },
  {
    eyebrow: "Voice",
    title: "Sounds like you, not a template",
    description:
      "Pick a tone preset before you generate. Viral thread, deep dive, or punchy short — the model adapts length and CTA weight.",
    icon: "palette" as const,
    learnMoreHref: "#demo",
    featured: false,
  },
  {
    eyebrow: "Channels",
    title: "Built for how each feed reads",
    description:
      "X gets hooks and line breaks. LinkedIn gets structure. Telegram gets something scannable on a phone. Same source, three different shapes.",
    icon: "target" as const,
    learnMoreHref: "#features",
    featured: false,
  },
]

export const useCases = [
  {
    title: "Solo creators",
    description:
      "Publish the video on Tuesday. Ship the thread Wednesday morning and the LinkedIn post Thursday — without rewriting the same idea three times.",
    example: "“I run one channel. PulseFlow is my repurposing step before I open Typefully.”",
  },
  {
    title: "Small teams",
    description:
      "Founder records a Loom or webinar. Marketing gets LinkedIn and X drafts the same day — no copywriter in the loop for the first pass.",
    example: "“We use it after every product update video.”",
  },
  {
    title: "Educators",
    description:
      "Turn a 40-minute lesson into a week of social snippets that point back to the full video.",
    example: "“My course promos basically write themselves now.”",
  },
]

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

export const walkthroughSteps = [
  {
    title: "Paste the link on your dashboard",
    description:
      "PulseFlow fetches the transcript automatically. No browser extension, no manual copy from YouTube captions.",
    align: "left" as const,
  },
  {
    title: "Pick how you want it written",
    description:
      "Choose a tone preset — viral thread, deep dive, or punchy short — then hit generate. Credits deduct only when output succeeds.",
    align: "right" as const,
  },
  {
    title: "Copy, tweak, publish",
    description:
      "Each tab is formatted for its platform. Edit inline, copy to clipboard, or publish to Telegram if you're on Pro.",
    align: "left" as const,
  },
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

export const techStack = ["Stripe", "Supabase", "Next.js", "OpenRouter"]

export const honestStats = [
  { value: "3", label: "outputs per generation" },
  { value: "<60s", label: "typical run time" },
  { value: "7-day", label: "free trial to start" },
]

export const testimonials = [
  {
    quote:
      "I used to block two hours after every upload. Now I paste the link, skim the drafts, and schedule. That's the whole workflow.",
    author: "Sarah Chen",
    role: "YouTube creator",
    initials: "SC",
    highlight: true,
  },
  {
    quote:
      "We tried three repurposing tools. This is the only one where LinkedIn output didn't need a full rewrite.",
    author: "Marcus Webb",
    role: "Agency owner",
    initials: "MW",
    highlight: false,
  },
]

export const faqs = [
  {
    q: "What do I actually do after I sign up?",
    a: "Open the dashboard, paste a public YouTube URL, pick a tone preset, and click Generate. You'll get X, LinkedIn, and Telegram drafts in one pass.",
  },
  {
    q: "Do I need an account to see what the output looks like?",
    a: "No. Scroll to the demo on this page — you can read sample outputs without signing in.",
  },
  {
    q: "What model writes the copy?",
    a: "Claude 3.5 Sonnet via OpenRouter. We picked it because the hooks and thread structure are consistently better than cheaper models for social copy.",
  },
  {
    q: "Is there a free way to try it?",
    a: "Yes. New accounts get a 7-day trial with credits included. No card required to start.",
  },
  {
    q: "Can I use the output for client work?",
    a: "Yes. You own what you generate. Edit it, publish it, hand it to clients — it's yours.",
  },
  {
    q: "What happens when credits run out?",
    a: "Generation pauses until you upgrade or buy more. Your history stays in your account.",
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

export const steps = [
  {
    step: "1",
    title: "Paste a YouTube URL",
    description: "Public videos only. Transcript loads automatically.",
  },
  {
    step: "2",
    title: "Choose a tone",
    description: "Viral thread, deep dive, or punchy short — then generate.",
  },
  {
    step: "3",
    title: "Copy and publish",
    description: "Three tabs, three formats. Edit anything before it goes live.",
  },
]

export const navLinks = [
  { href: "#product", label: "Product", id: "product" },
  { href: "#features", label: "Features", id: "features" },
  { href: "#changelog", label: "Changelog", id: "changelog" },
  { href: "#faq", label: "FAQ", id: "faq" },
]

export const heroCopy = {
  label: "For people who'd rather create than manage dashboards",
  title: "Less rewriting.",
  titleAccent: "More shipping.",
  subtitle:
    "Paste a YouTube link. Get X, LinkedIn, and Telegram drafts in under a minute — without opening five tabs.",
  primaryCta: "See a real example",
  secondaryCta: "Start free trial",
}

export const finalCta = {
  label: "Ready when you are",
  title: "Try it on your last upload",
  description:
    "Sign up takes a minute. Paste a video you already published and see if the drafts are worth posting.",
}
