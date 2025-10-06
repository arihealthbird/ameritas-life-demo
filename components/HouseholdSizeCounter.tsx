"use client"

import type React from "react"
import { Minus, Plus, InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"

interface HouseholdSizeCounterProps {
  householdSize: number
  onIncrement: () => void
  onDecrement: () => void
  initialHouseholdSize?: number
}

const HouseholdSizeCounter: React.FC<HouseholdSizeCounterProps> = ({
  householdSize,
  onIncrement,
  onDecrement,
  initialHouseholdSize = 1,
}) => {
  // Determine if decrement should be disabled
  const isDecrementDisabled = householdSize <= initialHouseholdSize

  return (
    <div>
      <div className="flex items-center mb-1">
        <div className="flex items-center">
          <label htmlFor="householdSize" className="block text-sm font-medium text-gray-800">
            How many people, including yourself, will you claim on your 2025 tax return?
          </label>
          <div className="relative ml-2 group">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-help"
              aria-label="Help for household size"
            >
              <HelpCircle size={16} />
            </button>
            <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-lg py-2 px-3 w-64 bottom-full left-1/2 -translate-x-1/2 -translate-y-1 pointer-events-none">
              A household usually includes the tax filer, their spouse if they have one, and their tax dependents. Ask
              Birdy AI for more information.
              <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
            </div>
          </div>
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-help"
                aria-label="Help for household size"
              ></button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="max-w-[250px] z-50">
              <p>
                A household usually includes the tax filer, their spouse if they have one, and their tax dependents. Ask
                Birdy AI for more information.
              </p>
              {initialHouseholdSize > 1 && (
                <p className="mt-2 text-blue-600">
                  The minimum value is set to {initialHouseholdSize} based on the information you provided earlier.
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center mt-3">
        <button
          type="button"
          onClick={onDecrement}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
            "hover:shadow-md hover:opacity-90 active:scale-95",
            isDecrementDisabled ? "opacity-50 cursor-not-allowed" : "",
          )}
          disabled={isDecrementDisabled}
          aria-label="Decrease household size"
        >
          <Minus size={20} className="text-white" />
        </button>

        <div className="w-16 h-12 mx-2 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-lg font-medium shadow-sm">
          {householdSize}
        </div>

        <button
          type="button"
          onClick={onIncrement}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-r from-pink-500 to-pink-400 text-white",
            "hover:shadow-md hover:opacity-90 active:scale-95",
            householdSize >= 10 ? "opacity-50 cursor-not-allowed" : "",
          )}
          disabled={householdSize >= 10}
          aria-label="Increase household size"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {initialHouseholdSize > 1 && (
        <div className="mt-2 text-sm text-gray-600 flex items-center">
          <InfoCircle size={14} className="mr-1 text-blue-500" />
          <span>
            Based on your previous entries, your household includes at least {initialHouseholdSize}{" "}
            {initialHouseholdSize === 1 ? "person" : "people"}.
          </span>
        </div>
      )}
    </div>
  )
}

export default HouseholdSizeCounter
