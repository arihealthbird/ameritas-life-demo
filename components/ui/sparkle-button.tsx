"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SparkleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  colors?: {
    first: string
    second: string
  }
  sparklesCount?: number
  sparkleSize?: number
  containment?: "hidden" | "overflow"
}

export function SparkleButton({
  children,
  className,
  colors = {
    first: "#9b87f5",
    second: "#fc3893",
  },
  sparklesCount = 20,
  sparkleSize = 1,
  containment = "hidden",
  ...props
}: SparkleButtonProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sparkleTimeout = useRef<NodeJS.Timeout | null>(null)

  const createSparkle = (x: number, y: number) => {
    const size = Math.random() * 3 * sparkleSize + 1
    const color = Math.random() > 0.5 ? colors.first : colors.second
    return {
      id: Math.random(),
      x,
      y,
      size,
      color,
    }
  }

  const generateSparkles = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const newSparkles = []
    for (let i = 0; i < sparklesCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 50 + 10
      const x = offsetX + Math.cos(angle) * distance
      const y = offsetY + Math.sin(angle) * distance
      newSparkles.push(createSparkle(x, y))
    }

    setSparkles(newSparkles)

    if (sparkleTimeout.current) {
      clearTimeout(sparkleTimeout.current)
    }

    sparkleTimeout.current = setTimeout(() => {
      setSparkles([])
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (sparkleTimeout.current) {
        clearTimeout(sparkleTimeout.current)
      }
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      className={cn("relative", containment === "overflow" ? "overflow-visible" : "overflow-hidden", className)}
      onClick={generateSparkles}
      {...props}
    >
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute pointer-events-none animate-sparkle-fade"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: sparkle.color,
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
      ))}
      {children}
    </button>
  )
}
