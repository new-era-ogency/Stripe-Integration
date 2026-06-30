import { NextResponse } from "next/server"
import { AGENT_SYSTEM_PROMPT } from "@/lib/ai/agent-system-prompt"
import {
  AGENT_MODEL,
  createOpenRouterClientForUser,
} from "@/lib/ai/openrouter-client"
import { openRouterErrorResponse } from "@/lib/ai/openrouter-errors"
import { enforceOpenRouterFreeTierLimit } from "@/lib/ai/openrouter-rate-limit"
import { parseRequestJsonBody } from "@/lib/api/parse-body"
import { RATE_LIMITS } from "@/lib/api/rate-limits"
import {
  enforceRateLimit,
  getClientIp,
  internalErrorResponse,
} from "@/lib/api/security"
import { requireUserApiKey } from "@/lib/api/user-api-key"
import { agentRequestSchema } from "@/lib/validation"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const MAX_OUTPUT_TOKENS = 500
const TEMPERATURE = 0.3

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rateLimited = enforceRateLimit(`agent:${ip}`, RATE_LIMITS.agent, { ip })

  if (rateLimited) {
    return rateLimited
  }

  const userKey = requireUserApiKey(request)
  if (userKey instanceof NextResponse) {
    return userKey
  }

  const openRouterLimited = enforceOpenRouterFreeTierLimit({ ip })
  if (openRouterLimited) {
    return openRouterLimited
  }

  try {
    const parsed = await parseRequestJsonBody(request, agentRequestSchema)

    if (parsed instanceof NextResponse) {
      return parsed
    }

    const { message } = parsed.data
    const client = createOpenRouterClientForUser(userKey.apiKey)

    const completion = await client.chat.completions.create({
      model: AGENT_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: TEMPERATURE,
      messages: [
        { role: "system", content: AGENT_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    })

    const reply = completion.choices[0]?.message?.content?.trim()

    if (!reply) {
      return NextResponse.json(
        { error: "The agent returned an empty response" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      reply,
      model: completion.model ?? AGENT_MODEL,
      usage: completion.usage ?? null,
    })
  } catch (error) {
    const rateLimitResponse = openRouterErrorResponse(error)
    if (rateLimitResponse) {
      console.warn("[agent] OpenRouter rate limit:", error)
      return rateLimitResponse
    }

    return internalErrorResponse("agent", error, { ip })
  }
}
