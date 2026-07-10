"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type AppTheme = "dark" | "light"

type ThemeContextValue = {
  theme: AppTheme
  toggleTheme: () => void
  ready: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "pulseflow-theme"

function applyTheme(theme: AppTheme) {
  const root = document.documentElement
  root.classList.remove("dark", "light")
  root.classList.add(theme)
  root.dataset.theme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>("dark")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const initial: AppTheme = stored === "light" ? "light" : "dark"
    setTheme(initial)
    applyTheme(initial)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) {
      return
    }

    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [ready, theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      ready,
    }),
    [theme, toggleTheme, ready]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
