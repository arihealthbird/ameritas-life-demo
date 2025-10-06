"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

export interface QuizNavigationOptions {
  smoothTransition?: boolean
  scrollToTop?: boolean
  scrollDelay?: number
}

export function useQuizNavigation(options: QuizNavigationOptions = {}) {
  const router = useRouter()
  const { smoothTransition = true, scrollToTop = true, scrollDelay = 100 } = options

  // Enhanced scroll-to-top function specifically for quiz pages
  const scrollToTopImmediate = useCallback(() => {
    if (typeof window !== "undefined") {
      // Multiple scroll attempts to ensure it works across different scenarios
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })

      // Additional scroll with requestAnimationFrame for reliability
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      })

      // Final scroll with slight delay to handle any async content loading
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      }, 50)
    }
  }, [])

  // Enhanced navigation function with guaranteed scroll-to-top
  const navigateToNext = useCallback(
    (nextPath: string) => {
      // Immediate scroll before navigation
      if (scrollToTop) {
        scrollToTopImmediate()
      }

      if (smoothTransition) {
        // Add a small delay to allow for exit animation
        setTimeout(() => {
          router.push(nextPath)

          // Scroll to top after navigation
          if (scrollToTop) {
            setTimeout(() => {
              scrollToTopImmediate()
            }, scrollDelay)
          }
        }, 150)
      } else {
        router.push(nextPath)

        // Immediate scroll after navigation
        if (scrollToTop) {
          setTimeout(() => {
            scrollToTopImmediate()
          }, scrollDelay)
        }
      }
    },
    [router, smoothTransition, scrollToTop, scrollDelay, scrollToTopImmediate],
  )

  // Enhanced back navigation with scroll-to-top
  const navigateBack = useCallback(() => {
    // Immediate scroll before going back
    if (scrollToTop) {
      scrollToTopImmediate()
    }

    if (smoothTransition) {
      setTimeout(() => {
        router.back()

        // Scroll to top after going back
        if (scrollToTop) {
          setTimeout(() => {
            scrollToTopImmediate()
          }, scrollDelay)
        }
      }, 150)
    } else {
      router.back()

      // Immediate scroll after going back
      if (scrollToTop) {
        setTimeout(() => {
          scrollToTopImmediate()
        }, scrollDelay)
      }
    }
  }, [router, smoothTransition, scrollToTop, scrollDelay, scrollToTopImmediate])

  // Enhanced replace navigation (for programmatic redirects)
  const navigateReplace = useCallback(
    (path: string) => {
      // Immediate scroll before replace
      if (scrollToTop) {
        scrollToTopImmediate()
      }

      if (smoothTransition) {
        setTimeout(() => {
          router.replace(path)

          // Scroll to top after replace
          if (scrollToTop) {
            setTimeout(() => {
              scrollToTopImmediate()
            }, scrollDelay)
          }
        }, 150)
      } else {
        router.replace(path)

        // Immediate scroll after replace
        if (scrollToTop) {
          setTimeout(() => {
            scrollToTopImmediate()
          }, scrollDelay)
        }
      }
    },
    [router, smoothTransition, scrollToTop, scrollDelay, scrollToTopImmediate],
  )

  // Auto-scroll on any route change within quiz section
  useEffect(() => {
    if (scrollToTop && typeof window !== "undefined") {
      // Ensure we're at the top when this hook initializes
      scrollToTopImmediate()
    }
  }, [scrollToTop, scrollToTopImmediate])

  return {
    navigateToNext,
    navigateBack,
    navigateReplace,
    scrollToTopImmediate,
  }
}
