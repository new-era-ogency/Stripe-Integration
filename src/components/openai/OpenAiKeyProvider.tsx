"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import OpenAiKeySetupModal from "@/components/settings/OpenAiKeySetupModal"
import {
  OPENAI_KEY_CHANGED_EVENT,
  readStoredOpenAiKey,
} from "@/lib/openai/client-key"

type OpenAiKeyContextValue = {
  hasOpenAiKey: boolean
  openKeyModal: () => void
  closeKeyModal: () => void
  refreshKeyStatus: () => void
}

const OpenAiKeyContext = createContext<OpenAiKeyContextValue | null>(null)

export function useOpenAiKey() {
  const context = useContext(OpenAiKeyContext)

  if (!context) {
    throw new Error("useOpenAiKey must be used within OpenAiKeyProvider")
  }

  return context
}

export function OpenAiKeyProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasOpenAiKey, setHasOpenAiKey] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const refreshKeyStatus = useCallback(() => {
    setHasOpenAiKey(Boolean(readStoredOpenAiKey()))
  }, [])

  useEffect(() => {
    refreshKeyStatus()

    window.addEventListener(OPENAI_KEY_CHANGED_EVENT, refreshKeyStatus)
    window.addEventListener("storage", refreshKeyStatus)

    return () => {
      window.removeEventListener(OPENAI_KEY_CHANGED_EVENT, refreshKeyStatus)
      window.removeEventListener("storage", refreshKeyStatus)
    }
  }, [refreshKeyStatus])

  const value = useMemo(
    () => ({
      hasOpenAiKey,
      openKeyModal: () => setModalOpen(true),
      closeKeyModal: () => setModalOpen(false),
      refreshKeyStatus,
    }),
    [hasOpenAiKey, refreshKeyStatus]
  )

  return (
    <OpenAiKeyContext.Provider value={value}>
      {children}
      <OpenAiKeySetupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onKeySaved={refreshKeyStatus}
      />
    </OpenAiKeyContext.Provider>
  )
}
