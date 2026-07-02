"use client"

import Link from "next/link"

type PersonalDataConsentFieldProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
}

export default function PersonalDataConsentField({
  checked,
  onCheckedChange,
  disabled = false,
  id = "personal-data-consent",
}: PersonalDataConsentFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm leading-relaxed text-zinc-400"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        disabled={disabled}
        className="mt-0.5 size-4 shrink-0 rounded border-zinc-600 bg-zinc-900 accent-violet-500"
      />
      <span>
        I agree to the processing of my personal data (such as email, username,
        and usage data) as described in the{" "}
        <Link
          href="/privacy"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Privacy Policy
        </Link>{" "}
        and accept the{" "}
        <Link
          href="/terms"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Terms of Service
        </Link>
        .
      </span>
    </label>
  )
}
