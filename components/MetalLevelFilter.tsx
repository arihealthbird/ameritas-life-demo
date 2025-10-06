"use client"

import type React from "react"
import type { FilterOptions } from "@/types/plans"

interface MetalLevelFilterProps {
  filterOptions: FilterOptions
  handleFilterChange: (type: keyof FilterOptions, value: any) => void
  availableFilters: any
}

const MetalLevelFilter: React.FC<MetalLevelFilterProps> = ({ filterOptions, handleFilterChange, availableFilters }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900 text-sm">Metal Level</h3>
      <div className="flex flex-wrap gap-2">
        {["Catastrophic", "Bronze", "Expanded Bronze", "Silver", "Gold", "Platinum"].map((level) => (
          <button
            key={level}
            onClick={() => {
              const updatedLevels = filterOptions.metalLevels.includes(level)
                ? filterOptions.metalLevels.filter((l) => l !== level)
                : [...filterOptions.metalLevels, level]
              handleFilterChange("metalLevels", updatedLevels)
            }}
            className={`px-3 py-1 text-xs rounded-full border ${
              filterOptions.metalLevels.includes(level)
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MetalLevelFilter
