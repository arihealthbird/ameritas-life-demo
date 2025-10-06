"use client"

import type React from "react"
import { useEffect, useState, useRef, forwardRef } from "react"
import { PiggyBank, TrendingUp, AlertCircle, HelpCircle } from "lucide-react"

interface SavingsEstimateCardProps {
  estimatedSavings: number
  incomeAmount: string
}

const SavingsEstimateCard = forwardRef<HTMLDivElement, SavingsEstimateCardProps>(
  ({ estimatedSavings: propEstimatedSavings, incomeAmount }, ref) => {
    const [displayedSavings, setDisplayedSavings] = useState<number>(0)
    const [isCalculating, setIsCalculating] = useState<boolean>(true)
    const [calculationError, setCalculationError] = useState<string | null>(null)
    const [isAnimating, setIsAnimating] = useState<boolean>(false)
    const requestRef = useRef<number>()
    const timeoutRef = useRef<NodeJS.Timeout>()
    const cardRef = useRef<HTMLDivElement>(null)

    // Scroll to card when it becomes visible
    useEffect(() => {
      if (propEstimatedSavings > 0 && !isCalculating) {
        // Use a small timeout to ensure DOM is updated
        const timer = setTimeout(() => {
          // Use the forwarded ref or local ref
          const element = (ref as React.RefObject<HTMLDivElement>)?.current || cardRef.current
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
        }, 100) // Short delay to ensure the component is rendered but before animations complete

        return () => clearTimeout(timer)
      }
    }, [propEstimatedSavings, isCalculating, ref])

    // Counter animation function
    const animateValue = (start: number, end: number, duration: number) => {
      // Don't animate if start and end are the same
      if (start === end) {
        setDisplayedSavings(end)
        return
      }

      setIsAnimating(true)
      const startTime = Date.now()

      const updateValue = () => {
        const now = Date.now()
        const elapsedTime = now - startTime
        const progress = Math.min(elapsedTime / duration, 1)

        // Easing function for smoother animation (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        const currentValue = Math.floor(start + (end - start) * easeProgress)
        setDisplayedSavings(currentValue)

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(updateValue)
        } else {
          setDisplayedSavings(end)
          setIsAnimating(false)
        }
      }

      // Cancel any existing animation frame before starting a new one
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }

      requestRef.current = requestAnimationFrame(updateValue)
    }

    useEffect(() => {
      // Initial setup - always start with calculating state
      setIsCalculating(true)

      // Clear any previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Skip animation if no income provided
      if (!incomeAmount) {
        setIsCalculating(false)
        setDisplayedSavings(0)
        return
      }

      // When prop value changes, start the process
      timeoutRef.current = setTimeout(() => {
        setIsCalculating(false)

        // If the savings is 0, just set it directly without animation
        if (propEstimatedSavings === 0) {
          setDisplayedSavings(0)
          return
        }

        // Start animation
        animateValue(0, propEstimatedSavings, 800)
      }, 600)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }, [propEstimatedSavings, incomeAmount])

    // Cleanup animation frame on unmount
    useEffect(() => {
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    // Only render component if we have income data
    if (!incomeAmount) return null

    return (
      <div
        ref={(node) => {
          // Handle both refs
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }
          cardRef.current = node
        }}
        className="bg-gradient-to-br from-[#f0f9ff] via-[#e6f7ff] to-[#f5f9ff] rounded-xl p-5 sm:p-6 mt-8 shadow-md border border-[#d1e9ff] animate-fade-in"
      >
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2.5 rounded-full text-white shadow-md">
            <PiggyBank size={20} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Estimated Monthly Subsidy
            <div className="relative ml-2 inline-block group">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-help"
                aria-label="Help for subsidy estimate"
              >
                <HelpCircle size={16} />
              </button>
              <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-lg py-2 px-3 w-64 bottom-full left-1/2 -translate-x-1/2 -translate-y-1 pointer-events-none">
                A premium tax credit is financial help from the federal government that lowers your monthly health
                insurance premium based on your household income and family size.
                <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
              </div>
            </div>
          </h3>
        </div>

        {/* Savings Amount Card */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Your Premium Tax Credit:</span>
            <div className="flex items-center gap-1.5">
              {isCalculating ? (
                <span className="text-2xl font-bold text-gray-400 animate-pulse">Calculating...</span>
              ) : calculationError ? (
                <span className="text-2xl font-bold text-red-400">${displayedSavings}*</span>
              ) : propEstimatedSavings > 0 ? (
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ${displayedSavings}
                </span>
              ) : (
                <span className="text-2xl font-bold text-gray-600">$0</span>
              )}
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-end">
            <span>${(displayedSavings * 12).toLocaleString()}/year in total savings</span>
          </div>
          {calculationError && (
            <div className="mt-2 text-xs text-red-500 flex items-center justify-end">
              <AlertCircle size={12} className="mr-1" />
              <span>*Estimated value - {calculationError}</span>
            </div>
          )}
        </div>

        {/* Additional Benefits Card */}
        <div className="bg-white/80 rounded-lg p-4 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-start gap-2.5">
            <TrendingUp size={18} className="text-green-500 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-gray-700 text-sm leading-relaxed">
                You may also qualify for <span className="font-medium">Cost Sharing Reductions (CSRs)</span>, lowering
                your deductibles and copays with Silver plans.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                <span className="inline-block h-1 w-1 rounded-full bg-pink-500/60"></span>
                Final subsidies determined during enrollment based on available plans in your area
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

SavingsEstimateCard.displayName = "SavingsEstimateCard"

export default SavingsEstimateCard
