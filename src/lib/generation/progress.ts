import type {
  ContentSourceInput,
  TranscriptResolvePhase,
} from "@/lib/content-sources/types"
import type { UserTier } from "@/lib/profile"

export type GenerationStageId =
  | "fetch_transcript"
  | "extract_transcript"
  | "transcribe_audio"
  | "generate_posts"

export type GenerationStageMeta = {
  id: GenerationStageId
  label: string
  description: string
  estimateSeconds: number
}

export const GENERATION_STAGES: Record<GenerationStageId, GenerationStageMeta> = {
  fetch_transcript: {
    id: "fetch_transcript",
    label: "Fetch transcript",
    description: "Pulling captions or article text from your source",
    estimateSeconds: 25,
  },
  extract_transcript: {
    id: "extract_transcript",
    label: "Extract with OpenRouter",
    description: "Server blocked — using your key to extract the transcript",
    estimateSeconds: 50,
  },
  transcribe_audio: {
    id: "transcribe_audio",
    label: "Transcribe audio",
    description: "Converting your file to text via Whisper",
    estimateSeconds: 75,
  },
  generate_posts: {
    id: "generate_posts",
    label: "Generate posts",
    description: "Writing X, LinkedIn, and Telegram outputs",
    estimateSeconds: 55,
  },
}

const TIER_GENERATE_ESTIMATE_SECONDS: Record<UserTier, number> = {
  starter: 55,
  pro: 80,
  pro_max: 100,
}

export type GenerationProgressState = {
  pipeline: GenerationStageId[]
  currentStage: GenerationStageId
  startedAt: number
  stageStartedAt: number
}

export function buildGenerationPipeline(
  source: ContentSourceInput,
  _tier: UserTier
): GenerationStageId[] {
  switch (source.type) {
    case "youtube":
      return ["fetch_transcript", "generate_posts"]
    case "article":
      return source.pastedText.trim()
        ? ["generate_posts"]
        : ["fetch_transcript", "generate_posts"]
    case "text":
      return ["generate_posts"]
    case "media":
      return ["transcribe_audio", "generate_posts"]
    default:
      return ["generate_posts"]
  }
}

export function getTotalEstimateSeconds(
  pipeline: GenerationStageId[],
  tier: UserTier
): number {
  return pipeline.reduce((total, stageId) => {
    if (stageId === "generate_posts") {
      return total + TIER_GENERATE_ESTIMATE_SECONDS[tier]
    }

    return total + GENERATION_STAGES[stageId].estimateSeconds
  }, 0)
}

export function createGenerationProgress(
  source: ContentSourceInput,
  tier: UserTier
): GenerationProgressState {
  const pipeline = buildGenerationPipeline(source, tier)
  const now = Date.now()
  const currentStage = pipeline[0]

  return {
    pipeline,
    currentStage,
    startedAt: now,
    stageStartedAt: now,
  }
}

export function mapPhaseToStage(
  phase: TranscriptResolvePhase
): GenerationStageId {
  switch (phase) {
    case "fetching":
      return "fetch_transcript"
    case "openrouter_extract":
      return "extract_transcript"
    case "transcribing":
      return "transcribe_audio"
    default:
      return "fetch_transcript"
  }
}

export function advanceToStage(
  progress: GenerationProgressState,
  stage: GenerationStageId
): GenerationProgressState {
  if (progress.currentStage === stage) {
    return progress
  }

  return {
    ...progress,
    currentStage: stage,
    stageStartedAt: Date.now(),
  }
}

export function switchToExtractStage(
  progress: GenerationProgressState
): GenerationProgressState {
  if (progress.currentStage === "extract_transcript") {
    return progress
  }

  const pipeline = progress.pipeline.includes("extract_transcript")
    ? progress.pipeline
    : (() => {
        const next = [...progress.pipeline]
        const fetchIndex = next.indexOf("fetch_transcript")

        if (fetchIndex >= 0) {
          next.splice(fetchIndex + 1, 0, "extract_transcript")
        } else {
          next.unshift("extract_transcript")
        }

        return next
      })()

  return {
    ...progress,
    pipeline,
    currentStage: "extract_transcript",
    stageStartedAt: Date.now(),
  }
}

export type GenerationProgressMetrics = {
  elapsedSeconds: number
  remainingSeconds: number
  totalEstimateSeconds: number
  percentComplete: number
  currentStageIndex: number
  currentStageMeta: GenerationStageMeta
}

export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))

  if (safe < 60) {
    return `${Math.max(1, safe)} sec`
  }

  const minutes = Math.floor(safe / 60)
  const remainder = safe % 60

  if (remainder === 0) {
    return `${minutes} min`
  }

  return `${minutes} min ${remainder} sec`
}

export function computeProgressMetrics(
  progress: GenerationProgressState,
  tier: UserTier,
  now: number = Date.now()
): GenerationProgressMetrics {
  const { pipeline, currentStage, startedAt, stageStartedAt } = progress
  const currentStageIndex = pipeline.indexOf(currentStage)
  const totalEstimateSeconds = getTotalEstimateSeconds(pipeline, tier)
  const elapsedSeconds = Math.max(0, (now - startedAt) / 1000)

  let completedWeight = 0

  for (let index = 0; index < currentStageIndex; index++) {
    const stageId = pipeline[index]
    completedWeight +=
      stageId === "generate_posts"
        ? TIER_GENERATE_ESTIMATE_SECONDS[tier]
        : GENERATION_STAGES[stageId].estimateSeconds
  }

  const currentEstimate =
    currentStage === "generate_posts"
      ? TIER_GENERATE_ESTIMATE_SECONDS[tier]
      : GENERATION_STAGES[currentStage].estimateSeconds

  const currentStageElapsed = Math.max(0, (now - stageStartedAt) / 1000)
  const currentStageProgress = Math.min(
    currentEstimate,
    currentStageElapsed * 0.85
  )

  const progressWeight = completedWeight + currentStageProgress
  const percentComplete = Math.min(
    97,
    Math.round((progressWeight / totalEstimateSeconds) * 100)
  )

  const remainingSeconds = Math.max(0, totalEstimateSeconds - elapsedSeconds)

  const currentStageMeta =
    currentStage === "generate_posts"
      ? {
          ...GENERATION_STAGES.generate_posts,
          estimateSeconds: TIER_GENERATE_ESTIMATE_SECONDS[tier],
        }
      : GENERATION_STAGES[currentStage]

  return {
    elapsedSeconds,
    remainingSeconds,
    totalEstimateSeconds,
    percentComplete,
    currentStageIndex,
    currentStageMeta,
  }
}
