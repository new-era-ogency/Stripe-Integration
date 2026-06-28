#!/usr/bin/env node
/**
 * Temporary integration test for in-memory API rate limits.
 * Usage:
 *   node scripts/test-rate-limits.mjs
 *   node scripts/test-rate-limits.mjs --endpoint feedback --count 50
 *   node scripts/test-rate-limits.mjs --endpoint trial-preview --base-url http://localhost:3000
 */

const ENDPOINTS = {
  feedback: {
    path: "/api/feedback",
    limit: 8,
    window: "1 hour",
    buildBody: (index) => ({
      rating: 5,
      comment: `Rate limit integration test request #${index}`,
      metadata: { source: "rate-limit-test", trigger: "script" },
    }),
  },
  "trial-preview": {
    path: "/api/trial/preview",
    limit: 30,
    window: "1 hour",
    buildBody: (index) => ({
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  },
}

function parseArgs(argv) {
  const args = {
    endpoint: "feedback",
    count: 50,
    baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
    mode: "burst",
    testIp: `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
  }

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--endpoint" && argv[i + 1]) {
      args.endpoint = argv[++i]
    } else if (arg === "--count" && argv[i + 1]) {
      args.count = Number.parseInt(argv[++i], 10)
    } else if (arg === "--base-url" && argv[i + 1]) {
      args.baseUrl = argv[++i]
    } else if (arg === "--mode" && argv[i + 1]) {
      args.mode = argv[++i]
    } else if (arg === "--test-ip" && argv[i + 1]) {
      args.testIp = argv[++i]
    }
  }

  return args
}

async function sendRequest(baseUrl, config, index, testIp) {
  const started = performance.now()
  const url = `${baseUrl.replace(/\/$/, "")}${config.path}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Rate-Limit-Test": "true",
        "X-Forwarded-For": testIp,
      },
      body: JSON.stringify(config.buildBody(index)),
    })

    const elapsedMs = Math.round(performance.now() - started)
    let bodyPreview = ""

    try {
      const text = await response.text()
      bodyPreview = text.slice(0, 120).replace(/\s+/g, " ")
    } catch {
      bodyPreview = "<unreadable body>"
    }

    return {
      index,
      status: response.status,
      retryAfter: response.headers.get("retry-after"),
      elapsedMs,
      bodyPreview,
    }
  } catch (error) {
    return {
      index,
      status: 0,
      retryAfter: null,
      elapsedMs: Math.round(performance.now() - started),
      bodyPreview:
        error instanceof Error ? error.message : "Unknown network error",
    }
  }
}

function printLine(result) {
  const statusLabel =
    result.status === 429
      ? "BLOCKED (429)"
      : result.status === 0
        ? "NETWORK ERROR"
        : `HTTP ${result.status}`

  const retry = result.retryAfter ? ` retry-after=${result.retryAfter}s` : ""

  console.log(
    `#${String(result.index).padStart(2, "0")}  ${statusLabel.padEnd(16)}  ${String(result.elapsedMs).padStart(4)}ms${retry}  ${result.bodyPreview}`
  )
}

async function main() {
  const args = parseArgs(process.argv)
  const config = ENDPOINTS[args.endpoint]

  if (!config) {
    console.error(
      `Unknown endpoint "${args.endpoint}". Choose one of: ${Object.keys(ENDPOINTS).join(", ")}`
    )
    process.exit(1)
  }

  if (!Number.isFinite(args.count) || args.count < 1) {
    console.error("--count must be a positive integer")
    process.exit(1)
  }

  console.log("PulseFlow rate-limit integration test")
  console.log("=".repeat(72))
  console.log(`Target:     ${args.baseUrl}${config.path}`)
  console.log(`Configured: ${config.limit} requests / ${config.window} per IP`)
  console.log(`Mode:       ${args.mode} (${args.count} requests)`)
  console.log(`Test IP:    ${args.testIp} (via X-Forwarded-For)`)
  console.log(`Expected:   first 429 at request #${config.limit + 1}`)
  console.log("=".repeat(72))

  const startedAt = Date.now()
  let results

  if (args.mode === "sequential") {
    results = []
    for (let i = 1; i <= args.count; i += 1) {
      results.push(await sendRequest(args.baseUrl, config, i, args.testIp))
    }
  } else {
    results = await Promise.all(
      Array.from({ length: args.count }, (_, idx) =>
        sendRequest(args.baseUrl, config, idx + 1, args.testIp)
      )
    )
  }

  results.sort((a, b) => a.index - b.index)

  console.log("\nRequest log")
  console.log("-".repeat(72))
  for (const result of results) {
    printLine(result)
  }

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(2)
  const statusCounts = results.reduce(
    (acc, result) => {
      const key = result.status === 0 ? "network" : String(result.status)
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    },
    {}
  )

  const first429 = results.find((result) => result.status === 429)
  const blocked = results.filter((result) => result.status === 429)
  const allowed = results.filter((result) => result.status !== 429)

  console.log("\nSummary")
  console.log("-".repeat(72))
  console.log(`Total requests:      ${results.length}`)
  console.log(`Completed in:        ${elapsedSec}s`)
  console.log(`Status breakdown:    ${JSON.stringify(statusCounts)}`)
  console.log(`Allowed (<429):      ${allowed.length}`)
  console.log(`Blocked (429):       ${blocked.length}`)

  if (first429) {
    console.log(`First 429 at:        request #${first429.index}`)
    console.log(
      `Retry-After header:  ${first429.retryAfter ?? "missing"} seconds`
    )
    console.log("Result:              PASS — rate limiter engaged under spam load")
  } else {
    console.log("First 429 at:        never triggered")
    console.log(
      "Result:              FAIL — expected 429 before request burst finished"
    )
    process.exitCode = 1
  }

  if (allowed.length > config.limit) {
    console.log(
      `Warning:             ${allowed.length} non-429 responses exceeds configured limit of ${config.limit}`
    )
  }
}

main()
