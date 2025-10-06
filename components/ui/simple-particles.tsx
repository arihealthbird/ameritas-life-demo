"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SimpleParticlesProps {
  className?: string
  quantity?: number
  color?: string
  size?: number
}

export function SimpleParticles({
  className = "",
  quantity = 100,
  color = "#fc3893",
  size = 0.5,
}: SimpleParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const particles = useRef<Particle[]>([])
  const animationFrameId = useRef<number>()

  useEffect(() => {
    console.log("SimpleParticles mounted")
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
      console.log("Canvas context initialized:", !!context.current)
    }

    initCanvas()
    animate()

    window.addEventListener("resize", initCanvas)
    return () => {
      window.removeEventListener("resize", initCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  const initCanvas = () => {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current) return

    const dpr = window.devicePixelRatio || 1
    const width = canvasContainerRef.current.offsetWidth
    const height = canvasContainerRef.current.offsetHeight

    canvasRef.current.width = width * dpr
    canvasRef.current.height = height * dpr
    canvasRef.current.style.width = `${width}px`
    canvasRef.current.style.height = `${height}px`

    context.current.scale(dpr, dpr)

    // Create particles
    particles.current = []
    for (let i = 0; i < quantity; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * size + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    console.log(`Created ${particles.current.length} particles`)
  }

  const animate = () => {
    if (!canvasRef.current || !context.current || !canvasContainerRef.current) return

    const width = canvasContainerRef.current.offsetWidth
    const height = canvasContainerRef.current.offsetHeight

    context.current.clearRect(0, 0, width, height)

    // Update and draw particles
    particles.current.forEach((particle) => {
      // Update position
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Draw particle
      context.current!.beginPath()
      context.current!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      context.current!.fillStyle = `rgba(${hexToRgb(color)}, ${particle.opacity})`
      context.current!.fill()
    })

    animationFrameId.current = requestAnimationFrame(animate)
  }

  return (
    <div className={cn("pointer-events-none", className)} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  hex = hex.replace("#", "")

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return `${r}, ${g}, ${b}`
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}
