"use client"

import { useState, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { useDebounce } from "@/hooks/use-debounce"

interface DebouncedRangeFilterProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  leftLabel?: string
  rightLabel?: string
  showDollarSign?: boolean
  showStars?: boolean
  debounceMs?: number
}

export function DebouncedRangeFilter({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (val) => val.toString(),
  leftLabel = "Any",
  rightLabel,
  showDollarSign = false,
  showStars = false,
  debounceMs = 300,
}: DebouncedRangeFilterProps) {
  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(value)

  // Debounced value for actual filter application
  const debouncedValue = useDebounce(localValue, debounceMs)

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Apply the filter when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  // Handle slider change
  const handleSliderChange = useCallback((values: number[]) => {
    setLocalValue(values[0])
  }, [])

  const formattedValue = formatValue(localValue)
  const displayValue = rightLabel || (showDollarSign ? `${formattedValue}` : formattedValue)
  const finalDisplayValue = showStars ? `${displayValue} Stars` : displayValue

  return (
    <div className="py-3 border-b border-gray-200 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {showDollarSign && <span className="text-gray-500 mr-1">$</span>}
          <span className="text-sm text-gray-900">{label}</span>
        </div>
        <span className="text-xs text-gray-500">
          {localValue === max ? leftLabel : (showDollarSign ? "Up to " : "") + finalDisplayValue}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[localValue]}
        onValueChange={handleSliderChange}
        className="py-2"
      />
    </div>
  )
}
