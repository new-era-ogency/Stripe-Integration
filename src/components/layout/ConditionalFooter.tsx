"use client"

import { usePathname } from "next/navigation"
import AppFooter from "@/components/layout/AppFooter"

export default function ConditionalFooter() {
  const pathname = usePathname()

  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return <AppFooter />
}
