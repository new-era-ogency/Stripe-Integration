import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type GoogleAuthButtonProps = {
  isLoading: boolean
  disabled?: boolean
  onClick: () => void
  label?: string
  loadingLabel?: string
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.72h6.43c-.13 1.02-.83 2.56-2.38 3.56l-.02.14 3.46 2.68.24.02c2.2-2.03 3.47-5.02 3.47-8.07z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.15 0 5.8-1.04 7.73-2.83l-3.68-2.85c-.99.68-2.31 1.16-4.05 1.16-3.1 0-5.72-2.09-6.66-4.9l-.14.01-3.6 2.79-.05.13C3.72 21.4 7.58 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.34 14.58A7.18 7.18 0 0 1 4.96 12c0-.9.16-1.77.44-2.58l-.01-.15-3.64-2.83-.12.06A11.96 11.96 0 0 0 0 12c0 1.93.46 3.75 1.28 5.36l4.06-2.78z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c2.19 0 3.67.95 4.51 1.74l3.29-3.22C17.78 1.19 15.15 0 12 0 7.58 0 3.72 2.6 1.28 6.64l4.06 2.78C6.28 6.84 8.9 4.75 12 4.75z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function GoogleAuthButton({
  isLoading,
  disabled = false,
  onClick,
  label = "Continue with Google",
  loadingLabel = "Connecting to Google…",
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      variant="outline"
      className="h-11 w-full gap-2.5 rounded-lg border-zinc-800 bg-[#09090b] text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white focus-visible:ring-0 disabled:opacity-80"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin text-violet-400" />
          {loadingLabel}
        </>
      ) : (
        <>
          <GoogleIcon />
          {label}
        </>
      )}
    </Button>
  )
}
