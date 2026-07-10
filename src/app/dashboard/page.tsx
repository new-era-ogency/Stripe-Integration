"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardAnimatedView from "@/components/dashboard/DashboardAnimatedView"
import DashboardCreateWorkspace, {
  type StylePreset,
} from "@/components/dashboard/DashboardCreateWorkspace"
import DashboardOverview from "@/components/dashboard/DashboardOverview"
import DashboardQuickTryCard from "@/components/dashboard/DashboardQuickTryCard"
import DashboardSettingsPanel from "@/components/dashboard/DashboardSettingsPanel"
import DashboardShell from "@/components/dashboard/DashboardShell"
import DashboardStatsPanel from "@/components/dashboard/DashboardStatsPanel"
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
import type { ContentSourceTab } from "@/lib/content-sources/types"
import type { CreateIntent } from "@/lib/dashboard/create-intent"
import type { DashboardView } from "@/lib/dashboard/views"
import type { StatCardKey } from "@/components/dashboard/DashboardStatCards"
import {
  countUnseenResults,
  loadViewedGenerationIds,
  saveViewedGenerationIds,
} from "@/lib/dashboard/viewed-generations"
import { useViewport } from "@/hooks/useViewport"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import MobileDashboardShell from "@/components/mobile/MobileDashboardShell"
import type { DashboardMobileTab } from "@/lib/viewport"

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
  const [activeView, setActiveView] = useState<DashboardView>("overview")
  const [settingsTab, setSettingsTab] = useState<
    "api-key" | "telegram" | "brand-voice"
  >("api-key")
  const [historyFilter, setHistoryFilter] = useState<"all" | "month">("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [createSourceTab, setCreateSourceTab] = useState<ContentSourceTab>("youtube")
  const [createIntent, setCreateIntent] = useState<CreateIntent>("default")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)
  const [viewedGenerationIds, setViewedGenerationIds] = useState<Set<string>>(
    () => new Set()
  )
  const { hasOpenAiKey, openKeyModal, refreshKeyStatus } = useOpenAiKey()
  const { success: toastSuccess, error: toastError } = useToast()

  const handleKeyChanged = useCallback(() => {
    refreshKeyStatus()
  }, [refreshKeyStatus])
  const router = useRouter()
  const { isMobile, ready: viewportReady } = useViewport()
  const [mobileTab, setMobileTab] = useState<DashboardMobileTab>("create")
  const generationAbortRef = useRef<AbortController | null>(null)
  const isGeneratingRef = useRef(false)

  const unseenResultsCount = useMemo(
    () => countUnseenResults(generations, viewedGenerationIds),
    [generations, viewedGenerationIds]
  )

  const markGenerationViewed = useCallback(
    (generationId: string | null | undefined) => {
      if (!userId || !generationId) {
        return
      }

      setViewedGenerationIds((current) => {
        if (current.has(generationId)) {
          return current
        }

        const next = new Set(current)
        next.add(generationId)
        saveViewedGenerationIds(userId, next)
        return next
      })
    },
    [userId]
  )

  const syncViewedGenerations = useCallback(
    (nextUserId: string, generationIds: string[]) => {
      setViewedGenerationIds(loadViewedGenerationIds(nextUserId, generationIds))
    },
    []
  )
  const usageStats = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const generationsThisMonth = generations.filter(
      (record) => new Date(record.created_at) >= monthStart
    ).length

    return {
      used: generations.length,
      generationsThisMonth,
      draftCount: hasGeneratedContent(generatedOutputs) ? 1 : 0,
    }
  }, [generations, generatedOutputs])

  const fetchUserData = useCallback(async () => {
    if (isGeneratingRef.current) {
      return
    }

    const supabase = createClient()

    const { user } = await getClientAuthUser(supabase)

    if (!user) {
      setIsGuest(true)
      setUserId(null)
      setUserEmail(null)
      setDisplayName("")
      setViewedGenerationIds(new Set())
      setTier("starter")
      setBrandVoice(null)
      setTgChannelId(null)
      setGenerations([])
      setAuthChecked(true)
      return
    }

    setUserId(user.id)

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
    setUserEmail(user.email ?? null)

    const metadataUsername = user.user_metadata?.username
    const emailLocalPart = user.email?.split("@")[0] ?? ""
    setDisplayName(
      typeof metadataUsername === "string" && metadataUsername.trim()
        ? metadataUsername.trim()
        : emailLocalPart
    )

    const applyDashboardData = (data: DashboardUserData) => {
      setTier(data.tier)
      setBrandVoice(data.brandVoice)
      setTgChannelId(data.tgChannelId)
      setGenerations(data.generations)
      syncViewedGenerations(
        user.id,
        data.generations.map((record) => record.id)
      )
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
  }, [router, syncViewedGenerations])

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

  useEffect(() => {
    const onResultsView =
      (!isMobile && activeView === "results") ||
      (isMobile && mobileTab === "results")

    if (onResultsView && activeGenerationId) {
      markGenerationViewed(activeGenerationId)
    }
  }, [
    activeView,
    mobileTab,
    isMobile,
    activeGenerationId,
    markGenerationViewed,
  ])

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

      if (isMobile) {
        setMobileTab("results")
      }

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

      if (!isMobile) {
        setActiveView("results")
      }
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
    markGenerationViewed(record.id)
    setGeneratedOutputs(record.generated_content)
    setActiveGenerationId(record.id)

    if (isMobile) {
      setMobileTab("results")
      return
    }

    setActiveView("results")
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

  const guestBanner =
    authChecked && isGuest ? (
      <div className="mb-6 space-y-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-violet-500/5 to-transparent px-5 py-5 light:border-violet-200 light:from-violet-50 light:via-white light:to-violet-50/40">
          <p className="text-sm font-semibold text-white light:text-violet-950">
            Free BYOK dashboard — sign in to add your OpenRouter key
          </p>
          <p className="mt-2 text-sm text-zinc-400 light:text-violet-700">
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
    ) : null

  const workspaceName = displayName
    ? `${displayName}'s workspace`
    : "Content Engine"

  const openCreate = useCallback(
    (tab: ContentSourceTab = "youtube", intent: CreateIntent = "default") => {
      setCreateSourceTab(tab)
      setCreateIntent(intent)
      setActiveView("create")
    },
    []
  )

  const handleDashboardViewChange = useCallback(
    (view: DashboardView) => {
      if (view === "create") {
        setCreateIntent("default")
        setCreateSourceTab("youtube")
      }
      if (view === "history") {
        setHistoryFilter("all")
      }
      setActiveView(view)
    },
    []
  )

  const handleStatCardNavigate = useCallback((key: StatCardKey) => {
    switch (key) {
      case "projects":
        setHistoryFilter("all")
        setActiveView("history")
        break
      case "meetings":
        setHistoryFilter("month")
        setActiveView("history")
        break
      case "tasks":
        setActiveView("results")
        break
      case "team":
        setSettingsTab("api-key")
        setActiveView("settings")
        break
    }
  }, [])

  const createSection = (
    <section id="create" className="scroll-mt-36">
      <DashboardCreateWorkspace
        key={createSourceTab}
        stylePreset={stylePreset}
        onStylePresetChange={setStylePreset}
        isLoading={isLoading}
        generationProgress={generationProgress}
        tier={tier}
        isGuest={isGuest}
        hasOpenAiKey={hasOpenAiKey}
        onGenerate={handleGenerate}
        onStopGeneration={handleStopGeneration}
        initialSourceTab={createSourceTab}
      />
    </section>
  )

  const resultsSection = (
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
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-12 text-center light:border-violet-200 light:bg-violet-50/30">
          <p className="text-sm font-medium text-zinc-300 light:text-violet-950">
            Your generated posts will appear here
          </p>
          <p className="mt-2 text-sm text-zinc-500 light:text-violet-700/90">
            Use the Create tab to add a source and generate, or{" "}
            <Link
              href="/"
              className="text-violet-400 hover:text-violet-300"
            >
              explore the landing page
            </Link>{" "}
            first.
          </p>
        </div>
      )}
    </section>
  )

  const historySection = (
    <section id="history" className="scroll-mt-36">
      <GenerationHistory
        generations={generations}
        isGuest={isGuest}
        authChecked={authChecked}
        activeId={activeGenerationId}
        onView={handleViewGeneration}
        onCopy={handleCopyGeneration}
        filter={historyFilter}
      />
    </section>
  )

  const settingsSection = (
    <section id="settings" className="scroll-mt-36 space-y-6">
      {isMobile ? (
        <DashboardStatsPanel
          authChecked={authChecked}
          isGuest={isGuest}
          generationsCount={usageStats.used}
          hasOpenAiKey={hasOpenAiKey}
        />
      ) : null}
      <DashboardSettingsPanel
        tier={tier}
        brandVoice={brandVoice}
        tgChannelId={tgChannelId}
        isGuest={isGuest}
        authChecked={authChecked}
        onBrandVoiceSaved={setBrandVoice}
        onTgChannelSaved={setTgChannelId}
        onKeyChanged={handleKeyChanged}
        activeTab={settingsTab}
        onTabChange={setSettingsTab}
      />
    </section>
  )

  if (!viewportReady) {
    return <div className="min-h-screen bg-black" aria-hidden />
  }

  if (isMobile) {
    return (
      <MobileDashboardShell
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        header={
          <DashboardHeader
            isGuest={isGuest}
            authChecked={authChecked}
            hideSectionNav
          />
        }
        topBanner={guestBanner}
        create={createSection}
        results={resultsSection}
        history={historySection}
        settings={settingsSection}
        unseenResultsCount={unseenResultsCount}
      />
    )
  }

  return (
    <DashboardShell
      activeView={activeView}
      createIntent={createIntent}
      onViewChange={handleDashboardViewChange}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      isGuest={isGuest}
      authChecked={authChecked}
      userEmail={userEmail}
      workspaceName={workspaceName}
      generations={generations}
      onSearchSelect={(record) => {
        handleViewGeneration(record)
        setActiveView("results")
      }}
      onMeetingsClick={() => openCreate("media", "meetings")}
      onUnclassifiedClick={() => openCreate("text", "unclassified")}
      unseenResultsCount={unseenResultsCount}
      topBanner={guestBanner}
    >
      {activeView === "overview" ? (
        <DashboardAnimatedView viewKey="overview">
          <DashboardOverview
            displayName={displayName}
            generations={generations}
            generationsThisMonth={usageStats.generationsThisMonth}
            draftCount={usageStats.draftCount}
            tier={tier}
            hasOpenAiKey={hasOpenAiKey}
            authChecked={authChecked}
            isGuest={isGuest}
            activeGenerationId={activeGenerationId}
            onNewProject={() => openCreate("youtube", "default")}
            onUploadMeeting={() => openCreate("media", "meetings")}
            onViewGeneration={(record) => {
              handleViewGeneration(record)
              setActiveView("results")
            }}
            onCopyGeneration={handleCopyGeneration}
            onStatCardNavigate={handleStatCardNavigate}
          />
        </DashboardAnimatedView>
      ) : null}

      {activeView === "create" ? (
        <DashboardAnimatedView viewKey={`create-${createIntent}-${createSourceTab}`}>
          {createSection}
        </DashboardAnimatedView>
      ) : null}

      {activeView === "results" ? (
        <DashboardAnimatedView viewKey="results">{resultsSection}</DashboardAnimatedView>
      ) : null}

      {activeView === "history" ? (
        <DashboardAnimatedView viewKey="history">{historySection}</DashboardAnimatedView>
      ) : null}

      {activeView === "settings" ? (
        <DashboardAnimatedView viewKey="settings">
          <section id="settings" className="scroll-mt-36 space-y-6">
            <DashboardStatsPanel
              authChecked={authChecked}
              isGuest={isGuest}
              generationsCount={usageStats.used}
              hasOpenAiKey={hasOpenAiKey}
            />
            <DashboardSettingsPanel
              tier={tier}
              brandVoice={brandVoice}
              tgChannelId={tgChannelId}
              isGuest={isGuest}
              authChecked={authChecked}
              onBrandVoiceSaved={setBrandVoice}
              onTgChannelSaved={setTgChannelId}
              onKeyChanged={handleKeyChanged}
              activeTab={settingsTab}
              onTabChange={setSettingsTab}
            />
          </section>
        </DashboardAnimatedView>
      ) : null}
    </DashboardShell>
  )
}
