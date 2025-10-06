"use client"
import { Slider } from "@/components/ui/slider"

interface RangeFilterProps {
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
}

export function RangeFilter({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  leftLabel = "Any",
  rightLabel,
  showDollarSign = false,
  showStars = false,
}: RangeFilterProps) {
  const formattedValue = formatValue ? formatValue(value) : value.toString()
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
          {rightLabel && (showDollarSign ? "Up to " : "") + finalDisplayValue}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span className="invisible"></span>
        <span className="invisible">
          {showDollarSign ? `${max.toLocaleString()}` : showStars ? `${max} Stars` : max.toString()}
        </span>
      </div>
    </div>
  )
}
