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
import SubscriptionTierBadge from "@/components/layout/SubscriptionTierBadge"
import { INSUFFICIENT_CREDITS_MESSAGE } from "@/lib/credits"
import type { GeneratedContent, GenerationRecord } from "@/lib/generations"
import {
  formatShortsScriptForCopy,
  formatTwitterThreadForCopy,
} from "@/lib/ai/content-pack"
import { isProMaxTier, isProTier, type UserTier } from "@/lib/profile"
import { Loader2, Sparkles, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

type StylePreset = "viral-thread" | "deep-dive" | "punchy-short"

const STYLE_PRESETS: {
  id: StylePreset
  label: string
  description: string
}[] = [
  {
    id: "viral-thread",
    label: "Viral Thread",
    description: "Hook-driven posts built for shares",
  },
  {
    id: "deep-dive",
    label: "Deep Dive",
    description: "Thoughtful, authority-building content",
  },
  {
    id: "punchy-short",
    label: "Punchy/Short",
    description: "Fast, high-impact snippets",
  },
]

const PRESET_TONES: Record<StylePreset, string> = {
  "viral-thread": "Engaging",
  "deep-dive": "Persuasive",
  "punchy-short": "Punchy",
}

const statCardClass =
  "rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-colors hover:border-zinc-700/80"

const emptyGeneratedContent = (): GeneratedContent => ({
  outputX: "",
  outputLinkedIn: "",
  outputTelegram: "",
})

function getPlanLabel(tier: UserTier | null, isGuest: boolean) {
  if (isGuest) return "Guest"
  if (tier === null) return "—"
  if (isProMaxTier(tier)) return "Pro Max"
  if (isProTier(tier)) return "Pro"
  return "Starter"
}

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [tier, setTier] = useState<UserTier>("starter")
  const [brandVoice, setBrandVoice] = useState<string | null>(null)
  const [tgChannelId, setTgChannelId] = useState<string | null>(null)
  const [generations, setGenerations] = useState<GenerationRecord[]>([])
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(
    null
  )
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedContent>(
    emptyGeneratedContent
  )
  const [isGuest, setIsGuest] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [stylePreset, setStylePreset] = useState<StylePreset>("viral-thread")
  const router = useRouter()

  const handleCreditsUpdated = useCallback((updatedCredits: number) => {
    setCredits(updatedCredits)
    setIsGuest(false)
    setAuthChecked(true)
  }, [])

  const isPro = isProTier(tier) && !isGuest
  const isProMax = isProMaxTier(tier) && !isGuest
  const outOfCredits =
    !isGuest && authChecked && credits !== null && credits <= 0

  const planLabel = getPlanLabel(tier, isGuest)

  const usageStats = useMemo(() => {
    const used = generations.length
    const remaining = credits ?? 0
    return { used, remaining }
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
        if (generateResponse.status === 403 || generateResponse.status === 402) {
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
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Suspense fallback={null}>
        <DashboardCheckoutSync
          onCreditsUpdated={handleCreditsUpdated}
          onRefresh={fetchUserData}
        />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07),transparent_55%)]" />

      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 text-sm font-semibold tracking-tight text-white"
            >
              PulseFlow
            </Link>
            {!isGuest && authChecked ? (
              <SubscriptionTierBadge tier={tier} isGuest={false} />
            ) : !authChecked ? (
              <div className="h-9 w-[7.5rem] animate-pulse rounded-full bg-zinc-900" />
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {!isGuest && authChecked ? (
              <CreditBalance
                credits={credits}
                loading={!authChecked}
                linkToPricing
              />
            ) : !authChecked ? (
              <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-900" />
            ) : null}
            <AuthNavButtons
              signInClassName="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
              signedInClassName="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Turn any YouTube video into ready-to-post content.
          </p>
        </div>

        {isGuest && (
          <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-center text-sm text-zinc-400">
            Sign in to generate content and save your history.{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/" className="text-violet-400 hover:text-violet-300">
              explore the homepage
            </Link>
            .
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={statCardClass}>
            <p className="text-sm text-zinc-500">Plan</p>
            <div className="mt-2 flex items-center gap-2">
              {!authChecked ? (
                <div className="h-7 w-28 animate-pulse rounded bg-zinc-900" />
              ) : (
                <>
                  {isProMax ? (
                    <Zap className="size-4 text-orange-400" />
                  ) : isPro ? (
                    <Sparkles className="size-4 text-violet-400" />
                  ) : (
                    <span className="size-2 rounded-full bg-zinc-600" />
                  )}
                  <p className="text-lg font-medium text-white">
                    {isGuest ? "Guest" : `${planLabel} Plan`}
                  </p>
                </>
              )}
            </div>
            {!isGuest && authChecked && !isPro ? (
              <Link
                href="/pricing"
                className="mt-2 inline-block text-xs text-violet-400 hover:text-violet-300"
              >
                Upgrade to Pro →
              </Link>
            ) : !isGuest && authChecked && isPro && !isProMax ? (
              <Link
                href="/pricing"
                className="mt-2 inline-block text-xs text-orange-400 hover:text-orange-300"
              >
                Unlock Viral Shorts → Pro Max
              </Link>
            ) : null}
          </div>

          <div className={statCardClass}>
            <p className="text-sm text-zinc-500">Credits remaining</p>
            {!authChecked ? (
              <div className="mt-2 h-7 w-36 animate-pulse rounded bg-zinc-900" />
            ) : (
              <p className="mt-2 text-lg font-medium text-white">
                {isGuest ? "—" : `${usageStats.remaining} remaining`}
              </p>
            )}
            {!isGuest && authChecked ? (
              <p className="mt-1 text-xs text-zinc-500">
                1 credit per generation
              </p>
            ) : null}
          </div>

          <div className={statCardClass}>
            <p className="text-sm text-zinc-500">Generations saved</p>
            {!authChecked ? (
              <div className="mt-2 h-7 w-16 animate-pulse rounded bg-zinc-900" />
            ) : (
              <p className="mt-2 text-lg font-medium text-white">
                {isGuest ? "—" : usageStats.used}
              </p>
            )}
            {!isGuest && authChecked ? (
              <p className="mt-1 text-xs text-zinc-500">
                View history below
              </p>
            ) : null}
          </div>
        </div>

        <Card className="mb-8 gap-0 rounded-xl border-zinc-800 bg-zinc-950 py-0 shadow-none">
          <CardHeader className="space-y-1 px-6 pt-6 pb-0">
            <CardTitle className="text-base font-medium text-white">
              Generate content
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Paste a YouTube link and choose how you want it written.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="text-sm text-zinc-300">
                YouTube URL
              </Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="h-11 rounded-lg border-zinc-800 bg-zinc-900/80 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-zinc-300">Tone / style preset</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {STYLE_PRESETS.map((preset) => {
                  const selected = stylePreset === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setStylePreset(preset.id)}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        selected
                          ? "border-violet-500/50 bg-violet-500/10 ring-1 ring-violet-500/30"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          selected ? "text-white" : "text-zinc-200"
                        }`}
                      >
                        {preset.label}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {preset.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {outOfCredits ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-sm text-amber-200/90">
                  {INSUFFICIENT_CREDITS_MESSAGE}
                </p>
                <Link
                  href="/pricing"
                  className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300"
                >
                  View pricing →
                </Link>
              </div>
            ) : null}

            <Button
              onClick={handleGenerate}
              disabled={!youtubeUrl || isLoading || isGuest || outOfCredits}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-medium text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.5)] transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.6)] disabled:opacity-40 disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </span>
              ) : isGuest ? (
                "Sign in to generate"
              ) : outOfCredits ? (
                "Upgrade to generate"
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Generate content
                </span>
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
