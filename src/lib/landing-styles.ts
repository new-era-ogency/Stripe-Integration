/** Landing design tokens — editorial layout + single violet accent. */

export const LANDING_CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8"

export const HERO_SECTION =
  "relative scroll-mt-28 overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24 lg:pb-40 lg:pt-28"

export const LANDING_SECTION =
  "landing-section relative scroll-mt-28 py-20 md:py-28 lg:py-32"

export const SECTION_DIVIDER =
  "pointer-events-none absolute inset-x-0 top-0 h-px bg-zinc-800/80"

export const SECTION_HEADER = "flex max-w-2xl flex-col gap-4 md:max-w-3xl md:gap-5"

export const SECTION_HEADER_CENTERED = `${SECTION_HEADER} md:mx-auto md:items-center md:text-center`

export const SECTION_LABEL =
  "inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400"

export const HERO_TITLE =
  "font-bold tracking-[-0.035em] text-white text-[2.75rem] leading-[1.04] sm:text-5xl md:text-[3.5rem] md:leading-[1.02] lg:text-[4.25rem]"

export const SECTION_TITLE =
  "text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl md:leading-tight lg:text-4xl"

export const BODY_TEXT =
  "max-w-[580px] text-base leading-[1.75] text-zinc-400 md:text-lg md:leading-8"

export const SECTION_CONTENT_GAP = "mt-12 md:mt-16"

export const CARD_BASE =
  "rounded-xl border border-zinc-800/90 bg-zinc-950/80 transition-all duration-300"

export const CARD_HOVER =
  "hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900/70 hover:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]"

export const CARD_INTERACTIVE = `${CARD_BASE} ${CARD_HOVER}`

export const BTN_PRIMARY =
  "inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl bg-violet-600 px-8 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(139,92,246,0.55)] transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_6px_32px_-4px_rgba(139,92,246,0.65)] active:scale-[0.98] sm:w-auto"

export const BTN_SECONDARY =
  "inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl border border-zinc-700/80 bg-transparent px-8 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200 active:scale-[0.98] sm:w-auto"

export const ACCENT_TEXT = "text-violet-400"

export const SECTION_TONES = {
  default: "",
  elevated: "bg-zinc-950/50",
  accent: "",
  spotlight: "border-y border-zinc-900 bg-zinc-950/30",
} as const

export type SectionTone = keyof typeof SECTION_TONES
