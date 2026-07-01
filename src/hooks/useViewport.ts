"use client"

import { useEffect, useState } from "react"
import { MOBILE_MEDIA_QUERY } from "@/lib/viewport"

type ViewportState = {
  isMobile: boolean
  ready: boolean
}

export function useViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>({
    isMobile: false,
    ready: false,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)

    const update = () => {
      setState({ isMobile: mediaQuery.matches, ready: true })
    }

    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return state
}
