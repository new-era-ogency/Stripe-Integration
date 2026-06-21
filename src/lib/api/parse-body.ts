import { NextResponse } from "next/server"
import { z } from "zod"

export function parseJsonBody<T extends z.ZodType>(
  body: unknown,
  schema: T
): { data: z.infer<T> } | NextResponse {
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request body"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return { data: parsed.data }
}
