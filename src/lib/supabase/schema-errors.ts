import type { PostgrestError } from "@supabase/supabase-js"

export function isMissingSchemaError(
  error: PostgrestError | null | undefined
): boolean {
  if (!error) {
    return false
  }

  if (error.code === "42703" || error.code === "42P01") {
    return true
  }

  const message = error.message?.toLowerCase() ?? ""
  return (
    message.includes("does not exist") ||
    message.includes("could not find") ||
    message.includes("column") ||
    message.includes("relation")
  )
}
