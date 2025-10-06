"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface QuizPageWrapperProps {
  children: ReactNode
  className?: string
}

export default function QuizPageWrapper({ children, className = "" }: QuizPageWrapperProps) {
  const pathname = usePathname()

  // Enhanced scroll-to-top for quiz pages
  useEffect(() => {
    // Only apply to quiz pages
    if (pathname.startsWith("/insurance-type-quiz")) {
      // Multiple scroll attempts for maximum reliability
      const scrollToTop = () => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" })
        }
      }

      // Immediate scroll
      scrollToTop()

      // Scroll with requestAnimationFrame
      requestAnimationFrame(scrollToTop)

      // Additional scroll with small delay for any async content
      const timeoutId = setTimeout(scrollToTop, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [pathname])

  // Quiz-specific animation variants
  const quizPageVariants = {
    initial: {
      opacity: 0,
      y: 15,
      scale: 0.99,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -15,
      scale: 1.01,
    },
  }

  const quizPageTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.35, // Slightly faster for quiz flow
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Ensure scroll-to-top after animation completes
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" })
        }
      }}
    >
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={quizPageVariants}
        transition={quizPageTransition}
        className={`min-h-screen ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
