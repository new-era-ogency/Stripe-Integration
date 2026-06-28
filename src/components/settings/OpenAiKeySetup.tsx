"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { AlertCircle, Check, Eye, EyeOff, Loader2, Lock } from "lucide-react"
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
import { cn } from "@/lib/utils"

type ValidationState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "valid" }
  | { status: "invalid"; message: string }

type OpenAiKeySetupProps = {
  embedded?: boolean
  onKeyValidated?: () => void
}

export default function OpenAiKeySetup({
  embedded = false,
  onKeyValidated,
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
      return
    }

    if (!isValidOpenAiKeyFormat(trimmed)) {
      setValidation({
        status: "invalid",
        message: "Enter a valid OpenAI key starting with sk-.",
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
  }, [onKeyValidated])

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

  const isValidating = validation.status === "validating"

  return (
    <form
      className={
        embedded
          ? "w-full space-y-4"
          : "w-full max-w-md space-y-4 rounded-2xl border border-violet-500/10 bg-[#050505]/80 p-6 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] backdrop-blur-xl"
      }
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {!embedded ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-300">
            <Lock className="size-4" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              OpenAI API key
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">
            Stored only in this browser&apos;s localStorage. Validation and
            generation call OpenAI directly — your key never leaves this device
            or reaches PulseFlow servers.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor={inputId} className={authLabelClassName}>
          API key
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
            placeholder="sk-..."
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isValidating}
            data-1p-ignore
            data-lpignore="true"
            className={cn(authInputClassName, "pr-11")}
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
          Validating...
        </p>
      ) : null}

      {validation.status === "valid" ? (
        <p
          className="flex items-center gap-2 text-sm text-emerald-400"
          role="status"
          aria-live="polite"
        >
          <Check className="size-4" aria-hidden />
          Key is valid and saved securely in this browser
        </p>
      ) : null}

      {validation.status === "invalid" ? (
        <div
          className="flex items-start gap-2 text-sm text-red-400"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">Invalid API Key</p>
            <p className="mt-1 leading-relaxed text-red-300/90">
              {validation.message}
            </p>
          </div>
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isValidating || !apiKey.trim()}
        className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
      >
        {isValidating ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Validating...
          </span>
        ) : (
          "Save & validate key"
        )}
      </Button>
    </form>
  )
}
