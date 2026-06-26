/** Shared layout + typography tokens for the marketing landing page. */

export const LANDING_CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8"

export const LANDING_SECTION =
  "relative scroll-mt-28 py-28 md:py-32 lg:py-40"

export const SECTION_DIVIDER =
  "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent"

export const SECTION_HEADER =
  "flex flex-col gap-5 md:mx-auto md:max-w-3xl md:gap-6"

export const SECTION_HEADER_CENTERED = `${SECTION_HEADER} md:items-center md:text-center`

export const SECTION_LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.42em] text-violet-400/75"

export const HERO_TITLE =
  "font-bold tracking-[-0.02em] text-white text-[2.75rem] leading-[1.04] sm:text-5xl md:text-6xl md:leading-[1.03] lg:text-[4.5rem] lg:leading-[1.02]"

export const SECTION_TITLE =
  "text-3xl font-bold tracking-[-0.02em] text-white md:text-[2.65rem] md:leading-tight"

export const BODY_TEXT =
  "max-w-[650px] text-base leading-[1.75] text-zinc-400 md:text-[1.05rem] md:leading-8"

export const SECTION_CONTENT_GAP = "mt-16 md:mt-20"

export const CARD_BASE =
  "perf-surface rounded-2xl border border-zinc-800/70 bg-zinc-950/50 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"

export const CARD_HOVER =
  "hover:-translate-y-1.5 hover:border-violet-500/30 hover:shadow-[0_24px_56px_-20px_rgba(139,92,246,0.28)] active:translate-y-0 active:scale-[0.995]"

export const CHIP_INTERACTIVE =
  "transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900/80 active:translate-y-0"

export const BTN_PRIMARY =
  "btn-shine group relative inline-flex h-12 min-h-[48px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-white to-zinc-200 px-8 text-sm font-semibold text-black shadow-[0_10px_36px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_14px_44px_-10px_rgba(255,255,255,0.5)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"

export const BTN_SECONDARY =
  "inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-xl border border-zinc-700/70 bg-zinc-950/60 px-8 text-sm font-semibold text-zinc-200 shadow-sm backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:border-violet-500/45 hover:bg-zinc-900/80 hover:text-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"

export const SECTION_TONES = {
  default: "",
  elevated:
    "bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-transparent",
  accent:
    "bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.09),transparent)]",
  spotlight:
    "bg-gradient-to-b from-violet-500/[0.05] via-transparent to-transparent",
} as const

export type SectionTone = keyof typeof SECTION_TONES
