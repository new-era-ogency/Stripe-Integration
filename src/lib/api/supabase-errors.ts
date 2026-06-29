import { NextResponse } from "next/server"

type SupabaseLikeError = {
  message?: string
  details?: string
  hint?: string
  code?: string
}

export function getSupabaseErrorMessage(error: SupabaseLikeError): string {
  return (
    error.message?.trim() ||
    error.details?.trim() ||
    error.hint?.trim() ||
    "Database operation failed"
  )
}

export function supabaseRpcErrorResponse(
  scope: string,
  error: SupabaseLikeError,
  context: Record<string, unknown> = {}
): NextResponse {
  const message = getSupabaseErrorMessage(error)

  console.error(`[${scope}]`, error, context)

  if (message.includes("Pro tier required")) {
    return NextResponse.json({ error: message }, { status: 403 })
  }

  if (message.includes("Unauthorized")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ error: message }, { status: 500 })
}
