import { cn } from "@/lib/utils"

/**
 * Shared dashboard surface + typography tokens.
 * Dark = default classes; light: = white surfaces, black + violet text.
 */
export const dash = {
  pageBg: "bg-black light:bg-white",
  heading: "text-white light:text-zinc-900",
  headingLg:
    "text-3xl font-semibold tracking-tight text-white md:text-4xl light:text-zinc-900",
  subheading: "text-lg font-medium text-white light:text-violet-950",
  body: "text-sm text-zinc-400 light:text-zinc-600",
  muted: "text-sm text-zinc-500 light:text-violet-700/90",
  label: "text-[10px] uppercase tracking-[0.35em] text-zinc-600 light:text-violet-600",
  statLabel: "text-sm text-zinc-500 light:text-violet-700",
  statValue: "text-3xl font-semibold tracking-tight text-white light:text-violet-950",
  card: "rounded-2xl border border-zinc-800/90 bg-zinc-950/80 light:border-violet-200 light:bg-white light:shadow-[0_1px_3px_rgba(109,40,217,0.06)]",
  section:
    "rounded-2xl border border-zinc-800/90 bg-zinc-950/50 light:border-violet-200 light:bg-white light:shadow-[0_1px_3px_rgba(109,40,217,0.06)]",
  historyItem:
    "rounded-2xl border bg-zinc-950/50 p-4 transition-all duration-200 md:p-5 light:border-violet-100 light:bg-white light:shadow-sm hover:border-zinc-700 hover:bg-zinc-950/80 light:hover:border-violet-300 light:hover:bg-violet-50/40",
  historyItemActive:
    "border-violet-500/40 shadow-[0_0_30px_-12px_rgba(139,92,246,0.35)] light:border-violet-400 light:bg-violet-50/60 light:shadow-[0_4px_24px_-12px_rgba(109,40,217,0.2)]",
  historyItemIdle: "border-zinc-900 light:border-violet-100",
  preview: "text-sm leading-relaxed text-zinc-400 light:text-zinc-700",
  monoLink:
    "font-mono text-[11px] text-zinc-500 transition-colors hover:text-violet-300 light:text-violet-600 light:hover:text-violet-800",
  tag: "rounded-md border border-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500 light:border-violet-200 light:bg-violet-50 light:text-violet-700",
  badge:
    "rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-[10px] text-zinc-500 light:border-violet-200 light:bg-violet-50 light:text-violet-700",
  btnPrimary:
    "h-11 rounded-xl bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 light:bg-violet-600 light:text-white light:hover:bg-violet-500",
  btnOutline:
    "h-11 rounded-xl border border-zinc-700 bg-transparent px-5 text-sm font-medium text-zinc-200 hover:bg-zinc-900 light:border-violet-300 light:text-violet-800 light:hover:bg-violet-50",
  actionBtn:
    "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 text-xs font-medium text-zinc-200 transition-colors hover:border-violet-500/30 hover:bg-zinc-900 hover:text-white light:border-violet-200 light:bg-white light:text-violet-900 light:hover:border-violet-400 light:hover:bg-violet-50",
  actionBtnGhost:
    "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-transparent px-4 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white light:border-violet-200 light:text-violet-700 light:hover:border-violet-300 light:hover:bg-violet-50 light:hover:text-violet-900",
  emptyBox:
    "rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-950/40 px-6 py-12 text-center light:border-violet-200 light:bg-violet-50/30",
  emptyText: "text-base font-medium text-zinc-200 light:text-violet-950",
  skeleton: "animate-pulse rounded bg-zinc-800 light:bg-violet-100",
  panel:
    "rounded-2xl border border-zinc-900 bg-[#050505] shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)] light:border-violet-200 light:bg-white",
  panelHeader: "border-b border-zinc-900 px-5 py-4 light:border-violet-200",
  contentBlock:
    "rounded-xl border border-zinc-800/80 bg-[#020202] p-4 light:border-violet-200 light:bg-white",
  fieldLabel: "text-sm text-zinc-300 light:text-violet-900",
  inputSurface:
    "border-zinc-800 bg-zinc-900/80 text-white placeholder:text-zinc-600 light:border-violet-200 light:bg-white light:text-zinc-900 light:placeholder:text-zinc-400",
} as const

export function dashCn(...classes: Array<string | false | null | undefined>) {
  return cn(...classes)
}
