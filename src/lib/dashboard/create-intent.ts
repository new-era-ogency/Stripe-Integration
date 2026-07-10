export type CreateIntent = "default" | "meetings" | "unclassified"

export function createIntentFromSourceTab(
  tab: "youtube" | "article" | "text" | "media"
): CreateIntent {
  if (tab === "media") {
    return "meetings"
  }

  if (tab === "text" || tab === "article") {
    return "unclassified"
  }

  return "default"
}
