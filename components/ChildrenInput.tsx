"use client"

import type React from "react"
import { Minus, Plus, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChildrenInputProps {
  count: number
  onIncrement: () => void
  onDecrement: () => void
  label: string
  tooltipText: string
}

const ChildrenInput: React.FC<ChildrenInputProps> = ({ count, onIncrement, onDecrement, label, tooltipText }) => {
  return (
    <div>
      <div className="flex items-center mb-1">
        <label htmlFor="childrenCount" className="block text-sm font-medium text-gray-800">
          {label}
        </label>
        <div className="relative ml-1.5 group flex items-center">
          <HelpCircle size={16} className="text-gray-500 cursor-help" />
          <div
            className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
                       bg-gray-800 text-white text-xs rounded-lg py-2 px-3 w-56 
                       bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none shadow-lg"
          >
            {tooltipText}
            <div className="absolute w-2.5 h-2.5 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-3">
        <button
          type="button"
          onClick={onDecrement}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
            "hover:shadow-md hover:opacity-90 active:scale-95",
            count === 0 ? "opacity-50 cursor-not-allowed" : "",
          )}
          disabled={count === 0}
          aria-label="Decrease children count"
        >
          <Minus size={20} className="text-white" />
        </button>

        <div className="w-16 h-12 mx-2 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-lg font-medium shadow-sm">
          {count}
        </div>

        <button
          type="button"
          onClick={onIncrement}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-r from-pink-500 to-pink-400 text-white",
            "hover:shadow-md hover:opacity-90 active:scale-95",
            count >= 10 ? "opacity-50 cursor-not-allowed" : "",
          )}
          disabled={count >= 10}
          aria-label="Increase children count"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default ChildrenInput
