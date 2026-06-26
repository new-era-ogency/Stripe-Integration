"use client"

import { useEffect, useRef } from "react"
import { usePerfMode } from "@/hooks/usePerfMode"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export default function HeroVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isLite } = usePerfMode()

  useEffect(() => {
    if (isLite) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) {
      return
    }

    let animationId = 0
    let isVisible = true
    let lastFrame = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0

    const particleCount = 22
    const connectionDistance = 120
    const frameInterval = 1000 / 30
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.2 + 0.5,
        opacity: Math.random() * 0.45 + 0.2,
      }))
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) {
        return
      }

      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (particles.length === 0) {
        createParticles()
      }
    }

    const draw = (timestamp: number) => {
      animationId = window.requestAnimationFrame(draw)

      if (!isVisible || document.hidden) {
        return
      }

      if (timestamp - lastFrame < frameInterval) {
        return
      }

      lastFrame = timestamp
      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1
        }
        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${particle.opacity})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distanceSq = dx * dx + dy * dy
          const maxDistSq = connectionDistance * connectionDistance

          if (distanceSq < maxDistSq) {
            const distance = Math.sqrt(distanceSq)
            const opacity = (1 - distance / connectionDistance) * 0.14
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0 }
    )

    const onVisibilityChange = () => {
      if (!document.hidden && isVisible && !animationId) {
        animationId = window.requestAnimationFrame(draw)
      }
    }

    resize()
    animationId = window.requestAnimationFrame(draw)

    const resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
      visibilityObserver.observe(canvas.parentElement)
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.cancelAnimationFrame(animationId)
    }
  }, [isLite])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.18)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.12)_0%,transparent_45%)]" />

      <div className="hero-orb hero-orb-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="hero-orb hero-orb-b absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="hero-orb hero-orb-c absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      {!isLite ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-60"
          aria-hidden="true"
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#000000]" />
    </div>
  )
}
