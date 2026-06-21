function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function applyInlineFormatting(line: string): string {
  let result = escapeHtml(line)
  result = result.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
  result = result.replace(/__(.+?)__/g, "<b>$1</b>")
  result = result.replace(/\*(.+?)\*/g, "<i>$1</i>")
  result = result.replace(/_(.+?)_/g, "<i>$1</i>")
  result = result.replace(/`(.+?)`/g, "<code>$1</code>")
  return result
}

/**
 * Converts common markdown-style content into Telegram-safe HTML.
 * Telegram HTML supports: b, i, u, s, code, pre, a
 */
export function toTelegramHtml(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const blocks: string[] = []
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    blocks.push(applyInlineFormatting(paragraph.join("\n")))
    paragraph = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const heading = line.match(/^#{1,6}\s+(.+)$/)
    const bullet = line.match(/^[-*•]\s+(.+)$/)

    if (heading) {
      flushParagraph()
      blocks.push(`<b>${escapeHtml(heading[1])}</b>`)
      continue
    }

    if (bullet) {
      flushParagraph()
      blocks.push(`• ${applyInlineFormatting(bullet[1])}`)
      continue
    }

    if (line.trim() === "") {
      flushParagraph()
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()
  return blocks.join("\n\n")
}
