export const DASHBOARD_VIEWS = [
  "overview",
  "create",
  "results",
  "history",
  "settings",
] as const

export type DashboardView = (typeof DASHBOARD_VIEWS)[number]

export const DASHBOARD_VIEW_LABELS: Record<DashboardView, string> = {
  overview: "Dashboard",
  create: "Create",
  results: "Results",
  history: "History",
  settings: "Settings",
}
