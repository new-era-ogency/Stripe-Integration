export type KanbanColumnId = "backlog" | "in_progress" | "review" | "done"

export type DemoTask = {
  id: string
  title: string
  column: KanbanColumnId
  projectId: string
  tag?: string
}

export type DemoProject = {
  id: string
  name: string
  description: string
  status: "Active" | "Planning"
  tasksOpen: number
}

export const kanbanColumns: { id: KanbanColumnId; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
]

export const initialProjects: DemoProject[] = [
  {
    id: "steroid-olympics",
    name: "Steroid Olympics launch",
    description: "Repurpose the documentary interview into X, LinkedIn, and Telegram drops.",
    status: "Active",
    tasksOpen: 4,
  },
  {
    id: "weekly-recap",
    name: "Weekly creator recap",
    description: "Batch three YouTube uploads into one coordinated publish week.",
    status: "Planning",
    tasksOpen: 2,
  },
]

export const initialTasks: DemoTask[] = [
  {
    id: "t1",
    title: "Draft viral X thread hook",
    column: "in_progress",
    projectId: "steroid-olympics",
    tag: "X",
  },
  {
    id: "t2",
    title: "LinkedIn authority post",
    column: "review",
    projectId: "steroid-olympics",
    tag: "LinkedIn",
  },
  {
    id: "t3",
    title: "Telegram channel drop",
    column: "backlog",
    projectId: "steroid-olympics",
    tag: "Telegram",
  },
  {
    id: "t4",
    title: "Pull shorts hooks from Pro Max",
    column: "backlog",
    projectId: "steroid-olympics",
    tag: "Shorts",
  },
  {
    id: "t5",
    title: "Outline recap newsletter",
    column: "backlog",
    projectId: "weekly-recap",
    tag: "Email",
  },
]

export const meetingTranscriptLines = [
  "[00:00] Rodion: Alright — let's align on the public beta launch.",
  "[00:12] Alex: The interactive demo needs to be the hero. No waitlist gate.",
  "[00:28] Priya: Agreed. I ran three meetings through the pipeline — tasks landed in Kanban every time.",
  "[00:45] Rodion: Privacy stays BYOK. Keys never hit our servers.",
  "[01:02] Alex: Decision — ship Friday with demo as primary CTA.",
  "[01:15] Priya: I'll record the Loom for the launch thread.",
]

export const meetingScript = {
  fileName: "Meeting.mp4",
  duration: "42:18",
  summary: `**Product sync — March 18**

The team aligned on launching the BYOK dashboard publicly without a paywall. Rodion demoed the YouTube → multi-platform flow; average generation time is under a minute with OpenRouter.

**Key themes**
- Privacy-first: API keys never hit PulseFlow servers
- Telegram auto-publish is the top Pro request
- Landing page needs a playable demo before paid ads

**Risks**
- YouTube transcript fetching blocked on some cloud IPs — OpenRouter fallback shipped`,
  tasks: [
    "Ship interactive landing demo (no signup)",
    "Record 60s Loom for X launch thread",
    "Add OpenRouter setup docs to FAQ",
  ],
  decision:
    "Launch public beta Friday with interactive demo as the primary CTA — no waitlist.",
}

export const chatSeedMessages = [
  {
    id: "m1",
    role: "assistant" as const,
    content:
      "I analyzed your Steroid Olympics project. Want me to draft a thread hook or break the interview into LinkedIn sections?",
  },
  {
    id: "m2",
    role: "user" as const,
    content: "Give me 3 hook options for X — punchy, under 200 chars each.",
  },
  {
    id: "m3",
    role: "assistant" as const,
    content: `1. "They built an Olympics where steroids are legal. The results will break your brain."

2. "What happens when you stop pretending PEDs don't exist in sports? This documentary answers it."

3. "I watched athletes compete on camera with full transparency. Here's what shocked me."`,
  },
]

export const chatSuggestions = [
  "Summarize this project",
  "Generate LinkedIn post",
  "What should I publish first?",
]
