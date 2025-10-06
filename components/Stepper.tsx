"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Step = {
  id: string
  name: string
}

interface StepperProps {
  steps: Step[]
  currentStep: string
  className?: string
  visibleSteps?: number
}

export function Stepper({ steps, currentStep, className, visibleSteps = 3 }: StepperProps) {
  // Find the index of the current step
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  // Calculate which steps should be visible
  // We want to show the current step in the middle when possible
  let startIndex = Math.max(0, currentIndex - Math.floor(visibleSteps / 2))

  // Adjust if we're near the beginning
  if (currentIndex < Math.floor(visibleSteps / 2)) {
    startIndex = 0
  }

  // Adjust if we're near the end
  if (currentIndex > steps.length - Math.ceil(visibleSteps / 2)) {
    startIndex = Math.max(0, steps.length - visibleSteps)
  }

  // Calculate the end index
  const endIndex = Math.min(startIndex + visibleSteps, steps.length)

  // Get the visible steps
  const visibleStepsArray = steps.slice(startIndex, endIndex)

  // Calculate if there are more steps before or after
  const hasMoreBefore = startIndex > 0
  const hasMoreAfter = endIndex < steps.length

  // Define consistent colors
  const currentStepColor = "bg-pink-500" // Solid pink color for current step
  const completedStepGradient = "bg-gradient-to-r from-purple-600 to-pink-500"
  const currentStepTextColor = "text-pink-500"

  return (
    <div className={cn("w-full py-4 px-2", className)}>
      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-center relative">
        {/* More steps indicator (before) */}
        {hasMoreBefore && (
          <div className="absolute left-0 flex items-center">
            <div className="flex space-x-1">
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}

        {/* Visible steps */}
        <div className="flex items-center justify-center space-x-16 relative">
          {visibleStepsArray.map((step, index) => {
            const stepIndex = startIndex + index
            const isActive = step.id === currentStep
            const isCompleted = currentIndex > stepIndex
            const isFuture = currentIndex < stepIndex

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center relative transition-all duration-300 group",
                  isActive ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-50",
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 z-10 transition-all duration-300",
                    isActive
                      ? `${currentStepColor} text-white border-transparent scale-110 shadow-md relative`
                      : isCompleted
                        ? `${completedStepGradient} text-white border-transparent group-hover:opacity-90`
                        : "bg-white text-gray-400 border-gray-300 group-hover:border-gray-400",
                  )}
                >
                  {isActive && (
                    <span className="absolute w-full h-full rounded-full animate-ping bg-pink-500 opacity-30"></span>
                  )}
                  {isCompleted ? <Check className="h-5 w-5 text-white" /> : <span>{stepIndex + 1}</span>}
                </div>

                {/* Step name */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span
                    className={cn(
                      "text-xs font-medium transition-all duration-300",
                      isActive
                        ? currentStepTextColor
                        : isCompleted
                          ? "text-gray-600 group-hover:text-gray-800"
                          : "text-gray-400 group-hover:text-gray-600",
                      isActive && "font-semibold",
                    )}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connector line to next step */}
                {index < visibleStepsArray.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-16 absolute top-5 left-10",
                      stepIndex < currentIndex
                        ? completedStepGradient
                        : stepIndex === currentIndex
                          ? "bg-gradient-to-r from-pink-500 to-gray-300"
                          : "bg-gray-200",
                      stepIndex < currentIndex ? "opacity-60" : stepIndex > currentIndex ? "opacity-50" : "opacity-100",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* More steps indicator (after) */}
        {hasMoreAfter && (
          <div className="absolute right-0 flex items-center">
            <div className="flex space-x-1">
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center mb-2 relative">
          {/* More steps indicator (before) - Mobile */}
          {hasMoreBefore && (
            <div className="absolute left-0 flex items-center">
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              </div>
            </div>
          )}

          {/* Visible steps - Mobile */}
          <div className="flex items-center justify-center space-x-10 relative">
            {visibleStepsArray.map((step, index) => {
              const stepIndex = startIndex + index
              const isActive = step.id === currentStep
              const isCompleted = currentIndex > stepIndex
              const isFuture = currentIndex < stepIndex

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center relative transition-all duration-300 group",
                    isActive ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-50",
                  )}
                >
                  {/* Step circle */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 z-10 transition-all duration-300",
                      isActive
                        ? `${currentStepColor} text-white border-transparent scale-110 shadow-sm relative`
                        : isCompleted
                          ? `${completedStepGradient} text-white border-transparent group-hover:opacity-90`
                          : "bg-white text-gray-400 border-gray-300 group-hover:border-gray-400",
                    )}
                  >
                    {isActive && (
                      <span className="absolute w-full h-full rounded-full animate-ping bg-pink-500 opacity-30"></span>
                    )}
                    {isCompleted ? <Check className="h-3 w-3 text-white" /> : <span>{stepIndex + 1}</span>}
                  </div>

                  {/* Connector line to next step - Mobile */}
                  {index < visibleStepsArray.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-10 absolute top-3.5 left-7",
                        stepIndex < currentIndex
                          ? completedStepGradient
                          : stepIndex === currentIndex
                            ? "bg-gradient-to-r from-pink-500 to-gray-300"
                            : "bg-gray-200",
                        stepIndex < currentIndex
                          ? "opacity-60"
                          : stepIndex > currentIndex
                            ? "opacity-50"
                            : "opacity-100",
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* More steps indicator (after) - Mobile */}
          {hasMoreAfter && (
            <div className="absolute right-0 flex items-center">
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Current step name for mobile */}
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-pink-500">
            {steps.find((step) => step.id === currentStep)?.name || ""}
          </span>
        </div>
      </div>
    </div>
  )
}
