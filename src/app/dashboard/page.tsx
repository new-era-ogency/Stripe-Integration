"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardCreateWorkspace, {
  type StylePreset,
} from "@/components/dashboard/DashboardCreateWorkspace"
import DashboardQuickTryCard from "@/components/dashboard/DashboardQuickTryCard"
import DashboardStatsPanel from "@/components/dashboard/DashboardStatsPanel"
import DashboardSettingsPanel from "@/components/dashboard/DashboardSettingsPanel"
import GeneratedOutputPanel from "@/components/dashboard/GeneratedOutputPanel"
import GenerationHistory from "@/components/dashboard/GenerationHistory"
import { useToast } from "@/components/feedback/ToastProvider"
import { useOpenAiKey } from "@/components/openai/OpenAiKeyProvider"
import {
  formatShortsScriptForCopy,
  formatTwitterThreadForCopy,
} from "@/lib/ai/content-pack"
import {
  buildDashboardUserData,
  loadDashboardDataForUser,
  type DashboardUserData,
} from "@/lib/dashboard/load-user-data"
import { formatSupabaseError } from "@/lib/dashboard/user-data-loader"
import type { GeneratedContent, GenerationRecord } from "@/lib/generations"
import { requestGenerateContent } from "@/lib/api/generate-content-client"
import { type UserTier } from "@/lib/profile"
import {
  OpenAiByokError,
  readStoredOpenAiKey,
} from "@/lib/openai/client-key"
import { createClient } from "@/lib/supabase/client"
import { getClientAuthUser } from "@/lib/supabase/client-auth"
import type { ContentSourceInput } from "@/lib/content-sources/types"
import { resolveTranscriptFromSource } from "@/lib/content-sources/resolve-transcript"
import { isAbortError, isLikelyNetworkError } from "@/lib/generation/abort"
import {
  advanceToStage,
  createGenerationProgress,
  mapPhaseToStage,
  switchToExtractStage,
  type GenerationProgressState,
} from "@/lib/generation/progress"
import {
  buildGeneratedContentFromApi,
  buildOptimisticGenerationRecord,
  hasGeneratedContent,
  prependGenerationRecord,
} from "@/lib/generation/results"
import { getPostAuthRedirectPath } from "@/lib/auth/post-auth-redirect"

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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [generationProgress, setGenerationProgress] =
    useState<GenerationProgressState | null>(null)
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
  const { hasOpenAiKey, openKeyModal, refreshKeyStatus } = useOpenAiKey()
  const { success: toastSuccess, error: toastError } = useToast()

  const handleKeyChanged = useCallback(() => {
    refreshKeyStatus()
  }, [refreshKeyStatus])
  const router = useRouter()
  const generationAbortRef = useRef<AbortController | null>(null)
  const isGeneratingRef = useRef(false)

  const usageStats = useMemo(() => {
    return { used: generations.length }
  }, [generations.length])

  const fetchUserData = useCallback(async () => {
    if (isGeneratingRef.current) {
      return
    }

    const supabase = createClient()

    const { user } = await getClientAuthUser(supabase)

    if (!user) {
      setIsGuest(true)
      setTier("starter")
      setBrandVoice(null)
      setTgChannelId(null)
      setGenerations([])
      setAuthChecked(true)
      return
    }

    try {
      const redirectPath = await getPostAuthRedirectPath(supabase, user.id)
      if (redirectPath === "/signup/complete") {
        router.replace("/signup/complete")
        return
      }
    } catch (error) {
      console.warn(
        "Could not resolve post-auth redirect:",
        formatSupabaseError(error)
      )
    }

    setIsGuest(false)

    const applyDashboardData = (data: DashboardUserData) => {
      setTier(data.tier)
      setBrandVoice(data.brandVoice)
      setTgChannelId(data.tgChannelId)
      setGenerations(data.generations)
      setAuthChecked(true)
    }

    const result = await loadDashboardDataForUser(supabase, user.id, {
      onSessionRefreshed: () => router.refresh(),
    })

    if (result.ok) {
      applyDashboardData(result.data)
      return
    }

    if (isLikelyNetworkError(new Error(result.error))) {
      console.warn("Could not load dashboard data:", result.error)
    } else {
      console.error("Error fetching user data:", result.error)
    }
    applyDashboardData(buildDashboardUserData(null, [], []))
  }, [router])

  useEffect(() => {
    fetchUserData()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (!isGeneratingRef.current) {
        fetchUserData()
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUserData])

  const handleStopGeneration = useCallback(() => {
    generationAbortRef.current?.abort()
  }, [])

  const handleGenerate = async (source: ContentSourceInput) => {
    if (isGuest) {
      router.push("/login")
      return
    }

    const openAiKey = readStoredOpenAiKey()
    if (!openAiKey) {
      openKeyModal()
      return
    }

    generationAbortRef.current?.abort()
    const abortController = new AbortController()
    generationAbortRef.current = abortController
    const { signal } = abortController

    isGeneratingRef.current = true
    setIsLoading(true)
    setGenerationProgress(createGenerationProgress(source, tier))

    const supabase = createClient()
    const { user: authUser } = await getClientAuthUser(supabase)

    if (!authUser) {
      isGeneratingRef.current = false
      setIsLoading(false)
      setGenerationProgress(null)
      router.push("/login")
      return
    }

    try {
      const { rawTranscript, sourceLabel } = await resolveTranscriptFromSource(
        source,
        {
          signal,
          onPhaseChange: (phase) => {
            setGenerationProgress((current) => {
              if (!current) {
                return current
              }

              if (phase === "openrouter_extract") {
                return switchToExtractStage(current)
              }

              return advanceToStage(current, mapPhaseToStage(phase))
            })
          },
        }
      )

      setGenerationProgress((current) =>
        current ? advanceToStage(current, "generate_posts") : current
      )

      const result = await requestGenerateContent({
        rawTranscript,
        videoUrl: sourceLabel,
        signal,
      })

      const nextOutputs = buildGeneratedContentFromApi(result, rawTranscript)

      setIsLoading(false)
      setGenerationProgress(null)
      setGeneratedOutputs(nextOutputs)
      setActiveGenerationId(result.generationId ?? null)

      const optimisticRecord = buildOptimisticGenerationRecord(
        authUser.id,
        sourceLabel,
        rawTranscript,
        result
      )

      if (optimisticRecord) {
        setGenerations((current) =>
          prependGenerationRecord(current, optimisticRecord)
        )
      }

      isGeneratingRef.current = false
      void fetchUserData().catch((refreshError) => {
        console.warn(
          "Background dashboard refresh failed:",
          formatSupabaseError(refreshError)
        )
      })

      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    } catch (error) {
      if (isAbortError(error, signal)) {
        toastSuccess("Generation stopped.")
        return
      }

      console.error("Generation error:", error)

      if (error instanceof OpenAiByokError) {
        if (error.code === "missing_key" || error.code === "invalid_key") {
          refreshKeyStatus()
          openKeyModal()
        }
        toastError(error.message)
        return
      }

      const message =
        error instanceof Error ? error.message : "Failed to generate content"
      toastError(message)
    } finally {
      isGeneratingRef.current = false
      if (generationAbortRef.current === abortController) {
        generationAbortRef.current = null
      }
      setIsLoading(false)
      setGenerationProgress(null)
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

  const handleCopyGeneration = async (record: GenerationRecord) => {
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

    try {
      await navigator.clipboard.writeText(combined)
      toastSuccess("Copied all platforms to clipboard!")
    } catch {
      toastError("Could not copy to clipboard.")
    }
  }

  const hasResults = hasGeneratedContent(generatedOutputs)

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.07),transparent_55%)]" />

      <DashboardHeader isGuest={isGuest} authChecked={authChecked} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {authChecked && isGuest ? (
          <div className="mb-6 space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-violet-500/5 to-transparent px-5 py-5 sm:px-6">
              <p className="text-sm font-semibold text-white">
                Free BYOK dashboard — sign in to add your OpenRouter key
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                PulseFlow is 100% free. Bring your own OpenRouter key in Settings,
                add any source, and generate X, LinkedIn, and Telegram posts from
                your browser.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Launch Dashboard (Free)
              </Link>
            </div>
            <DashboardQuickTryCard />
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-8">
            <DashboardCreateWorkspace
              stylePreset={stylePreset}
              onStylePresetChange={setStylePreset}
              isLoading={isLoading}
              generationProgress={generationProgress}
              tier={tier}
              isGuest={isGuest}
              hasOpenAiKey={hasOpenAiKey}
              onGenerate={handleGenerate}
              onStopGeneration={handleStopGeneration}
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
                    dashboard above, or{" "}
                    <Link
                      href="/#demo"
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

            <DashboardSettingsPanel
              tier={tier}
              brandVoice={brandVoice}
              tgChannelId={tgChannelId}
              isGuest={isGuest}
              authChecked={authChecked}
              onBrandVoiceSaved={setBrandVoice}
              onTgChannelSaved={setTgChannelId}
              onKeyChanged={handleKeyChanged}
            />
          </div>

          <div className="xl:sticky xl:top-36 xl:self-start">
            <DashboardStatsPanel
              authChecked={authChecked}
              isGuest={isGuest}
              generationsCount={usageStats.used}
              hasOpenAiKey={hasOpenAiKey}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
