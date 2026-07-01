import { isLikelyNetworkError as isLikelyNetworkErrorBase } from "@/lib/network-errors"

export class GenerationAbortedError extends Error {
  constructor(message = "Generation stopped") {
    super(message)
    this.name = "GenerationAbortedError"
  }
}

export function isAbortError(error: unknown, signal?: AbortSignal): boolean {
  if (signal?.aborted) {
    return true
  }

  if (error instanceof GenerationAbortedError) {
    return true
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return true
  }

  if (error instanceof Error && error.name === "AbortError") {
    return true
  }

  return false
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new GenerationAbortedError()
  }
}

/** Normalize browser fetch abort failures into GenerationAbortedError. */
export function rethrowIfAborted(error: unknown, signal?: AbortSignal): void {
  if (isAbortError(error, signal)) {
    throw new GenerationAbortedError()
  }
}

export async function fetchWithSignal(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const signal = init?.signal ?? undefined

  try {
    return await fetch(input, init)
  } catch (error) {
    rethrowIfAborted(error, signal)
    throw error
  }
}

export function isLikelyNetworkError(error: unknown): boolean {
  if (isAbortError(error)) {
    return false
  }

  return isLikelyNetworkErrorBase(error)
}
