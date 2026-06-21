"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, Loader2, Lock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isProTier, type UserTier } from "@/lib/profile"

type PublishState = "idle" | "connecting" | "publishing" | "success" | "error"

type TelegramPublishActionsProps = {
  text: string
  tier: UserTier
  tgChannelId: string | null
  onChannelSaved: (channelId: string) => void
  compact?: boolean
  showConnectOnly?: boolean
}

export default function TelegramPublishActions({
  text,
  tier,
  tgChannelId,
  onChannelSaved,
  compact = false,
  showConnectOnly = false,
}: TelegramPublishActionsProps) {
  const [channelDraft, setChannelDraft] = useState(tgChannelId ?? "")
  const [publishState, setPublishState] = useState<PublishState>("idle")
  const [error, setError] = useState<string | null>(null)

  const isPro = isProTier(tier)
  const hasChannel = Boolean(tgChannelId?.trim())

  useEffect(() => {
    setChannelDraft(tgChannelId ?? "")
  }, [tgChannelId])

  useEffect(() => {
    if (publishState !== "success") return
    const timer = window.setTimeout(() => setPublishState("idle"), 4000)
    return () => window.clearTimeout(timer)
  }, [publishState])

  const saveChannel = async () => {
    setPublishState("connecting")
    setError(null)

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgChannelId: channelDraft }),
      })

      const data = (await response.json()) as {
        tgChannelId?: string | null
        error?: string
      }

      if (!response.ok) {
        setPublishState("error")
        setError(data.error ?? "Failed to save channel ID")
        return
      }

      const saved = data.tgChannelId ?? channelDraft.trim()
      onChannelSaved(saved)
      setPublishState("idle")
    } catch {
      setPublishState("error")
      setError("Something went wrong while saving your channel.")
    }
  }

  const publish = async () => {
    if (!text.trim()) return

    setPublishState("publishing")
    setError(null)

    try {
      const response = await fetch("/api/share/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setPublishState("error")
        setError(data.error ?? "Failed to publish to Telegram")
        return
      }

      setPublishState("success")
    } catch {
      setPublishState("error")
      setError("Something went wrong while publishing.")
    }
  }

  if (!isPro) {
    if (showConnectOnly) return null

    return (
      <Button
        asChild
        variant="outline"
        className="h-8 rounded-lg border-violet-500/30 bg-violet-500/5 px-3 text-[11px] font-medium text-violet-200 hover:bg-violet-500/10"
      >
        <Link href="/pricing">
          <Lock className="mr-1.5 size-3.5" />
          Publish · PRO
        </Link>
      </Button>
    )
  }

  if (showConnectOnly) {
    if (hasChannel) return null

    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
        <p className="mb-2 text-[11px] text-zinc-400">
          Enter your Telegram Channel ID to connect (e.g. @mychannel)
        </p>
        <div className="flex gap-2">
          <Input
            value={channelDraft}
            onChange={(event) => setChannelDraft(event.target.value)}
            placeholder="@mychannel"
            disabled={publishState === "connecting"}
            className="h-9 border-zinc-800 bg-[#010101] text-sm text-zinc-200 placeholder:text-zinc-600"
          />
          <Button
            type="button"
            onClick={saveChannel}
            disabled={!channelDraft.trim() || publishState === "connecting"}
            className="h-9 shrink-0 rounded-lg bg-white px-3 text-xs font-medium text-black hover:bg-zinc-200"
          >
            {publishState === "connecting" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Connect"
            )}
          </Button>
        </div>
        {error ? (
          <p className="mt-2 text-[11px] text-amber-300/90" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          type="button"
          onClick={publish}
          disabled={
            !hasChannel ||
            !text.trim() ||
            publishState === "publishing" ||
            publishState === "connecting"
          }
          className="h-8 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-3 text-[11px] font-semibold text-white hover:from-sky-400 hover:to-blue-500 disabled:opacity-40"
        >
          {publishState === "publishing" ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Publishing…
            </>
          ) : publishState === "success" ? (
            <>
              <Check className="mr-1.5 size-3.5" />
              Published! 🎉
            </>
          ) : (
            <>
              <Send className="mr-1.5 size-3.5" />
              Publish to Telegram
            </>
          )}
        </Button>
        {hasChannel ? (
          <p className="font-mono text-[10px] text-zinc-600">{tgChannelId}</p>
        ) : null}
        {error ? (
          <p className="max-w-xs text-right text-[11px] text-amber-300/90" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  return null
}
