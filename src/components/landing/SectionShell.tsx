import type { ReactNode } from "react"
import {
  LANDING_CONTAINER,
  LANDING_SECTION,
  SECTION_DIVIDER,
  SECTION_TONES,
  type SectionTone,
} from "@/lib/landing-styles"

type SectionShellProps = {
  id?: string
  tone?: SectionTone
  children: ReactNode
  className?: string
  divider?: boolean
}

export default function SectionShell({
  id,
  tone = "default",
  children,
  className = "",
  divider = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`landing-section ${LANDING_SECTION} ${SECTION_TONES[tone]} ${className}`}
    >
      {divider ? <div className={SECTION_DIVIDER} aria-hidden /> : null}
      <div className={LANDING_CONTAINER}>{children}</div>
    </section>
  )
}
