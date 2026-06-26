"use client"

import { useEffect, useRef, useState } from "react"
import { usePerfMode } from "@/hooks/usePerfMode"

type CountUpProps = {
  value: string
  duration?: number
}

function parseStatValue(raw: string): {
  prefix: string
  target: number
  suffix: string
  decimals: number
} {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/)

  if (!match) {
    return { prefix: "", target: 0, suffix: raw, decimals: 0 }
  }

  const [, prefix, numberPart, suffix] = match
  const decimals = numberPart.includes(".") ? 1 : 0

  return {
    prefix,
    target: Number(numberPart),
    suffix,
    decimals,
  }
}

export default function CountUp({ value, duration = 1200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const { isLite } = usePerfMode()
  const parsed = parseStatValue(value)

  useEffect(() => {
    if (isLite || parsed.target === 0) {
      setDisplay(value)
      return
    }

    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = parsed.target * eased

          setDisplay(
            `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`
          )

          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [duration, isLite, parsed.decimals, parsed.prefix, parsed.suffix, parsed.target, value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
