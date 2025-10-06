"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Skip animation on first render to prevent initial animation
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  // Scroll to top on route change with proper timing
  useEffect(() => {
    // Only scroll if it's not the first render and we're in a browser environment
    if (!isFirstRender && typeof window !== "undefined") {
      // Scroll to top immediately when route changes (during fade-out)
      // This ensures the new page content starts from the top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      })
    }
  }, [pathname, isFirstRender])

  // Apply enhanced transitions to all page navigations
  const shouldAnimate = !isFirstRender

  // Enhanced animation variants for smoother transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20, // Slight vertical movement for more dynamic feel
      scale: 0.98, // Subtle scale effect
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -20, // Move up slightly on exit
      scale: 1.02, // Slight scale up on exit
    },
  }

  // Enhanced transition configuration
  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth easing
    duration: 0.4, // Slightly longer for smoother feel
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Additional scroll-to-top after exit animation completes
        // This ensures we're at the top before the new page fades in
        if (typeof window !== "undefined") {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
          })
        }
      }}
    >
      <motion.div
        key={pathname}
        initial={shouldAnimate ? "initial" : "in"}
        animate="in"
        exit={shouldAnimate ? "out" : "in"}
        variants={pageVariants}
        transition={pageTransition}
        style={{
          width: "100%",
          minHeight: "100vh", // Ensure full viewport height
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
