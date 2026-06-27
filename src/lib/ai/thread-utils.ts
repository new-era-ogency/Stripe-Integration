/**
 * Parse model output into tweet-sized thread chunks.
 */
export function parseThreadChunks(raw: string): string[] {
  const trimmed = raw.trim()

  if (!trimmed) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      const tweets = parsed
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
      if (tweets.length > 0) {
        return tweets
      }
    }
  } catch {
    // fall through to text parsing
  }

  const jsonMatch = trimmed.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    try {
      const parsed: unknown = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        const tweets = parsed
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
        if (tweets.length > 0) {
          return tweets
        }
      }
    } catch {
      // fall through
    }
  }

  const blocks = trimmed
    .split(/\n{2,}/)
    .map((block) =>
      block
        .replace(/^\d+\/\d+\s*/i, "")
        .replace(/^\d+[\.)]\s*/, "")
        .trim()
    )
    .filter(Boolean)

  if (blocks.length > 1) {
    return blocks
  }

  const lines = trimmed
    .split(/\n/)
    .map((line) =>
      line
        .replace(/^\d+\/\d+\s*/i, "")
        .replace(/^\d+[\.)]\s*/, "")
        .trim()
    )
    .filter(Boolean)

  if (lines.length > 1) {
    return lines
  }

  return [trimmed]
}
