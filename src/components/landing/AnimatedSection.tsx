"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { usePerfMode } from "@/hooks/usePerfMode"

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
  delay?: number
}

const ease = [0.22, 1, 0.36, 1] as const

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()
  const { isLite, ready } = usePerfMode()
  const shouldAnimate = ready && !reduceMotion && !isLite

  useEffect(() => {
    if (!shouldAnimate) {
      return
    }

    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldAnimate])

  if (!shouldAnimate) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()
  const { isLite, ready } = usePerfMode()
  const shouldAnimate = ready && !reduceMotion && !isLite

  useEffect(() => {
    if (!shouldAnimate) {
      return
    }

    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldAnimate])

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.3),
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
