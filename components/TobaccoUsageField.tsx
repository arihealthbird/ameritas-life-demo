"use client"

import type React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TobaccoUsageFieldProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
  className?: string
  error?: boolean
}

export const TobaccoUsageField: React.FC<TobaccoUsageFieldProps> = ({
  id,
  label,
  value,
  onChange,
  className = "",
  error = false,
}) => {
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={cn("relative border rounded-md p-1", error ? "border-red-500" : "border-gray-200", className)}>
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
          <button
            type="button"
            onClick={() => handleSelect("yes")}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1",
              value === "yes" ? "bg-purple-100 text-purple-700" : "bg-transparent text-gray-700 hover:bg-gray-50",
            )}
          >
            <span className="flex items-center">
              {value === "yes" && <Check className="h-4 w-4 mr-2 flex-shrink-0" />}
              <span>Yes, I've used tobacco products in the last 6 months</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect("no")}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1",
              value === "no" ? "bg-purple-100 text-purple-700" : "bg-transparent text-gray-700 hover:bg-gray-50",
            )}
          >
            <span className="flex items-center">
              {value === "no" && <Check className="h-4 w-4 mr-2 flex-shrink-0" />}
              <span>No, I haven't used tobacco products in the last 6 months</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TobaccoUsageField
