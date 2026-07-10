"use client"

import { useEffect } from "react"
import {
  IUBENDA_CS_CONFIG_SCRIPT,
  IUBENDA_SITE_ID,
} from "@/lib/consent/iubenda-config"

function appendScriptIfMissing(
  script: HTMLScriptElement,
  id: string
): void {
  if (document.getElementById(id)) {
    return
  }

  script.id = id
  document.head.appendChild(script)
}

/**
 * Injects Iubenda after hydration so autoblocking can annotate script tags
 * without conflicting with React's SSR markup (data-cmp-* attributes).
 */
export default function IubendaConsentScripts() {
  useEffect(() => {
    const configScript = document.createElement("script")
    configScript.text = IUBENDA_CS_CONFIG_SCRIPT
    appendScriptIfMissing(configScript, "iubenda-cs-config")

    const autoblocking = document.createElement("script")
    autoblocking.src = `https://cs.iubenda.com/autoblocking/${IUBENDA_SITE_ID}.js`
    appendScriptIfMissing(autoblocking, "iubenda-autoblocking")

    const gppStub = document.createElement("script")
    gppStub.src = "https://cdn.iubenda.com/cs/gpp/stub.js"
    appendScriptIfMissing(gppStub, "iubenda-gpp-stub")

    const csScript = document.createElement("script")
    csScript.src = "https://cdn.iubenda.com/cs/iubenda_cs.js"
    csScript.async = true
    csScript.charset = "UTF-8"
    appendScriptIfMissing(csScript, "iubenda-cs")
  }, [])

  return null
}
