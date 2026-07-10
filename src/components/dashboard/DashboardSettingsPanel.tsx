"use client"

import { KeyRound, MessageCircle, Sparkles } from "lucide-react"
import BrandVoiceSettings from "@/components/dashboard/BrandVoiceSettings"
import TelegramChannelSettings from "@/components/dashboard/TelegramChannelSettings"
import ByokCostExplainer from "@/components/openai/ByokCostExplainer"
import OpenRouterApiKeyGuide from "@/components/guides/OpenRouterApiKeyGuide"
import OpenAiKeySetup from "@/components/settings/OpenAiKeySetup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserTier } from "@/lib/profile"
import { dash } from "@/lib/dashboard/theme-classes"
import { cn } from "@/lib/utils"

type DashboardSettingsPanelProps = {
  tier: UserTier
  brandVoice: string | null
  tgChannelId: string | null
  isGuest: boolean
  authChecked: boolean
  onBrandVoiceSaved: (brandVoice: string | null) => void
  onTgChannelSaved: (channelId: string | null) => void
  onKeyChanged: () => void
  activeTab?: "api-key" | "telegram" | "brand-voice"
  onTabChange?: (tab: "api-key" | "telegram" | "brand-voice") => void
}

const tabTriggerClassName = cn(
  "inline-flex !h-9 min-h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-transparent px-2 text-xs font-medium text-zinc-400 shadow-none transition-colors sm:px-3 sm:text-sm",
  "after:hidden after:content-none",
  "data-[state=active]:border-violet-500/40 data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-100 data-[state=active]:shadow-none light:text-violet-600 light:data-[state=active]:border-violet-400 light:data-[state=active]:bg-violet-50 light:data-[state=active]:text-violet-900",
  "dark:data-[state=active]:border-violet-500/40 dark:data-[state=active]:bg-violet-500/15 dark:data-[state=active]:text-violet-100 dark:data-[state=active]:bg-violet-500/15"
)

export default function DashboardSettingsPanel({
  tier,
  brandVoice,
  tgChannelId,
  isGuest,
  authChecked,
  onBrandVoiceSaved,
  onTgChannelSaved,
  onKeyChanged,
  activeTab = "api-key",
  onTabChange,
}: DashboardSettingsPanelProps) {
  if (isGuest || !authChecked) {
    return (
      <section id="settings" className="scroll-mt-36">
        <div className={dash.emptyBox}>
          <p className={dash.body}>
            Sign in to manage your OpenRouter API key and integrations.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="settings" className="scroll-mt-36">
      <div className="mb-3">
        <p className={dash.label}>Account</p>
        <h2 className={`mt-1 text-xl font-semibold ${dash.heading} light:text-violet-950`}>
          Settings
        </h2>
        <p className={`mt-2 max-w-2xl ${dash.muted}`}>
          Your OpenRouter API key stays in this browser only — PulseFlow never
          stores or uses a shared server key. Update your key or Telegram channel
          anytime below.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          onTabChange?.(value as "api-key" | "telegram" | "brand-voice")
        }
        className="space-y-4"
      >
        <TabsList
          variant="line"
          className="!flex h-11 w-full items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-1 light:border-violet-200 light:bg-white"
        >
          <TabsTrigger value="api-key" className={tabTriggerClassName}>
            <KeyRound className="size-3.5 shrink-0" />
            API key
          </TabsTrigger>
          <TabsTrigger value="telegram" className={tabTriggerClassName}>
            <MessageCircle className="size-3.5 shrink-0" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="brand-voice" className={tabTriggerClassName}>
            <Sparkles className="size-3.5 shrink-0" />
            Brand voice
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="api-key"
          className="mt-0 space-y-6 rounded-2xl border border-zinc-900 bg-[#050505] p-6 shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)] light:border-violet-200 light:bg-white"
        >
          <OpenRouterApiKeyGuide variant="compact" />
          <OpenAiKeySetup
            embedded
            onKeyValidated={onKeyChanged}
            onKeyRemoved={onKeyChanged}
          />
          <ByokCostExplainer variant="card" />
        </TabsContent>

        <TabsContent
          value="telegram"
          className="mt-0 space-y-6 rounded-2xl border border-zinc-900 bg-[#050505] p-6 shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)] light:border-violet-200 light:bg-white"
        >
          <TelegramChannelSettings
            tier={tier}
            tgChannelId={tgChannelId}
            isGuest={isGuest}
            authChecked={authChecked}
            onSaved={onTgChannelSaved}
          />
        </TabsContent>

        <TabsContent value="brand-voice" className="mt-0">
          <BrandVoiceSettings
            tier={tier}
            brandVoice={brandVoice}
            isGuest={isGuest}
            authChecked={authChecked}
            onSaved={onBrandVoiceSaved}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
