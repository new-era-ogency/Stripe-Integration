"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import { CopyIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type GenerationHistory = {
  id: string
  video_url: string
  created_at: string
  output_x: string
  output_linkedin: string
  output_telegram: string
}

type StylePreset = "viral-thread" | "deep-dive" | "punchy-short"

const STYLE_PRESETS: { id: StylePreset; label: string }[] = [
  { id: "viral-thread", label: "Viral Thread" },
  { id: "deep-dive", label: "Deep Dive" },
  { id: "punchy-short", label: "Punchy/Short" },
]

const PRESET_TONES: Record<StylePreset, string> = {
  "viral-thread": "ENGAGING",
  "deep-dive": "PERSUASIVE",
  "punchy-short": "PUNCHY",
}

const CHAR_LIMITS = {
  x: 280,
  linkedin: 3000,
  telegram: 4096,
} as const

const tabTriggerClass =
  "rounded-none border-b-2 border-transparent bg-transparent text-xs uppercase tracking-wider text-zinc-500 shadow-none data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-white"

const textareaClass =
  "min-h-[200px] resize-none rounded-lg border-zinc-800 bg-[#020202] p-4 font-sans text-sm leading-relaxed tracking-wide text-zinc-200 shadow-inner focus-visible:ring-0"

const metricCardClass =
  "rounded-xl border border-zinc-900 bg-[#050505] p-4 shadow-[0_0_24px_-12px_rgba(139,92,246,0.08)]"

function estimateTokens(...texts: string[]) {
  const chars = texts.reduce((sum, t) => sum + t.length, 0)
  return Math.max(1, Math.ceil(chars / 4))
}

function getAccountTier(credits: number | null, isGuest: boolean) {
  if (isGuest) return { label: "GUEST ACCESS", isPro: false }
  if (credits === null) return { label: "—", isPro: false }
  return credits >= 20
    ? { label: "PRO PLAN", isPro: true }
    : { label: "FREE TRIAL", isPro: false }
}

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [history, setHistory] = useState<GenerationHistory[]>([])
  const [generatedOutputs, setGeneratedOutputs] = useState({
    outputX: "",
    outputLinkedIn: "",
    outputTelegram: "",
  })
  const [isGuest, setIsGuest] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [stylePreset, setStylePreset] = useState<StylePreset>("viral-thread")
  const router = useRouter()

  const accountTier = getAccountTier(credits, isGuest)

  const usageStats = useMemo(() => {
    const used = history.length
    const remaining = credits ?? 0
    const total = used + remaining
    const ratio = total > 0 ? (used / total) * 100 : 0
    return { used, remaining, total, ratio }
  }, [history.length, credits])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user-data")
      if (response.status === 401) {
        setIsGuest(true)
        setCredits(null)
        setHistory([])
        setAuthChecked(true)
        return
      }
      if (!response.ok) {
        setIsGuest(true)
        setCredits(null)
        setHistory([])
        setAuthChecked(true)
        return
      }
      const data = await response.json()
      setIsGuest(false)
      setCredits(data.credits)
      setHistory(data.history ?? [])
      setAuthChecked(true)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setIsGuest(true)
      setAuthChecked(true)
    }
  }

  useEffect(() => {
    fetchUserData()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserData()
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGenerate = async () => {
    if (isGuest) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const deductResponse = await fetch("/api/deduct-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!deductResponse.ok) {
        const errorData = await deductResponse.json()
        if (deductResponse.status === 401) {
          router.push("/login")
          return
        }
        if (deductResponse.status === 402) {
          alert("Insufficient credits. Redirecting to pricing...")
          router.push("/pricing")
        } else {
          throw new Error(errorData.error || "Failed to deduct credit")
        }
        return
      }

      const transcriptResponse = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: youtubeUrl }),
      })

      if (!transcriptResponse.ok) {
        const errorData = await transcriptResponse.json()
        throw new Error(errorData.error || "Failed to fetch transcript")
      }

      const data = await transcriptResponse.json()
      const rawTranscript = data.rawTranscript

      const generateResponse = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawTranscript, videoUrl: youtubeUrl }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const generatedContent = await generateResponse.json()
      setGeneratedOutputs(generatedContent)
      await fetchUserData()
    } catch (error) {
      console.error("Generation error:", error)
      alert(
        `Error: ${error instanceof Error ? error.message : "Failed to fetch transcript"}`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewHistory = (item: GenerationHistory) => {
    setGeneratedOutputs({
      outputX: item.output_x,
      outputLinkedIn: item.output_linkedin,
      outputTelegram: item.output_telegram,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const outputTabs = [
    {
      value: "x" as const,
      label: "X",
      content: generatedOutputs.outputX,
      charLimit: CHAR_LIMITS.x,
    },
    {
      value: "linkedin" as const,
      label: "LinkedIn",
      content: generatedOutputs.outputLinkedIn,
      charLimit: CHAR_LIMITS.linkedin,
    },
    {
      value: "telegram" as const,
      label: "Telegram",
      content: generatedOutputs.outputTelegram,
      charLimit: CHAR_LIMITS.telegram,
    },
  ]

  return (
    <div className="relative min-h-screen bg-[#000000] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-[#000000]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-black uppercase tracking-[0.35em] text-white"
            >
              PulseFlow
            </Link>
            <span className="hidden font-mono text-[10px] text-zinc-700 sm:inline">
              v1.0 · CMD_TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!isGuest && authChecked && credits !== null ? (
              <div className="rounded-full border border-zinc-800 bg-[#09090b] px-3 py-1.5 font-mono text-xs text-zinc-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                CREDITS · {credits}
              </div>
            ) : !authChecked ? (
              <div className="h-7 w-28 animate-pulse rounded-full bg-zinc-900" />
            ) : null}
            <AuthNavButtons
              signInClassName="rounded-full border border-zinc-800 bg-[#09090b] px-3 py-1.5 font-mono text-xs text-zinc-300 shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-colors hover:border-violet-500/30"
              signedInClassName="rounded-full border border-zinc-800 bg-[#09090b] px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-violet-500/30 hover:text-white"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between border-b border-zinc-900 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
              Content Terminal
            </p>
            <p className="mt-1 font-mono text-[11px] text-zinc-700">
              SESSION_ID ·{" "}
              {isGuest ? "ANON_GUEST" : "AUTH_ACTIVE"} · REGION_EU
            </p>
          </div>
          <p className="font-mono text-[10px] text-zinc-700">
            {new Date().toISOString().slice(0, 19).replace("T", " ")} UTC
          </p>
        </div>

        {isGuest && (
          <div className="mb-6 rounded-xl border border-zinc-900 bg-[#050505] px-4 py-3 text-center font-mono text-xs text-zinc-500">
            [GUEST_MODE] —{" "}
            <Link href="/" className="text-zinc-300 hover:text-white">
              explore demo
            </Link>{" "}
            ·{" "}
            <Link href="/login" className="text-zinc-300 hover:text-white">
              authenticate
            </Link>
          </div>
        )}

        {/* Analytics Bar */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className={metricCardClass}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Account Tier
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.8)] ${
                  isGuest ? "bg-zinc-600 shadow-none" : "bg-green-500"
                }`}
              />
              <span className="bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-sm font-semibold uppercase tracking-widest text-transparent">
                {accountTier.label}
              </span>
            </div>
            <p className="mt-2 font-mono text-[10px] text-zinc-700">
              UPTIME · 99.9% · NODE_ACTIVE
            </p>
          </div>

          <div className={metricCardClass}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Usage Analytics
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-sm text-zinc-300">
                {isGuest ? "— / —" : `${usageStats.used} / ${usageStats.total}`}
              </span>
              <span className="font-mono text-[10px] text-zinc-600">
                CREDITS
              </span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
                style={{
                  width: isGuest ? "0%" : `${Math.min(usageStats.ratio, 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 font-mono text-[10px] text-zinc-700">
              {isGuest
                ? "AUTH REQUIRED FOR METRICS"
                : `${usageStats.remaining} REMAINING · ${usageStats.used} CONSUMED`}
            </p>
          </div>

          <div className={metricCardClass}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Engine Status
            </p>
            <p className="mt-2 text-xs leading-snug text-zinc-300">
              Claude 3.5 Sonnet
              <span className="text-zinc-600"> via </span>
              OpenRouter
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded border border-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                LATENCY: ~1.2s
              </span>
              <span className="rounded border border-green-900/50 bg-green-950/20 px-1.5 py-0.5 font-mono text-[10px] text-green-500/80">
                STATUS: OPERATIONAL
              </span>
            </div>
          </div>
        </div>

        {/* Generation Card */}
        <Card className="mb-6 gap-0 rounded-xl border-zinc-900 bg-[#050505] py-0 shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)]">
          <CardHeader className="border-b border-zinc-900 px-5 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Generate Content
              </CardTitle>
              <span className="font-mono text-[10px] text-zinc-700">
                PRESET · {stylePreset.toUpperCase().replace("-", "_")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-5 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="youtube-url"
                className="font-mono text-[10px] uppercase tracking-widest text-zinc-600"
              >
                Input · YouTube URL
              </Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="h-11 rounded-lg border-zinc-800 bg-[#010101] font-mono text-sm text-white shadow-none placeholder:text-zinc-700 focus-visible:border-violet-500 focus-visible:ring-0"
              />
            </div>

            <div className="rounded-lg border border-zinc-900 bg-[#010101] p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                System Instructions
              </p>
              <p className="mb-3 font-mono text-[11px] leading-relaxed text-zinc-500">
                Extract transcript → apply{" "}
                <span className="text-zinc-400">
                  {STYLE_PRESETS.find((p) => p.id === stylePreset)?.label}
                </span>{" "}
                tone → emit X / LinkedIn / Telegram payloads in parallel.
              </p>
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setStylePreset(preset.id)}
                    className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-all ${
                      stylePreset === preset.id
                        ? "border-zinc-600 bg-zinc-900 text-zinc-200"
                        : "border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!youtubeUrl || isLoading}
              className="h-11 w-full rounded-lg bg-white font-medium text-black transition-all hover:bg-zinc-200 disabled:opacity-30"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </span>
              ) : isGuest ? (
                "Sign In to Generate"
              ) : (
                "Execute Generation"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Tabs */}
        {generatedOutputs.outputX && (
          <Card className="mb-6 gap-0 rounded-xl border-zinc-900 bg-[#050505] py-0 shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)]">
            <CardHeader className="border-b border-zinc-900 px-5 py-4">
              <CardTitle className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Generated Output · 3 Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <Tabs defaultValue="x">
                <TabsList className="grid h-auto w-full grid-cols-3 gap-0 rounded-none border-b border-zinc-900 bg-transparent p-0">
                  {outputTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={tabTriggerClass}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {outputTabs.map((tab) => {
                  const charCount = tab.content.length
                  const tone = PRESET_TONES[stylePreset]
                  return (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center justify-between px-0.5">
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-zinc-600">
                          <span>
                            CHARS: {charCount}/{tab.charLimit}
                          </span>
                          <span className="text-zinc-800">|</span>
                          <span>TONE: {tone}</span>
                          <span className="text-zinc-800">|</span>
                          <span>
                            TOKENS ≈ {estimateTokens(tab.content)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(tab.content)}
                          className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 transition-colors hover:text-white"
                          aria-label={`Copy ${tab.label} content`}
                        >
                          <CopyIcon className="h-3.5 w-3.5" />
                          COPY
                        </button>
                      </div>
                      <Textarea
                        value={tab.content}
                        readOnly
                        className={textareaClass}
                      />
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* History Grid */}
        <section className="border-t border-zinc-900 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              Generation History · Log
            </h2>
            {!isGuest && (
              <span className="font-mono text-[10px] text-zinc-700">
                {history.length} RECORD{history.length !== 1 ? "S" : ""}
              </span>
            )}
          </div>

          {isGuest ? (
            <div className="rounded-xl border border-dashed border-zinc-900 bg-[#020202] px-6 py-10 text-center">
              <p className="font-mono text-[11px] text-zinc-600">
                [SYSTEM: AUTHENTICATION REQUIRED TO ACCESS HISTORY LOG]
              </p>
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-950 bg-[#020202] px-6 py-12 text-center">
              <p className="font-mono text-[11px] leading-relaxed text-zinc-600">
                [SYSTEM: NO PREVIOUS GENERATIONS FOUND IN REGION_EU]
              </p>
              <p className="mt-2 font-mono text-[10px] text-zinc-800">
                AWAITING FIRST INPUT STREAM...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-900">
                    <th className="pb-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Video URL
                    </th>
                    <th className="pb-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Date
                    </th>
                    <th className="pb-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Platforms
                    </th>
                    <th className="pb-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Tokens
                    </th>
                    <th className="pb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const tokens = estimateTokens(
                      item.output_x,
                      item.output_linkedin,
                      item.output_telegram
                    )
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-zinc-900/50"
                      >
                        <td className="max-w-[180px] truncate py-3 pr-3">
                          <a
                            href={item.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-zinc-200 hover:underline"
                          >
                            {item.video_url}
                          </a>
                        </td>
                        <td className="whitespace-nowrap py-3 pr-3 font-mono text-[10px] text-zinc-600">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex gap-1">
                            {item.output_x && (
                              <span className="rounded border border-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
                                X
                              </span>
                            )}
                            {item.output_linkedin && (
                              <span className="rounded border border-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
                                LI
                              </span>
                            )}
                            {item.output_telegram && (
                              <span className="rounded border border-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
                                TG
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-3 font-mono text-[10px] text-zinc-600">
                          ~{tokens}
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => handleViewHistory(item)}
                            className="rounded border border-zinc-800 px-2.5 py-0.5 font-mono text-[10px] text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
