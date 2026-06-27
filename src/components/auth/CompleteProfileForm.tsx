"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { normalizeUsername } from "@/lib/auth/username"
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/LoginForm"
import { completeUsernameSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CompleteProfileForm() {
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const parsed = completeUsernameSchema.safeParse({
      username: normalizeUsername(username),
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid username.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/ensure-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: parsed.data.username }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        setError(payload?.error ?? "Could not save your username. Try again.")
        setIsSubmitting(false)
        return
      }

      router.refresh()
      router.push("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
      <p className="text-center text-sm leading-relaxed text-zinc-300">
        Welcome to PulseFlow! Choose your unique username to get started.
      </p>

      <div className="space-y-2">
        <Label htmlFor="username" className={authLabelClassName}>
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="yourname"
          value={username}
          onChange={(e) => {
            if (error) setError(null)
            setUsername(normalizeUsername(e.target.value))
          }}
          disabled={isSubmitting}
          autoComplete="username"
          spellCheck={false}
          className={authInputClassName}
        />
        <p className="text-xs text-zinc-600">
          3–20 characters. Letters, numbers, and underscores.
        </p>
      </div>

      {error ? (
        <p className="text-sm leading-relaxed text-amber-300/90" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || !username.trim()}
        className="h-11 w-full rounded-lg bg-white font-medium text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-0 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </span>
        ) : (
          "Continue to dashboard"
        )}
      </Button>
    </form>
  )
}
