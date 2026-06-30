import {
  OPENROUTER_API_BASE_URL,
  PRODUCTION_OPENROUTER_MODEL,
} from "@/lib/ai/models"

export const OPENROUTER_API_KEY_GUIDE_PATH = "/guide/openrouter-key"

export const openRouterLinks = {
  home: "https://openrouter.ai",
  signUp: "https://openrouter.ai/sign-up",
  keys: "https://openrouter.ai/keys",
  activity: "https://openrouter.ai/activity",
  docs: "https://openrouter.ai/docs",
  quickstart: "https://openrouter.ai/docs/quickstart",
  credits: "https://openrouter.ai/credits",
} as const

export type GuideStep = {
  title: string
  body: string
  links?: Array<{ label: string; href: string; external?: boolean }>
}

export const getOpenRouterKeySteps: GuideStep[] = [
  {
    title: "Create an OpenRouter account",
    body: "OpenRouter is the AI gateway PulseFlow uses. Sign up with email or Google — it's free to create an account.",
    links: [
      { label: "Open OpenRouter", href: openRouterLinks.signUp, external: true },
    ],
  },
  {
    title: "Open the API Keys page",
    body: "From your OpenRouter dashboard, go to Keys. This is where you create and revoke personal API keys.",
    links: [
      { label: "openrouter.ai/keys", href: openRouterLinks.keys, external: true },
    ],
  },
  {
    title: "Create a new key",
    body: 'Click "Create key", give it a name (e.g. "PulseFlow"), and copy the value immediately. Keys start with sk-or-v1- and are only shown once.',
    links: [
      { label: "Key management docs", href: openRouterLinks.docs, external: true },
    ],
  },
  {
    title: "Add credits or use free models (optional)",
    body: "PulseFlow uses a free OpenRouter model by default. Some models require a positive balance. Check your usage and add credits only if you need paid models elsewhere.",
    links: [
      { label: "Activity dashboard", href: openRouterLinks.activity, external: true },
      { label: "Add credits", href: openRouterLinks.credits, external: true },
    ],
  },
]

export const useKeyInPulseFlowSteps: GuideStep[] = [
  {
    title: "Open Settings in the dashboard",
    body: 'Sign in, go to Dashboard → Settings → API key. You can also click "Add your API key" in the top navigation.',
    links: [
      { label: "Open dashboard", href: "/dashboard#settings" },
    ],
  },
  {
    title: "Paste and save your key",
    body: "Paste your sk-or-v1- key, then click Save & validate. PulseFlow checks the key against OpenRouter and stores it in this browser's localStorage only — not in our database.",
  },
  {
    title: "Generate content",
    body: "Paste a YouTube link, article URL, or transcript in the workspace and click Generate. Your key is sent in the request header so PulseFlow can call OpenRouter on your behalf. OpenRouter bills your account directly.",
    links: [
      { label: "Try the dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Monitor usage on OpenRouter",
    body: "Every generation appears on your OpenRouter activity page. PulseFlow is free — you only pay OpenRouter for the model runs you trigger.",
    links: [
      { label: "View activity", href: openRouterLinks.activity, external: true },
    ],
  },
]

export const directApiUsage = {
  title: "Call OpenRouter directly (advanced)",
  description:
    "Your key works outside PulseFlow too. Use it in your own scripts, agents, or curl commands against the OpenRouter API.",
  model: PRODUCTION_OPENROUTER_MODEL,
  baseUrl: OPENROUTER_API_BASE_URL,
  curlExample: `curl ${OPENROUTER_API_BASE_URL}/chat/completions \\
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${PRODUCTION_OPENROUTER_MODEL}",
    "messages": [
      { "role": "user", "content": "Hello from my own script." }
    ]
  }'`,
  pulseFlowApiNote:
    "PulseFlow's /api/generate-content endpoint also accepts your key via the x-user-api-key header when you are signed in — useful if you want to reuse our prompts and history from your own tooling.",
}

export const guideFaq = [
  {
    q: "Does PulseFlow store my API key?",
    a: "No. Your key is saved in your browser's localStorage. When you generate, it is sent in the x-user-api-key header for that request only. We do not persist it in Supabase or logs.",
  },
  {
    q: "What if I lose my key?",
    a: "Revoke the old key on openrouter.ai/keys and create a new one. Then update it in PulseFlow Settings.",
  },
  {
    q: "Can I use the same key on multiple devices?",
    a: "Yes, but you must add it separately on each browser. Keys are not synced across devices by PulseFlow.",
  },
]
