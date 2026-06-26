import type { ReactNode } from "react"
import {
  BODY_TEXT,
  SECTION_HEADER,
  SECTION_HEADER_CENTERED,
  SECTION_LABEL,
  SECTION_TITLE,
} from "@/lib/landing-styles"

type SectionHeaderProps = {
  label: string
  title: string
  description?: ReactNode
  centered?: boolean
  className?: string
}

export default function SectionHeader({
  label,
  title,
  description,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`${centered ? SECTION_HEADER_CENTERED : SECTION_HEADER} ${className}`}
    >
      <p className={SECTION_LABEL}>{label}</p>
      <h2 className={SECTION_TITLE}>{title}</h2>
      {description ? <p className={BODY_TEXT}>{description}</p> : null}
    </div>
  )
}

export function SectionHeaderSpacer({ children }: { children: ReactNode }) {
  return <div className="mt-16 md:mt-20">{children}</div>
}
