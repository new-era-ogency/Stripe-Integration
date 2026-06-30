import { NextResponse } from "next/server"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import { enforceRateLimit } from "@/lib/api/security"

export function enforceOpenRouterFreeTierLimit(
  context: Record<string, unknown> = {}
): NextResponse | null {
  return enforceRateLimit("openrouter:production", RATE_LIMITS.openRouterFreeTier, context)
}
