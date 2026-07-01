export function isLikelyNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase()
    return (
      message.includes("failed to fetch") ||
      message.includes("networkerror") ||
      message.includes("load failed")
    )
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes("failed to fetch") ||
      message.includes("network error") ||
      message.includes("networkerror")
    )
  }

  return false
}
