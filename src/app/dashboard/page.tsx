"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardCheckoutSync from "@/components/dashboard/DashboardCheckoutSync"
import DashboardCreateWorkspace, {
  type StylePreset,
} from "@/components/dashboard/DashboardCreateWorkspace"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardQuickTryCard from "@/components/dashboard/DashboardQuickTryCard"
import DashboardStatsPanel from "@/components/dashboard/DashboardStatsPanel"
import BrandVoiceSettings from "@/components/dashboard/BrandVoiceSettings"
import GeneratedOutputPanel from "@/components/dashboard/GeneratedOutputPanel"
import GenerationHistory from "@/components/dashboard/GenerationHistory"
import GuestProTrialBanner from "@/components/marketing/GuestProTrialBanner"
import {
  formatShortsScriptForCopy,
  formatTwitterThreadForCopy,
} from "@/lib/ai/content-pack"
import {
  buildDashboardUserData,
  ensureServerProfile,
  fetchDashboardDataViaApi,
  fetchDashboardDataViaClient,
} from "@/lib/dashboard/load-user-data"
import { formatSupabaseError } from "@/lib/dashboard/user-data-loader"
import type { GeneratedContent, GenerationRecord } from "@/lib/generations"
import { isProMaxTier, isProTier, type UserTier } from "@/lib/profile"
import type { TrialUiState } from "@/lib/trial/ui"
import { BASE_TRIAL_DAYS } from "@/lib/trial/types"
import { createClient } from "@/lib/supabase/client"

const PRESET_TONES: Record<StylePreset, string> = {
  "viral-thread": "Engaging",
  "deep-dive": "Persuasive",
  "punchy-short": "Punchy",
}

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
  const [trial, setTrial] = useState<TrialUiState | null>(null)
  const [trialModalOpen, setTrialModalOpen] = useState(false)
  const router = useRouter()

  const handleCreditsUpdated = useCallback((updatedCredits: number) => {
    setCredits(updatedCredits)
    setIsGuest(false)
    setAuthChecked(true)
  }, [])

  const hasTrialAccess = Boolean(trial?.isValid)
  const outOfCredits =
    !isGuest &&
    authChecked &&
    credits !== null &&
    credits <= 0 &&
    !hasTrialAccess

  const planLabel = getPlanLabel(tier, isGuest)

  const usageStats = useMemo(() => {
    const used = generations.length
    const remaining = credits ?? 0
    return { used, remaining }
  }, [generations.length, credits])

  const fetchUserData = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsGuest(true)
      setCredits(null)
      setTier("starter")
      setBrandVoice(null)
      setTgChannelId(null)
      setGenerations([])
      setTrial(null)
      setAuthChecked(true)
      return
    }

    setIsGuest(false)

    const applyDashboardData = (data: Awaited<
      ReturnType<typeof fetchDashboardDataViaClient>
    >) => {
      setCredits(data.credits)
      setTier(data.tier)
      setBrandVoice(data.brandVoice)
      setTgChannelId(data.tgChannelId)
      setGenerations(data.generations)
      setTrial(data.trial)
      setAuthChecked(true)
    }

    try {
      let apiResult = await fetchDashboardDataViaApi()

      if (!apiResult.ok && apiResult.status === 401) {
        await supabase.auth.refreshSession()
        router.refresh()
        await ensureServerProfile()
        apiResult = await fetchDashboardDataViaApi()
      }

      if (apiResult.ok) {
        applyDashboardData(apiResult.data)
        return
      }

      if (apiResult.status !== 401) {
        console.warn(
          "Dashboard user-data API unavailable, using client fallback:",
          apiResult.status
        )
      }

      await ensureServerProfile()
      const clientData = await fetchDashboardDataViaClient(supabase, user.id)
      applyDashboardData(clientData)
    } catch (error) {
      console.error("Error fetching user data:", formatSupabaseError(error))
      applyDashboardData(buildDashboardUserData(null, [], []))
    }
  }, [router])

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
        if (
          generateResponse.status === 403 &&
          errorData.code === "TRIAL_EXPIRED"
        ) {
          setTrial((current) => ({
            ...(current ?? {
              totalTrialDays: BASE_TRIAL_DAYS,
              trialStartAt: null,
              trialEndAt: null,
              trialExtendedDays: 0,
              claimedActions: [],
            }),
            isValid: false,
            daysRemaining: 0,
            accountStatus: "trial",
          }))
          setTrialModalOpen(true)
          return
        }
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

      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
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
    document.getElementById("results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
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

  const hasResults = Boolean(
    generatedOutputs.outputX ||
      generatedOutputs.outputLinkedIn ||
      generatedOutputs.outputTelegram
  )

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Suspense fallback={null}>
        <DashboardCheckoutSync
          onCreditsUpdated={handleCreditsUpdated}
          onRefresh={fetchUserData}
        />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07),transparent_55%)]" />

      <DashboardHeader
        isGuest={isGuest}
        authChecked={authChecked}
        tier={tier}
        credits={credits}
        trial={trial}
        trialModalOpen={trialModalOpen}
        onTrialUpdated={setTrial}
        onTrialModalOpenChange={setTrialModalOpen}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {authChecked && isGuest ? (
          <div className="mb-6 space-y-4">
            <GuestProTrialBanner variant="card" visible />
            <DashboardQuickTryCard />
          </div>
        ) : null}

        {!isGuest && authChecked && hasTrialAccess ? (
          <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-violet-100/90">
            Pro trial active — paste a link below to generate unlimited posts
            during your trial.
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-8">
            <DashboardCreateWorkspace
              youtubeUrl={youtubeUrl}
              onYoutubeUrlChange={setYoutubeUrl}
              stylePreset={stylePreset}
              onStylePresetChange={setStylePreset}
              isLoading={isLoading}
              isGuest={isGuest}
              outOfCredits={outOfCredits}
              onGenerate={handleGenerate}
            />

            <section id="results" className="scroll-mt-36">
              {hasResults ? (
                <GeneratedOutputPanel
                  content={generatedOutputs}
                  tier={tier}
                  tgChannelId={tgChannelId}
                  onTgChannelSaved={setTgChannelId}
                  styleTone={PRESET_TONES[stylePreset]}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-12 text-center">
                  <p className="text-sm font-medium text-zinc-300">
                    Your generated posts will appear here
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Use the{" "}
                    <a
                      href="#create"
                      className="text-violet-400 hover:text-violet-300"
                    >
                      Create
                    </a>{" "}
                    workspace above, or{" "}
                    <Link
                      href="/#trial-demo"
                      className="text-violet-400 hover:text-violet-300"
                    >
                      try the live preview
                    </Link>{" "}
                    first.
                  </p>
                </div>
              )}
            </section>

            <section id="history" className="scroll-mt-36">
              <GenerationHistory
                generations={generations}
                isGuest={isGuest}
                authChecked={authChecked}
                activeId={activeGenerationId}
                onView={handleViewGeneration}
                onCopy={handleCopyGeneration}
              />
            </section>

            <section id="settings" className="scroll-mt-36">
              <BrandVoiceSettings
                tier={tier}
                brandVoice={brandVoice}
                isGuest={isGuest}
                authChecked={authChecked}
                onSaved={setBrandVoice}
              />
            </section>
          </div>

          <div className="xl:sticky xl:top-36 xl:self-start">
            <DashboardStatsPanel
              authChecked={authChecked}
              isGuest={isGuest}
              tier={tier}
              planLabel={planLabel}
              creditsRemaining={usageStats.remaining}
              generationsCount={usageStats.used}
              hasTrialAccess={hasTrialAccess}
              trialDaysRemaining={trial?.daysRemaining}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
