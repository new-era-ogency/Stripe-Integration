"use client"

import { useState } from "react"
import { CopyIcon, Flame, Lock, Sparkles } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  formatShortsScriptForCopy,
  formatTwitterThreadForCopy,
  formatViralShortsHooksForCopy,
  type ViralShortsHook,
} from "@/lib/ai/content-pack"
import type { GeneratedContent } from "@/lib/generations"
import { isProMaxTier, isProTier, type UserTier } from "@/lib/profile"
import TelegramPublishActions from "@/components/dashboard/TelegramPublishActions"
import { useToast } from "@/components/feedback/ToastProvider"
import { dash } from "@/lib/dashboard/theme-classes"

type OutputTabId =
  | "twitter"
  | "linkedin"
  | "telegram"
  | "shorts"
  | "viral-hooks"

type GeneratedOutputPanelProps = {
  content: GeneratedContent
  tier: UserTier
  tgChannelId?: string | null
  onTgChannelSaved?: (channelId: string | null) => void
  styleTone?: string
}

const tabTriggerClass =
  "rounded-none border-b-2 border-transparent bg-transparent px-2 py-2.5 text-[11px] uppercase tracking-wider text-zinc-500 shadow-none transition-colors data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-white light:text-violet-600 light:data-[state=active]:text-violet-900 sm:text-xs"

const contentBlockClass = dash.contentBlock

const textareaClass =
  "min-h-[220px] resize-none rounded-lg border-zinc-800 bg-[#020202] p-4 font-sans text-sm leading-relaxed tracking-wide text-zinc-200 shadow-inner focus-visible:ring-0 light:border-violet-200 light:bg-white light:text-zinc-900"

const PRO_LOCKED_TABS: OutputTabId[] = ["linkedin", "shorts"]

function estimateTokens(...texts: string[]) {
  const chars = texts.reduce((sum, text) => sum + text.length, 0)
  return Math.max(1, Math.ceil(chars / 4))
}

function LockedTabPlaceholder({
  variant,
}: {
  variant: "linkedin" | "shorts" | "viral-hooks"
}) {
  if (variant === "viral-hooks") {
    return (
      <div className="pointer-events-none select-none space-y-3 blur-sm opacity-40">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`${contentBlockClass} border-orange-500/20 light:border-orange-200`}
          >
            <div className="mb-2 flex gap-2">
              <div className="h-2 w-20 rounded bg-zinc-800" />
              <div className="h-2 w-12 rounded bg-orange-900/40" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-zinc-900" />
              <div className="h-2 w-4/5 rounded bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "shorts") {
    return (
      <div className="pointer-events-none select-none space-y-3 blur-sm opacity-40">
        {["Hook", "Body", "CTA"].map((label) => (
          <div
            key={label}
            className={contentBlockClass}
          >
            <div className="mb-2 h-2 w-16 rounded bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-zinc-900" />
              <div className="h-2 w-5/6 rounded bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="pointer-events-none select-none blur-sm opacity-40">
      <div className={`min-h-[280px] ${contentBlockClass}`}>
        <div className="mb-4 h-3 w-40 rounded bg-zinc-800" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-2 rounded bg-zinc-900"
              style={{ width: `${70 + (index % 3) * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProLockOverlay({ feature }: { feature: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-xl border border-violet-500/20 bg-black/60 backdrop-blur-md light:border-violet-200 light:bg-white/85">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_70%)]" />
      <div className="relative mx-4 max-w-sm animate-in fade-in zoom-in-95 text-center duration-300">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 shadow-[0_0_30px_-8px_rgba(139,92,246,0.5)]">
          <Lock className="size-5 animate-pulse text-violet-300" />
        </div>
        <p className={`text-sm font-medium ${dash.heading} light:text-violet-950`}>
          {feature} is a Pro feature
        </p>
        <p className={`mt-2 text-xs leading-relaxed ${dash.body}`}>
          Deep LinkedIn articles, Shorts scripts, and the full 4-part content
          pack are included when your account has Pro access.
        </p>
      </div>
    </div>
  )
}

function ProMaxLockOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-xl border border-orange-500/25 bg-black/60 backdrop-blur-md light:border-orange-200 light:bg-white/85">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.2),transparent_70%)]" />
      <div className="relative mx-4 max-w-sm animate-in fade-in zoom-in-95 text-center duration-300">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/10 shadow-[0_0_30px_-8px_rgba(249,115,22,0.55)]">
          <Flame className="size-5 text-orange-300" />
        </div>
        <p className={`text-sm font-medium ${dash.heading} light:text-violet-950`}>
          Viral Shorts Hooks is a Pro Max feature
        </p>
        <p className={`mt-2 text-xs leading-relaxed ${dash.body}`}>
          Timestamp-based viral clip windows, hook scores, ready-to-speak scripts,
          and shot lists — available on Pro Max accounts.
        </p>
      </div>
    </div>
  )
}

function CopyButton({ label, text }: { label: string; text: string }) {
  const { success: toastSuccess, error: toastError } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toastSuccess("Copied to clipboard!")
    } catch {
      toastError("Could not copy to clipboard.")
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleCopy()
      }}
      className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 transition-colors hover:text-white light:text-violet-600 light:hover:text-violet-900"
      aria-label={`Copy ${label}`}
    >
      <CopyIcon className="h-3.5 w-3.5" />
      COPY
    </button>
  )
}

function TwitterThreadView({ tweets }: { tweets: string[] }) {
  return (
    <div className="space-y-3">
      {tweets.map((tweet, index) => (
        <div
          key={`${index}-${tweet.slice(0, 24)}`}
          className={contentBlockClass}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400/80">
              Tweet {index + 1}/{tweets.length}
            </span>
            <span className="font-mono text-[10px] text-zinc-600">
              {tweet.length}/280
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-200 light:text-zinc-800">{tweet}</p>
        </div>
      ))}
    </div>
  )
}

function ShortsScriptView({
  script,
}: {
  script: NonNullable<GeneratedContent["shortsScript"]>
}) {
  const sections = [
    { label: "Hook", value: script.hook, accent: "text-amber-300/90" },
    { label: "Body", value: script.body, accent: "text-sky-300/90" },
    { label: "CTA", value: script.cta, accent: "text-emerald-300/90" },
  ]

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div
          key={section.label}
          className={contentBlockClass}
        >
          <p
            className={`mb-2 font-mono text-[10px] uppercase tracking-[0.25em] ${section.accent}`}
          >
            {section.label}
          </p>
          <p className="text-sm leading-relaxed text-zinc-200 light:text-zinc-800">
            {section.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function ViralShortsHooksView({ hooks }: { hooks: ViralShortsHook[] }) {
  return (
    <div className="space-y-4">
      {hooks.map((hook, index) => (
        <div
          key={`${hook.timestampStart}-${index}`}
          className={`${contentBlockClass} border-orange-500/20 light:border-orange-200`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-orange-200">
              Clip #{index + 1}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              {hook.timestampStart} → {hook.timestampEnd}
            </span>
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-300">
              Hook {hook.hookScore}/100
            </span>
          </div>

          <p className={`mb-3 text-sm font-medium ${dash.heading} light:text-violet-950`}>{hook.hook}</p>

          <div className="mb-3 rounded-lg border border-zinc-800/80 bg-black/40 p-3 light:border-violet-200 light:bg-violet-50/50">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Script
            </p>
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap light:text-zinc-700">
              {hook.script}
            </p>
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Shot list
            </p>
            <ul className="space-y-1.5">
              {hook.shotList.map((shot) => (
                <li
                  key={shot}
                  className="flex items-start gap-2 text-sm text-zinc-400 light:text-zinc-600"
                >
                  <span className="text-orange-400/80">•</span>
                  <span>{shot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function GeneratedOutputPanel({
  content,
  tier,
  tgChannelId = null,
  onTgChannelSaved,
  styleTone = "ENGAGING",
}: GeneratedOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<OutputTabId>("twitter")
  const isPro =
    isProTier(tier) ||
    content.packTier === "pro" ||
    content.packTier === "pro_max"
  const isProMax = isProMaxTier(tier) || content.packTier === "pro_max"

  const twitterTweets =
    content.twitterThread && content.twitterThread.length > 0
      ? content.twitterThread
      : content.outputX
        ? [content.outputX]
        : []

  const linkedinText = content.linkedinArticle ?? content.outputLinkedIn ?? ""
  const telegramText = content.telegramPost ?? content.outputTelegram ?? ""
  const shortsScript = content.shortsScript
  const viralHooks = content.viralShortsHooks ?? []

  const tabCopyText: Record<OutputTabId, string> = {
    twitter: formatTwitterThreadForCopy(twitterTweets),
    linkedin: linkedinText,
    telegram: telegramText,
    shorts: shortsScript ? formatShortsScriptForCopy(shortsScript) : "",
    "viral-hooks": viralHooks.length
      ? formatViralShortsHooksForCopy(viralHooks)
      : "",
  }

  const tabs: { id: OutputTabId; label: string; locked: boolean }[] = [
    { id: "twitter", label: "Twitter Thread", locked: false },
    { id: "linkedin", label: "LinkedIn", locked: !isPro },
    { id: "telegram", label: "Telegram", locked: false },
    { id: "shorts", label: "Shorts Script", locked: !isPro },
    {
      id: "viral-hooks",
      label: "🔥 Viral Shorts Hooks",
      locked: !isProMax,
    },
  ]

  if (!content.outputX && twitterTweets.length === 0) {
    return null
  }

  const packBadge = isProMax ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-200">
      <Flame className="size-3" />
      Pro Max Pack
    </span>
  ) : isPro ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
      <Sparkles className="size-3" />
      Pro Pack
    </span>
  ) : (
    <span className={`font-mono text-[10px] ${dash.muted}`}>
      STARTER · 2/5 UNLOCKED
    </span>
  )

  return (
    <Card className={`mb-6 gap-0 rounded-xl py-0 ${dash.panel}`}>
      <CardHeader className={`${dash.panelHeader} light:border-violet-200`}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className={`text-[10px] uppercase tracking-[0.3em] ${dash.muted}`}>
            Generated Output · Deep Content Pack
          </CardTitle>
          {packBadge}
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as OutputTabId)}
        >
          <TabsList className="flex h-auto w-full gap-0 overflow-x-auto rounded-none border-b border-zinc-900 bg-transparent p-0 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5 light:border-violet-200 [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={tabTriggerClass}
              >
                <span className="inline-flex items-center gap-1.5">
                  {tab.label}
                  {tab.locked ? (
                    <Lock className="size-3 text-zinc-600" />
                  ) : null}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const charCount = tabCopyText[tab.id].length
            const proLocked = !isPro && PRO_LOCKED_TABS.includes(tab.id)
            const proMaxLocked = tab.id === "viral-hooks" && !isProMax
            const locked = proLocked || proMaxLocked

            return (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="relative mt-3 space-y-2"
              >
                {!locked ? (
                  tab.id === "telegram" ? (
                    <div className="space-y-3 px-0.5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-zinc-600">
                          <span>CHARS: {charCount}</span>
                          <span className="text-zinc-800">|</span>
                          <span>TONE: {styleTone}</span>
                          <span className="text-zinc-800">|</span>
                          <span>
                            TOKENS ≈ {estimateTokens(tabCopyText[tab.id])}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CopyButton
                            label={tab.label}
                            text={tabCopyText[tab.id]}
                          />
                          <TelegramPublishActions
                            text={tabCopyText.telegram}
                            tier={tier}
                            tgChannelId={tgChannelId}
                            onChannelSaved={onTgChannelSaved ?? (() => {})}
                            compact
                          />
                        </div>
                      </div>
                      <TelegramPublishActions
                        text={tabCopyText.telegram}
                        tier={tier}
                        tgChannelId={tgChannelId}
                        onChannelSaved={onTgChannelSaved ?? (() => {})}
                        showConnectOnly
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-0.5">
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-zinc-600">
                        <span>CHARS: {charCount}</span>
                        <span className="text-zinc-800">|</span>
                        <span>TONE: {styleTone}</span>
                        <span className="text-zinc-800">|</span>
                        <span>
                          TOKENS ≈ {estimateTokens(tabCopyText[tab.id])}
                        </span>
                      </div>
                      <CopyButton label={tab.label} text={tabCopyText[tab.id]} />
                    </div>
                  )
                ) : null}

                <div className="relative min-h-[220px]">
                  {tab.id === "twitter" ? (
                    isPro && content.twitterThread?.length ? (
                      <TwitterThreadView tweets={content.twitterThread} />
                    ) : (
                      <Textarea
                        value={content.outputX}
                        readOnly
                        className={textareaClass}
                      />
                    )
                  ) : null}

                  {tab.id === "linkedin" && !locked ? (
                    <Textarea
                      value={linkedinText}
                      readOnly
                      className={`${textareaClass} min-h-[280px]`}
                    />
                  ) : null}

                  {tab.id === "telegram" && !locked ? (
                    <Textarea
                      value={telegramText}
                      readOnly
                      className={textareaClass}
                    />
                  ) : null}

                  {tab.id === "shorts" && !locked && shortsScript ? (
                    <ShortsScriptView script={shortsScript} />
                  ) : null}

                  {tab.id === "viral-hooks" && !locked && viralHooks.length ? (
                    <ViralShortsHooksView hooks={viralHooks} />
                  ) : null}

                  {tab.id === "viral-hooks" && !locked && !viralHooks.length ? (
                    <p className={`rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm ${dash.muted} light:border-violet-200`}>
                      No viral hooks were returned for this generation.
                    </p>
                  ) : null}

                  {locked ? (
                    <>
                      <LockedTabPlaceholder
                        variant={
                          tab.id === "linkedin"
                            ? "linkedin"
                            : tab.id === "viral-hooks"
                              ? "viral-hooks"
                              : "shorts"
                        }
                      />
                      {proMaxLocked ? (
                        <ProMaxLockOverlay />
                      ) : (
                        <ProLockOverlay
                          feature={
                            tab.id === "linkedin"
                              ? "Deep LinkedIn Articles"
                              : "Shorts Scripts"
                          }
                        />
                      )}
                    </>
                  ) : null}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
