"use client"

import { useEffect, useState } from "react"
import { Check, Loader2, Lock, Radio, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isProTier, type UserTier } from "@/lib/profile"

type TelegramChannelSettingsProps = {
  tier: UserTier
  tgChannelId: string | null
  isGuest: boolean
  authChecked: boolean
  onSaved: (channelId: string | null) => void
}

export default function TelegramChannelSettings({
  tier,
  tgChannelId,
  isGuest,
  authChecked,
  onSaved,
}: TelegramChannelSettingsProps) {
  const [draft, setDraft] = useState(tgChannelId ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isPro = isProTier(tier)
  const isLocked = isGuest || !isPro
  const connected = Boolean(tgChannelId?.trim())

  useEffect(() => {
    setDraft(tgChannelId ?? "")
  }, [tgChannelId])

  const saveChannel = async () => {
    if (isLocked) return

    setIsSaving(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgChannelId: draft }),
      })

      const data = (await response.json()) as {
        tgChannelId?: string | null
        error?: string
      }

      if (!response.ok) {
        setError(data.error ?? "Failed to save Telegram channel")
        return
      }

      const saved = (data.tgChannelId ?? draft.trim()) || null
      onSaved(saved)
      setDraft(saved ?? "")
      setMessage(
        saved
          ? "Telegram channel updated. You can publish from the Results tab."
          : "Telegram channel removed."
      )
    } catch {
      setError("Something went wrong while saving.")
    } finally {
      setIsSaving(false)
    }
  }

  const disconnectChannel = async () => {
    if (isLocked || !connected) return

    setIsDisconnecting(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgChannelId: "" }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Failed to disconnect channel")
        return
      }

      onSaved(null)
      setDraft("")
      setMessage("Telegram channel disconnected.")
    } catch {
      setError("Something went wrong while disconnecting.")
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm leading-relaxed text-zinc-400">
          Connect your Telegram channel to publish generated posts in one click.
          Use @channelusername or a numeric ID (e.g. -1001234567890). Your bot
          must be an admin on the channel.
        </p>
      </div>

      {!authChecked ? (
        <div className="h-24 animate-pulse rounded-xl bg-zinc-900/80" />
      ) : (
        <>
          {connected ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300">
              <Check className="size-4 shrink-0" />
              <span>
                Connected:{" "}
                <span className="font-mono text-emerald-200">{tgChannelId}</span>
              </span>
            </div>
          ) : null}

          <div className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={isLocked || isSaving || isDisconnecting}
                placeholder="@mychannel or -1001234567890"
                className="h-11 border-zinc-800 bg-[#010101] font-mono text-sm text-zinc-200 placeholder:text-zinc-600"
              />
              <Button
                type="button"
                onClick={saveChannel}
                disabled={
                  isLocked ||
                  isSaving ||
                  isDisconnecting ||
                  !draft.trim()
                }
                className="h-11 shrink-0 rounded-xl bg-white px-5 text-sm font-medium text-black hover:bg-zinc-200"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Radio className="mr-2 size-4" />
                    {connected ? "Update channel" : "Connect channel"}
                  </>
                )}
              </Button>
            </div>

            {isLocked ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-zinc-800/80 bg-black/55 backdrop-blur-md">
                <div className="mx-4 max-w-sm text-center">
                  <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                    <Lock className="size-5 text-violet-300" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    Telegram publish requires Pro
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    Upgrade to Pro to connect and change your Telegram channel.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {connected && !isLocked ? (
            <Button
              type="button"
              variant="outline"
              onClick={disconnectChannel}
              disabled={isSaving || isDisconnecting}
              className="h-10 rounded-xl border-zinc-700 bg-transparent text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Disconnecting…
                </>
              ) : (
                <>
                  <Unlink className="mr-2 size-4" />
                  Disconnect channel
                </>
              )}
            </Button>
          ) : null}

          {error ? (
            <p className="text-sm text-amber-300/90" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-sm text-emerald-400/90" role="status">
              {message}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
