"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type PerfModeContextValue = {
  isLite: boolean
  ready: boolean
}

const PerfModeContext = createContext<PerfModeContextValue>({
  isLite: false,
  ready: false,
})

function detectLiteMode(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true
  }

  const cores = navigator.hardwareConcurrency ?? 8
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection

  const slowNetwork =
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g"

  return cores <= 4 || memory <= 4 || slowNetwork
}

export function PerfModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PerfModeContextValue>({
    isLite: false,
    ready: false,
  })

  useEffect(() => {
    const isLite = detectLiteMode()
    document.documentElement.dataset.perf = isLite ? "lite" : "full"
    setState({ isLite, ready: true })

    return () => {
      delete document.documentElement.dataset.perf
    }
  }, [])

  return (
    <PerfModeContext.Provider value={state}>{children}</PerfModeContext.Provider>
  )
}

export function usePerfMode() {
  return useContext(PerfModeContext)
}
