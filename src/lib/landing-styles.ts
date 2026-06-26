/** Landing design tokens — editorial layout + violet accent. */

export const LANDING_CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8"

export const LANDING_SECTION =
  "landing-section relative scroll-mt-28 py-24 md:py-32 lg:py-36"

export const SECTION_DIVIDER =
  "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"

export const SECTION_HEADER = "flex max-w-2xl flex-col gap-4 md:max-w-3xl md:gap-5"

export const SECTION_HEADER_CENTERED = `${SECTION_HEADER} md:mx-auto md:items-center md:text-center`

export const SECTION_HEADER_WIDE = `${SECTION_HEADER} max-w-3xl`

export const SECTION_LABEL =
  "inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400"

export const HERO_TITLE =
  "font-bold tracking-[-0.03em] text-white text-[2.75rem] leading-[1.05] sm:text-5xl md:text-6xl md:leading-[1.02] lg:text-[4rem]"

export const SECTION_TITLE =
  "text-2xl font-bold tracking-[-0.02em] text-white md:text-4xl md:leading-tight"

export const BODY_TEXT =
  "max-w-[640px] text-base leading-[1.75] text-zinc-400 md:text-lg md:leading-8"

export const SECTION_CONTENT_GAP = "mt-14 md:mt-20"

export const CARD_BASE =
  "rounded-2xl border border-zinc-800/90 bg-zinc-950/80 transition-all duration-300"

export const CARD_HOVER =
  "hover:border-violet-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.15)]"

export const CARD_FEATURED =
  "rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] via-zinc-950 to-zinc-950"

export const BTN_PRIMARY =
  "inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl bg-violet-600 px-7 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(139,92,246,0.6)] transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_40px_-6px_rgba(139,92,246,0.7)] active:scale-[0.98] sm:w-auto"

export const BTN_SECONDARY =
  "inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950/50 px-7 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-900 active:scale-[0.98] sm:w-auto"

export const ACCENT_TEXT = "text-violet-400"

export const SECTION_TONES = {
  default: "",
  elevated: "bg-zinc-950/60",
  accent:
    "bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.07),transparent)]",
  spotlight:
    "border-y border-violet-500/10 bg-violet-500/[0.03]",
} as const

export type SectionTone = keyof typeof SECTION_TONES
