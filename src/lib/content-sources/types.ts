export type ContentSourceTab = "youtube" | "article" | "text" | "media"

export type ContentSourceInput =
  | { type: "youtube"; url: string }
  | { type: "article"; url: string; pastedText: string }
  | { type: "text"; rawText: string }
  | { type: "media"; file: File }

export type TranscriptResolvePhase = "fetching" | "transcribing"

export type ResolvedTranscript = {
  rawTranscript: string
  sourceLabel: string
}
