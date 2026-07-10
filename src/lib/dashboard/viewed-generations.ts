import type { GenerationRecord } from "@/lib/generations"

function storageKey(userId: string): string {
  return `pulseflow:viewed-generations:${userId}`
}

export function loadViewedGenerationIds(
  userId: string,
  existingGenerationIds: string[] = []
): Set<string> {
  if (typeof window === "undefined") {
    return new Set()
  }

  try {
    const raw = localStorage.getItem(storageKey(userId))

    if (raw === null) {
      if (existingGenerationIds.length > 0) {
        const initial = new Set(existingGenerationIds)
        saveViewedGenerationIds(userId, initial)
        return initial
      }
      return new Set()
    }

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return new Set()
    }

    return new Set(parsed.filter((id): id is string => typeof id === "string"))
  } catch {
    return new Set()
  }
}

export function saveViewedGenerationIds(
  userId: string,
  ids: Set<string>
): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(storageKey(userId), JSON.stringify([...ids]))
}

export function countUnseenResults(
  generations: GenerationRecord[],
  viewedIds: Set<string>
): number {
  return generations.filter((record) => !viewedIds.has(record.id)).length
}
