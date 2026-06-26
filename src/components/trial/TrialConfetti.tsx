"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type TrialConfettiProps = {
  active: boolean
}

const PARTICLE_COUNT = 28

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function TrialConfetti({ active }: TrialConfettiProps) {
  const [burstId, setBurstId] = useState(0)

  useEffect(() => {
    if (active) {
      setBurstId((current) => current + 1)
    }
  }, [active])

  if (!active) {
    return null
  }

  return (
    <div
      key={burstId}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
        const left = randomBetween(8, 92)
        const delay = randomBetween(0, 0.2)
        const size = randomBetween(4, 8)
        const rotate = randomBetween(-180, 180)
        const colors = [
          "bg-violet-400",
          "bg-fuchsia-400",
          "bg-amber-400",
          "bg-emerald-400",
          "bg-sky-400",
        ]

        return (
          <motion.span
            key={`${burstId}-${index}`}
            className={`absolute rounded-sm ${colors[index % colors.length]}`}
            style={{
              left: `${left}%`,
              top: "38%",
              width: size,
              height: size,
            }}
            initial={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            animate={{
              opacity: 0,
              y: randomBetween(120, 220),
              rotate,
              scale: randomBetween(0.6, 1.2),
            }}
            transition={{ duration: randomBetween(0.9, 1.4), delay, ease: "easeOut" }}
          />
        )
      })}
    </div>
  )
}
