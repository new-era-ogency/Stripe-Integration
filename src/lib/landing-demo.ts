export type DemoNodeType = "trigger" | "action" | "output"

export type DemoChainNode = {
  id: string
  label: string
  sublabel: string
  type: DemoNodeType
}

export const demoStarterNode: DemoChainNode = {
  id: "youtube-url",
  label: "YouTube URL",
  sublabel: "Trigger · paste link",
  type: "trigger",
}

/** Options shown when clicking each empty slot in the chain. */
export const demoSlotOptions: DemoChainNode[][] = [
  [
    {
      id: "fetch-transcript",
      label: "Fetch transcript",
      sublabel: "Auto-extract audio",
      type: "action",
    },
    {
      id: "style-preset",
      label: "Style preset",
      sublabel: "Viral thread tone",
      type: "action",
    },
  ],
  [
    {
      id: "generate-outputs",
      label: "Generate outputs",
      sublabel: "X · LinkedIn · Telegram",
      type: "output",
    },
  ],
]

export const demoRunOutput = {
  headline: "Workflow completed",
  duration: "1.4s",
  preview:
    "Stop letting good videos die on YouTube.\n\nI pasted one 18-min upload into PulseFlow.\n\nGot back a thread, a LinkedIn post, and a Telegram drop — in under a minute.",
  platforms: ["X thread", "LinkedIn", "Telegram"],
}

export const demoCoachSteps = [
  "Click a + slot to add a node",
  "Connect your chain",
  "Hit Run",
] as const
