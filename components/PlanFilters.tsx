"use client"

import { useState, useCallback, memo } from "react"
import type React from "react"
import type { LifeFilterOptions } from "@/types/plans"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DebouncedRangeFilter } from "./debounced-range-filter"
import { motion } from "framer-motion"

interface PlanFiltersProps {
  expandedFilters: boolean
  setExpandedFilters: (expanded: boolean) => void
  filterOptions: LifeFilterOptions
  availableFilters: any
  handleFilterChange: (type: keyof LifeFilterOptions | "reset", value: any) => void
  familyMembers: any[]
  setFieldValue: any
  values: any
}

const PlanFilters: React.FC<PlanFiltersProps> = memo(
  ({ expandedFilters, setExpandedFilters, filterOptions, availableFilters, handleFilterChange }) => {
    const [isResetting, setIsResetting] = useState(false)

    const resetFilters = useCallback(async () => {
      setIsResetting(true)
      await new Promise((resolve) => setTimeout(resolve, 200))
      handleFilterChange("reset", null)
      setIsResetting(false)
    }, [handleFilterChange])

    const handlePlanTypeChange = useCallback(
      (type: "Term" | "Whole" | "Universal") => {
        const updatedTypes = filterOptions.planTypes.includes(type)
          ? filterOptions.planTypes.filter((t) => t !== type)
          : [...filterOptions.planTypes, type]
        handleFilterChange("planTypes", updatedTypes)
      },
      [filterOptions.planTypes, handleFilterChange],
    )

    const handleDeathBenefitRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("deathBenefitRange", [filterOptions.deathBenefitRange[0], value])
      },
      [handleFilterChange, filterOptions.deathBenefitRange],
    )

    const handlePremiumRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("premiumRange", [filterOptions.premiumRange[0], value])
      },
      [handleFilterChange, filterOptions.premiumRange],
    )

    const handleTermLengthRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("termLengthRange", [filterOptions.termLengthRange?.[0] || 5, value])
      },
      [handleFilterChange, filterOptions.termLengthRange],
    )

    const handleMinRatingChange = useCallback(
      (value: number) => {
        handleFilterChange("minRating", value)
      },
      [handleFilterChange],
    )

    const formatCurrency = useCallback((value: number) => {
      return value.toLocaleString()
    }, [])

    return (
      <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filter Header */}
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

        {expandedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-6">
              {/* Plan Type */}
              <motion.div
                className="space-y-3"
                animate={{ opacity: isResetting ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-medium text-gray-900 text-sm">Plan Type</h3>
                <div className="flex flex-wrap gap-2">
                  {(["Term", "Whole", "Universal"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePlanTypeChange(type)}
                      className={`px-3 py-1 text-xs rounded-full border ${
                        filterOptions.planTypes.includes(type)
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {type} Life
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Cash Value Filter */}
              <motion.div
                className="space-y-3"
                animate={{ opacity: isResetting ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-medium text-gray-900 text-sm">Features</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cashValue"
                    checked={filterOptions.cashValue}
                    onCheckedChange={(checked) => handleFilterChange("cashValue", !!checked)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded-full h-4 w-4"
                  />
                  <Label htmlFor="cashValue" className="text-sm cursor-pointer">
                    Cash Value Feature
                  </Label>
                </div>
              </motion.div>

              {/* Range Filters */}
              <motion.div
                className="space-y-1"
                animate={{ opacity: isResetting ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-medium text-gray-900 text-sm mb-2">Coverage & Cost</h3>

                <DebouncedRangeFilter
                  label="Death Benefit"
                  value={filterOptions.deathBenefitRange[1]}
                  min={availableFilters.deathBenefitRange?.[0] || 50000}
                  max={availableFilters.deathBenefitRange?.[1] || 2000000}
                  step={25000}
                  onChange={handleDeathBenefitRangeChange}
                  formatValue={formatCurrency}
                  showDollarSign={true}
                />

                <DebouncedRangeFilter
                  label="Monthly Premium"
                  value={filterOptions.premiumRange[1]}
                  min={availableFilters.premiumRange?.[0] || 10}
                  max={availableFilters.premiumRange?.[1] || 500}
                  step={5}
                  onChange={handlePremiumRangeChange}
                  formatValue={formatCurrency}
                  showDollarSign={true}
                />

                {filterOptions.termLengthRange && (
                  <DebouncedRangeFilter
                    label="Term Length (Years)"
                    value={filterOptions.termLengthRange[1]}
                    min={availableFilters.termLengthRange?.[0] || 5}
                    max={availableFilters.termLengthRange?.[1] || 30}
                    step={5}
                    onChange={handleTermLengthRangeChange}
                    formatValue={(value) => `${value} years`}
                  />
                )}

                <DebouncedRangeFilter
                  label="Minimum Rating"
                  value={filterOptions.minRating}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={handleMinRatingChange}
                  showStars={true}
                />
              </motion.div>

              {/* Reset Filters Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Reset Filters"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  },
)

PlanFilters.displayName = "PlanFilters"

export default PlanFilters
