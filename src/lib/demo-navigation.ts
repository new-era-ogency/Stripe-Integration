export type DemoTab = "kanban" | "projects" | "chat" | "meeting"

export const DEMO_TAB_EVENT = "pf-demo-tab"

export function navigateToDemoTab(tab: DemoTab) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(DEMO_TAB_EVENT, { detail: tab }))
  document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" })
}
