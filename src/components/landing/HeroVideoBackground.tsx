"use client"

import { useEffect, useRef } from "react"

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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0

    const particleCount = 48
    const connectionDistance = 140
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }))
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)

      if (particles.length === 0) {
        createParticles()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        if (!prefersReducedMotion) {
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < 0 || particle.x > width) particle.vx *= -1
          if (particle.y < 0 || particle.y > height) particle.vy *= -1
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
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.18
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      animationId = window.requestAnimationFrame(draw)
    }

    resize()
    draw()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas.parentElement!)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.18)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.12)_0%,transparent_45%)]" />

      <div className="hero-orb hero-orb-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="hero-orb hero-orb-b absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="hero-orb hero-orb-c absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-70"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#000000]" />
    </div>
  )
}
