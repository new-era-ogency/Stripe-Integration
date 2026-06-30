"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useState } from "react"
import { AlertCircle, Check, Eye, EyeOff, Loader2, Lock, Trash2 } from "lucide-react"
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  clearStoredOpenAiKey,
  isValidOpenAiKeyFormat,
  readStoredOpenAiKey,
  validateOpenAiKey,
  writeStoredOpenAiKey,
} from "@/lib/openai/client-key"
import { OPENROUTER_API_KEY_GUIDE_PATH } from "@/lib/guides/openrouter-api-key"
import { cn } from "@/lib/utils"

type ValidationState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "valid" }
  | { status: "invalid"; message: string }

type OpenAiKeySetupProps = {
  embedded?: boolean
  onKeyValidated?: () => void
  onKeyRemoved?: () => void
}

const primaryButtonClassName =
  "h-10 rounded-lg bg-white px-5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"

const secondaryButtonClassName =
  "h-10 rounded-lg border-zinc-700 bg-transparent px-4 text-sm text-zinc-300 hover:bg-zinc-900"

export default function OpenAiKeySetup({
  embedded = false,
  onKeyValidated,
  onKeyRemoved,
}: OpenAiKeySetupProps) {
  const inputId = useId()
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [validation, setValidation] = useState<ValidationState>({ status: "idle" })
  const [hasLoadedStoredKey, setHasLoadedStoredKey] = useState(false)

  useEffect(() => {
    const stored = readStoredOpenAiKey()
    if (stored) {
      setApiKey(stored)
      setValidation({ status: "valid" })
    }
    setHasLoadedStoredKey(true)
  }, [])

  const persistAndValidate = useCallback(async (value: string) => {
    const trimmed = value.trim()

    if (!trimmed) {
      clearStoredOpenAiKey()
      setValidation({ status: "idle" })
      onKeyRemoved?.()
      return
    }

    if (!isValidOpenAiKeyFormat(trimmed)) {
      setValidation({
        status: "invalid",
        message: "Enter a valid OpenRouter key starting with sk-or-v1-.",
      })
      return
    }

    setValidation({ status: "validating" })

    const result = await validateOpenAiKey(trimmed)

    if (result.ok) {
      writeStoredOpenAiKey(trimmed)
      setValidation({ status: "valid" })
      onKeyValidated?.()
      return
    }

    clearStoredOpenAiKey()
    setValidation({ status: "invalid", message: result.message })
    onKeyRemoved?.()
  }, [onKeyRemoved, onKeyValidated])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await persistAndValidate(apiKey)
  }

  const handleBlur = async () => {
    if (!hasLoadedStoredKey) {
      return
    }

    await persistAndValidate(apiKey)
  }

  const handleRemoveKey = () => {
    clearStoredOpenAiKey()
    setApiKey("")
    setShowKey(false)
    setValidation({ status: "idle" })
    onKeyRemoved?.()
  }

  const handleChangeKey = () => {
    clearStoredOpenAiKey()
    setApiKey("")
    setShowKey(true)
    setValidation({ status: "idle" })
    onKeyRemoved?.()
  }

  const isValidating = validation.status === "validating"
  const hasSavedKey = validation.status === "valid" && Boolean(apiKey.trim())

  return (
    <form
      className={
        embedded
          ? "w-full space-y-5"
          : "w-full max-w-md space-y-5 rounded-2xl border border-violet-500/10 bg-[#050505]/80 p-6 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] backdrop-blur-xl"
      }
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {!embedded ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-300">
            <Lock className="size-4" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              OpenRouter API key
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">
            Stored in this browser&apos;s localStorage. Sent to OpenRouter when you
            generate — not saved in PulseFlow&apos;s database.{" "}
            <Link
              href={OPENROUTER_API_KEY_GUIDE_PATH}
              className="text-violet-400 hover:text-violet-300"
            >
              Setup guide
            </Link>
          </p>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-zinc-400">
          Paste your personal OpenRouter key below.{" "}
          <Link
            href={OPENROUTER_API_KEY_GUIDE_PATH}
            className="text-violet-400 hover:text-violet-300"
          >
            How to get a key →
          </Link>
        </p>
      )}

      <div className="space-y-2">
        <Label
          htmlFor={inputId}
          className={cn(authLabelClassName, embedded && "normal-case tracking-normal text-zinc-400")}
        >
          Your OpenRouter API key
        </Label>
        <div className="relative">
          <Input
            id={inputId}
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(event) => {
              setApiKey(event.target.value)
              if (validation.status !== "idle") {
                setValidation({ status: "idle" })
              }
            }}
            onBlur={() => {
              void handleBlur()
            }}
            placeholder="sk-or-v1-..."
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isValidating}
            data-1p-ignore
            data-lpignore="true"
            className={cn(authInputClassName, "pr-11 font-mono text-sm")}
          />
          <button
            type="button"
            onClick={() => setShowKey((current) => !current)}
            disabled={isValidating || !apiKey}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {validation.status === "validating" ? (
        <p
          className="flex items-center gap-2 text-sm text-zinc-400"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Validating…
        </p>
      ) : null}

      {validation.status === "valid" ? (
        <div
          className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-sm text-emerald-300"
          role="status"
          aria-live="polite"
        >
          <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
          <span>Key saved in this browser — only your key is used for generation.</span>
        </div>
      ) : null}

      {validation.status === "invalid" ? (
        <div
          className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-300"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-medium text-red-200">Invalid API key</p>
            <p className="mt-1 leading-relaxed text-red-300/90">
              {validation.message}
            </p>
          </div>
        </div>
      ) : null}

      <div className="space-y-3 border-t border-zinc-800/80 pt-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={isValidating || !apiKey.trim()}
            className={cn(primaryButtonClassName, "w-full sm:w-auto")}
          >
            {isValidating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Validating…
              </span>
            ) : hasSavedKey ? (
              "Update key"
            ) : (
              "Save & validate key"
            )}
          </Button>

          {hasSavedKey ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleChangeKey}
                disabled={isValidating}
                className={secondaryButtonClassName}
              >
                Change key
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveKey}
                disabled={isValidating}
                className="h-10 rounded-lg border-red-500/25 bg-transparent px-4 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Remove
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </form>
  )
}
