"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardCheckoutSync from "@/components/dashboard/DashboardCheckoutSync"
import BrandVoiceSettings from "@/components/dashboard/BrandVoiceSettings"
import GeneratedOutputPanel from "@/components/dashboard/GeneratedOutputPanel"
import GenerationHistory from "@/components/dashboard/GenerationHistory"
import AuthNavButtons from "@/components/layout/AuthNavButtons"
import CreditBalance from "@/components/layout/CreditBalance"
import { INSUFFICIENT_CREDITS_MESSAGE } from "@/lib/credits"
import type { GeneratedContent, GenerationRecord } from "@/lib/generations"
import {
  formatShortsScriptForCopy,
  formatTwitterThreadForCopy,
} from "@/lib/ai/content-pack"
import { isProTier, type UserTier } from "@/lib/profile"
import { Loader2 } from "lucide-react"
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

const metricCardClass =
  "rounded-xl border border-zinc-900 bg-[#050505] p-4 shadow-[0_0_24px_-12px_rgba(139,92,246,0.08)]"

const emptyGeneratedContent = (): GeneratedContent => ({
  outputX: "",
  outputLinkedIn: "",
  outputTelegram: "",
})

function getAccountTier(tier: UserTier | null, isGuest: boolean) {
  if (isGuest) return { label: "GUEST ACCESS", isPro: false }
  if (tier === null) return { label: "—", isPro: false }
  return isProTier(tier)
    ? { label: "PRO PLAN", isPro: true }
    : { label: "STARTER", isPro: false }
}

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [tier, setTier] = useState<UserTier>("starter")
  const [brandVoice, setBrandVoice] = useState<string | null>(null)
  const [tgChannelId, setTgChannelId] = useState<string | null>(null)
  const [generations, setGenerations] = useState<GenerationRecord[]>([])
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(null)
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedContent>(
    emptyGeneratedContent
  )
  const [isGuest, setIsGuest] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [stylePreset, setStylePreset] = useState<StylePreset>("viral-thread")
  const [sessionClock, setSessionClock] = useState<string | null>(null)
  const router = useRouter()

  const handleCreditsUpdated = useCallback((updatedCredits: number) => {
    setCredits(updatedCredits)
    setIsGuest(false)
    setAuthChecked(true)
  }, [])

  const accountTier = getAccountTier(tier, isGuest)
  const outOfCredits =
    !isGuest && authChecked && credits !== null && credits <= 0

  const usageStats = useMemo(() => {
    const used = generations.length
    const remaining = credits ?? 0
    const total = used + remaining
    const ratio = total > 0 ? (used / total) * 100 : 0
    return { used, remaining, total, ratio }
  }, [generations.length, credits])

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/user-data")
      if (response.status === 401) {
        setIsGuest(true)
        setCredits(null)
        setTier("starter")
        setBrandVoice(null)
        setTgChannelId(null)
        setGenerations([])
        setAuthChecked(true)
        return
      }
      if (!response.ok) {
        setIsGuest(true)
        setCredits(null)
        setTier("starter")
        setBrandVoice(null)
        setTgChannelId(null)
        setGenerations([])
        setAuthChecked(true)
        return
      }
      const data = await response.json()
      setIsGuest(false)
      setCredits(data.credits)
      setTier(data.tier ?? data.profile?.tier ?? "starter")
      setBrandVoice(data.brandVoice ?? data.profile?.brand_voice ?? null)
      setTgChannelId(data.tgChannelId ?? data.profile?.tg_channel_id ?? null)
      setGenerations(data.generations ?? [])
      setAuthChecked(true)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setIsGuest(true)
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    fetchUserData()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserData()
    })

    return () => subscription.unsubscribe()
  }, [fetchUserData])

  useEffect(() => {
    const formatClock = () =>
      `${new Date().toISOString().slice(0, 19).replace("T", " ")} UTC`

    setSessionClock(formatClock())
    const intervalId = window.setInterval(() => {
      setSessionClock(formatClock())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const handleGenerate = async () => {
    if (isGuest) {
      router.push("/login")
      return
    }

    if (outOfCredits) {
      router.push("/pricing")
      return
    }

    setIsLoading(true)
    try {
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
        if (generateResponse.status === 403) {
          setCredits(0)
          router.push("/pricing")
          return
        }
        if (generateResponse.status === 401) {
          router.push("/login")
          return
        }
        throw new Error(errorData.error || "Failed to generate content")
      }

      const generatedContent = await generateResponse.json()
      setGeneratedOutputs({
        packTier: generatedContent.packTier,
        outputX: generatedContent.outputX ?? "",
        outputLinkedIn: generatedContent.outputLinkedIn ?? "",
        outputTelegram: generatedContent.outputTelegram ?? "",
        twitterThread: generatedContent.twitterThread,
        linkedinArticle: generatedContent.linkedinArticle,
        telegramPost: generatedContent.telegramPost,
        shortsScript: generatedContent.shortsScript,
      })
      if (typeof generatedContent.newCredits === "number") {
        setCredits(generatedContent.newCredits)
      }
      if (typeof generatedContent.generationId === "string") {
        setActiveGenerationId(generatedContent.generationId)
      }
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

  const handleViewGeneration = (record: GenerationRecord) => {
    setGeneratedOutputs(record.generated_content)
    setActiveGenerationId(record.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCopyGeneration = (record: GenerationRecord) => {
    const content = record.generated_content
    const twitterText =
      content.twitterThread && content.twitterThread.length > 0
        ? formatTwitterThreadForCopy(content.twitterThread)
        : content.outputX

    const combined = [
      twitterText && `--- Twitter Thread ---\n${twitterText}`,
      (content.linkedinArticle || content.outputLinkedIn) &&
        `--- LinkedIn ---\n${content.linkedinArticle ?? content.outputLinkedIn}`,
      (content.telegramPost || content.outputTelegram) &&
        `--- Telegram ---\n${content.telegramPost ?? content.outputTelegram}`,
      content.shortsScript &&
        `--- Shorts Script ---\n${formatShortsScriptForCopy(content.shortsScript)}`,
    ]
      .filter(Boolean)
      .join("\n\n")

    navigator.clipboard.writeText(combined)
    alert("Copied all platforms to clipboard!")
  }

  return (
    <div className="relative min-h-screen bg-[#000000] text-white">
      <Suspense fallback={null}>
        <DashboardCheckoutSync
          onCreditsUpdated={handleCreditsUpdated}
          onRefresh={fetchUserData}
        />
      </Suspense>
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
            {!isGuest && authChecked ? (
              <CreditBalance
                credits={credits}
                loading={!authChecked}
                linkToPricing
              />
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
            {sessionClock ?? "— UTC"}
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

            {outOfCredits ? (
              <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-center">
                <p className="font-mono text-xs text-amber-200/90">
                  {INSUFFICIENT_CREDITS_MESSAGE}
                </p>
                <Link
                  href="/pricing"
                  className="mt-2 inline-block font-mono text-xs text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline"
                >
                  View pricing plans →
                </Link>
              </div>
            ) : null}

            <Button
              onClick={handleGenerate}
              disabled={!youtubeUrl || isLoading || isGuest || outOfCredits}
              className="h-11 w-full rounded-lg bg-white font-medium text-black transition-all hover:bg-zinc-200 disabled:opacity-30"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </span>
              ) : isGuest ? (
                "Sign In to Generate"
              ) : outOfCredits ? (
                "Upgrade to Generate"
              ) : (
                "Execute Generation"
              )}
            </Button>
          </CardContent>
        </Card>

        <BrandVoiceSettings
          tier={tier}
          brandVoice={brandVoice}
          isGuest={isGuest}
          authChecked={authChecked}
          onSaved={setBrandVoice}
        />

        {generatedOutputs.outputX ? (
          <GeneratedOutputPanel
            content={generatedOutputs}
            tier={tier}
            tgChannelId={tgChannelId}
            onTgChannelSaved={setTgChannelId}
            styleTone={PRESET_TONES[stylePreset]}
          />
        ) : null}

        <GenerationHistory
          generations={generations}
          isGuest={isGuest}
          authChecked={authChecked}
          activeId={activeGenerationId}
          onView={handleViewGeneration}
          onCopy={handleCopyGeneration}
        />
      </div>
    </div>
  )
}
