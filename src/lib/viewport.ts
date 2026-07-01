/** Viewports below this width use the dedicated mobile UI. */
export const MOBILE_MAX_WIDTH_PX = 1023

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`

export type DashboardMobileTab = "create" | "results" | "history" | "settings"
