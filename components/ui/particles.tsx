"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
  size?: number
}

export function Particles({
  className,
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  size = 2,
  ...props
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<any[]>([])
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }
    initCanvas()
    animate()
    window.addEventListener("resize", initCanvas)

    return () => {
      window.removeEventListener("resize", initCanvas)
    }
  }, [])

  useEffect(() => {
    initCanvas()
  }, [refresh])

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = []
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
    }
  }

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const translateX = 0
    const translateY = 0
    const radius = Math.floor(Math.random() * size) + 1
    const opacity = Number((Math.random() * 0.6 + 0.1).toFixed(1))

    return {
      x,
      y,
      translateX,
      translateY,
      radius,
      opacity,
    }
  }

  const drawParticles = () => {
    for (let i = 0; i < quantity; i++) {
      circles.current.push(circleParams())
    }
  }

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
    }
  }

  const drawCircle = (circle: any, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, radius, opacity } = circle
      context.current.beginPath()
      context.current.arc(x + translateX, y + translateY, radius, 0, 2 * Math.PI)
      context.current.fillStyle = `rgba(${hexToRgb(color)}, ${opacity})`
      context.current.fill()
      context.current.closePath()
    }
  }

  const animate = () => {
    clearContext()
    circles.current.forEach((circle, i) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.radius, // left
        circle.y + circle.translateY - circle.radius, // top
        canvasSize.current.w - circle.x - circle.translateX - circle.radius, // right
        canvasSize.current.h - circle.y - circle.translateY - circle.radius, // bottom
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = Number.parseFloat(remap(closestEdge, [0, 20], [0, 1]).toFixed(2))
      if (remapClosestEdge > 1) {
        circle.opacity = 0.1
      } else {
        circle.opacity = 0.1 - remapClosestEdge
      }

      // Move circle
      const moveX = vx + (mouse.current.x - circle.x) / staticity
      const moveY = vy + (mouse.current.y - circle.y) / staticity
      circle.translateX += moveX
      circle.translateY += moveY

      // Easing
      circle.translateX *= ease / 100
      circle.translateY *= ease / 100

      // Draw
      drawCircle(circle, true)
    })
    window.requestAnimationFrame(animate)
  }

  return (
    <div className={cn("fixed inset-0 -z-10", className)} ref={canvasContainerRef} {...props}>
      <canvas ref={canvasRef} />
    </div>
  )
}

// Utility functions
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : "0, 0, 0"
}

const remap = (value: number, inputRange: number[], outputRange: number[]) => {
  const [inputMin, inputMax] = inputRange
  const [outputMin, outputMax] = outputRange
  return ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) + outputMin
}
