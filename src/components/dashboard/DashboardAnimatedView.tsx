"use client"

import type { ReactNode } from "react"

type DashboardAnimatedViewProps = {
  viewKey: string
  children: ReactNode
  className?: string
}

export default function DashboardAnimatedView({
  viewKey,
  children,
  className = "",
}: DashboardAnimatedViewProps) {
  return (
    <div key={viewKey} className={`dashboard-view-enter ${className}`.trim()}>
      {children}
    </div>
  )
}
