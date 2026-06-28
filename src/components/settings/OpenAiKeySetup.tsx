"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { AlertCircle, Check, Loader2, Lock } from "lucide-react"
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  readStoredOpenAiKey,
  validateOpenAiKey,
  writeStoredOpenAiKey,
} from "@/lib/openai/client-key"

type ValidationState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "valid" }
  | { status: "invalid"; message: string }

export default function OpenAiKeySetup() {
  const inputId = useId()
  const [apiKey, setApiKey] = useState("")
  const [validation, setValidation] = useState<ValidationState>({ status: "idle" })
  const [hasLoadedStoredKey, setHasLoadedStoredKey] = useState(false)

  useEffect(() => {
    const stored = readStoredOpenAiKey()
    if (stored) {
      setApiKey(stored)
    }
    setHasLoadedStoredKey(true)
  }, [])

  const persistAndValidate = useCallback(async (value: string) => {
    const trimmed = value.trim()

    if (!trimmed) {
      writeStoredOpenAiKey("")
      setValidation({ status: "idle" })
      return
    }

    writeStoredOpenAiKey(trimmed)
    setValidation({ status: "validating" })

    const result = await validateOpenAiKey(trimmed)

    if (result.ok) {
      setValidation({ status: "valid" })
      return
    }

    setValidation({ status: "invalid", message: result.message })
  }, [])

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
      className="w-full max-w-md space-y-4 rounded-2xl border border-violet-500/10 bg-[#050505]/80 p-6 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-violet-300">
          <Lock className="size-4" aria-hidden />
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            OpenAI API key
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-zinc-500">
          Stored only in this browser (`localStorage`). Validation calls OpenAI
          directly — your key is never sent to PulseFlow servers.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={inputId} className={authLabelClassName}>
          API key
        </Label>
        <Input
          id={inputId}
          type="password"
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
          autoComplete="off"
          spellCheck={false}
          disabled={isValidating}
          className={authInputClassName}
        />
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
          Key is valid
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
