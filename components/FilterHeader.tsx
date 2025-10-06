"use client"

import type React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterHeaderProps {
  expandedFilters: boolean
  setExpandedFilters: (expanded: boolean) => void
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ expandedFilters, setExpandedFilters }) => {
  return (
    <button
      onClick={() => setExpandedFilters(!expandedFilters)}
      className="w-full flex items-center justify-between p-4 text-left font-medium"
    >
      <div className="flex items-center">
        <span className="mr-2">🔍</span>
        <span>Filter Plans</span>
      </div>
      {expandedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  )
}

export default FilterHeader
