"use client"

import type React from "react"
import { UserIcon as Male, UserIcon as Female } from "lucide-react"
import { cn } from "@/lib/utils"

interface GenderSelectionFieldProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
  className?: string
  error?: boolean
}

export const GenderSelectionField: React.FC<GenderSelectionFieldProps> = ({
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
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => handleSelect("male")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 border flex items-center justify-center",
              value === "male"
                ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                : "bg-transparent text-gray-700 hover:bg-gray-50 border-gray-300",
            )}
          >
            <span className="flex items-center justify-center">
              <Male className={cn("h-3 w-3 mr-1", value === "male" ? "text-white" : "text-gray-500")} />
              Male
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect("female")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 border flex items-center justify-center",
              value === "female"
                ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                : "bg-transparent text-gray-700 hover:bg-gray-50 border-gray-300",
            )}
          >
            <span className="flex items-center justify-center">
              <Female className={cn("h-3 w-3 mr-1", value === "female" ? "text-white" : "text-gray-500")} />
              Female
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenderSelectionField
