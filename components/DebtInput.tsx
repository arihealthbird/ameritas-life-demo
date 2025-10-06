"use client"

import type React from "react"
import { Slider } from "@/components/ui/slider"
import { HelpCircle } from "lucide-react"

interface DebtInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  tooltipText: string
}

const DebtInput: React.FC<DebtInputProps> = ({ value, onChange, label, tooltipText }) => {
  const handleSliderChange = (newValues: number[]) => {
    onChange(newValues[0])
  }

  const formatDisplayValue = (num: number) => {
    if (num >= 5000000) {
      return "$5.0M+" // Show $5.0M+ at the max value
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`
    }
    return `$${num}`
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center">
        <label htmlFor="debtAmount" className="block text-sm font-medium text-gray-800">
          {label}
        </label>
        <div className="relative ml-1.5 group flex items-center">
          <HelpCircle size={16} className="text-gray-500 cursor-help" />
          <div
            className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
                         bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-64 
                         bottom-full left-0 mb-2 pointer-events-none shadow-lg"
          >
            {tooltipText}
            <div className="absolute w-2.5 h-2.5 bg-gray-900 transform rotate-45 left-3 -bottom-1"></div>
          </div>
        </div>
      </div>

      <div className="py-4 text-left">
        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 tracking-tight">
          {formatDisplayValue(value)}
        </span>
      </div>

      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={0}
        max={5000000}
        step={10000}
        className="w-full [&>span:first-child]:h-2.5 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-purple-400 [&>span:first-child]:to-pink-400 rounded-full"
        thumbClassName="[&>span]:bg-gradient-to-br [&>span]:from-pink-500 [&>span]:to-purple-600 [&>span]:h-6 [&>span]:w-6 [&>span]:border-2 [&>span]:border-white [&>span]:shadow-lg focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
        aria-label="Debt amount slider"
      />
      <div className="flex justify-between text-xs text-gray-600 px-1">
        <span>$0</span>
        <span>5M+</span>
      </div>
    </div>
  )
}

export default DebtInput
