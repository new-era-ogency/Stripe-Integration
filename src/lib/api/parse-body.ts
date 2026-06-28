import { NextResponse } from "next/server"
import { z } from "zod"
import { DEFAULT_MAX_JSON_BYTES, readJsonBody } from "@/lib/api/security"
import { rejectClientSecretsInBody } from "@/lib/api/secret-guard"

export function parseJsonBody<T extends z.ZodType>(
  body: unknown,
  schema: T
): { data: z.infer<T> } | NextResponse {
  const secretViolation = rejectClientSecretsInBody(body)

  if (secretViolation) {
    return NextResponse.json({ error: secretViolation }, { status: 400 })
  }

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request body"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return { data: parsed.data }
}

export async function parseRequestJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
  options?: { maxBytes?: number }
): Promise<{ data: z.infer<T> } | NextResponse> {
  const raw = await readJsonBody(request, options?.maxBytes ?? DEFAULT_MAX_JSON_BYTES)

  if (!raw.ok) {
    return raw.response
  }

  return parseJsonBody(raw.body, schema)
}
