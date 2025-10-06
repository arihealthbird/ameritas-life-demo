"use client"

import { useState, useCallback, memo } from "react"
import type React from "react"
import type { FilterOptions } from "@/types/plans"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, User, Pill } from "lucide-react"
import { Checkbox } from "@/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog-fullscreen"
import DoctorManagement from "@/components/DoctorManagement"
import MedicationManagement from "@/components/MedicationManagement"
import { DebouncedRangeFilter } from "./debounced-range-filter"

interface PlanFiltersProps {
  expandedFilters: boolean
  setExpandedFilters: (expanded: boolean) => void
  filterOptions: FilterOptions
  availableFilters: any
  handleFilterChange: (type: keyof FilterOptions, value: any) => void
}

// Use memo to prevent unnecessary re-renders
const PlanFilters: React.FC<PlanFiltersProps> = memo(
  ({ expandedFilters, setExpandedFilters, filterOptions, availableFilters, handleFilterChange }) => {
    const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false)
    const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)

    const resetFilters = useCallback(() => {
      handleFilterChange("reset", null)
    }, [handleFilterChange])

    const formatCurrency = useCallback((value: number) => {
      return value.toLocaleString()
    }, [])

    const handleDoctorFilterUpdate = useCallback((doctors: any) => {
      // Update the filter options with the selected doctors
      console.log("Selected doctors:", doctors)
      // In a real implementation, you would update the filter options here
    }, [])

    const handleMedicationFilterUpdate = useCallback((medications: any) => {
      // Update the filter options with the selected medications
      console.log("Selected medications:", medications)
      // In a real implementation, you would update the filter options here
    }, [])

    const handlePriceRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("priceRange", [availableFilters.priceRange?.[0] || 0, value])
      },
      [handleFilterChange, availableFilters.priceRange],
    )

    const handleDeductibleRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("deductibleRange", [availableFilters.deductibleRange?.[0] || 0, value])
      },
      [handleFilterChange, availableFilters.deductibleRange],
    )

    const handleOutOfPocketMaxRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("outOfPocketMaxRange", [availableFilters.outOfPocketMaxRange?.[0] || 0, value])
      },
      [handleFilterChange, availableFilters.outOfPocketMaxRange],
    )

    const handleAnnualCostRangeChange = useCallback(
      (value: number) => {
        handleFilterChange("annualCostRange", [availableFilters.annualCostRange?.[0] || 0, value])
      },
      [handleFilterChange, availableFilters.annualCostRange],
    )

    const handleMinRatingChange = useCallback(
      (value: number) => {
        handleFilterChange("minRating", value)
      },
      [handleFilterChange],
    )

    const handleCarrierChange = useCallback(
      (carrier: string) => {
        const updatedCarriers = filterOptions.carriers.includes(carrier)
          ? filterOptions.carriers.filter((c) => c !== carrier)
          : [...filterOptions.carriers, carrier]
        handleFilterChange("carriers", updatedCarriers)
      },
      [filterOptions.carriers, handleFilterChange],
    )

    const handlePlanTypeChange = useCallback(
      (type: string) => {
        const updatedTypes = filterOptions.planTypes.includes(type)
          ? filterOptions.planTypes.filter((t) => t !== type)
          : [...filterOptions.planTypes, type]
        handleFilterChange("planTypes", updatedTypes)
      },
      [filterOptions.planTypes, handleFilterChange],
    )

    const handleMetalLevelChange = useCallback(
      (level: string) => {
        const updatedLevels = filterOptions.metalLevels.includes(level)
          ? filterOptions.metalLevels.filter((l) => l !== level)
          : [...filterOptions.metalLevels, level]
        handleFilterChange("metalLevels", updatedLevels)
      },
      [filterOptions.metalLevels, handleFilterChange],
    )

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
          <div className="p-4 space-y-6">
            {/* Coverage Section */}
            <div className="space-y-3 bg-gray-100 p-3 rounded-lg">
              <h3 className="font-medium text-gray-900 text-sm">Coverage</h3>

              {/* Doctor Management Button */}
              <Button
                variant="outline"
                className="w-full justify-start bg-white border-gray-200 hover:bg-gray-50"
                onClick={() => setIsDoctorDialogOpen(true)}
              >
                <User className="h-4 w-4 mr-2 text-gray-500" />
                My Doctors
              </Button>

              {/* Medication Management Button */}
              <Button
                variant="outline"
                className="w-full justify-start bg-white border-gray-200 hover:bg-gray-50"
                onClick={() => setIsMedicationDialogOpen(true)}
              >
                <Pill className="h-4 w-4 mr-2 text-gray-500" />
                My Medications
              </Button>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="coversDoctors"
                    checked={filterOptions.coversDoctors}
                    onCheckedChange={(checked) => handleFilterChange("coversDoctors", !!checked)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded-full h-4 w-4"
                  />
                  <Label htmlFor="coversDoctors" className="text-sm cursor-pointer">
                    Covers my doctors
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="coversMedications"
                    checked={filterOptions.coversMedications}
                    onCheckedChange={(checked) => handleFilterChange("coversMedications", !!checked)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded-full h-4 w-4"
                  />
                  <Label htmlFor="coversMedications" className="text-sm cursor-pointer">
                    Covers my medications
                  </Label>
                </div>
              </div>
            </div>

            {/* Insurance Carrier */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">Insurance Carrier</h3>
              <div className="space-y-2">
                {availableFilters.carriers?.map((carrier: string) => (
                  <div key={carrier} className="flex items-center space-x-2">
                    <Checkbox
                      id={`carrier-${carrier}`}
                      checked={filterOptions.carriers.includes(carrier)}
                      onCheckedChange={() => handleCarrierChange(carrier)}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded-full h-4 w-4"
                    />
                    <Label htmlFor={`carrier-${carrier}`} className="text-sm cursor-pointer">
                      {carrier}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Type */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">Plan Type</h3>
              <div className="flex flex-wrap gap-2">
                {["HMO", "EPO", "PPO", "POS"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handlePlanTypeChange(type)}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filterOptions.planTypes.includes(type)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Level */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">Metal Level</h3>
              <div className="flex flex-wrap gap-2">
                {["Catastrophic", "Bronze", "Expanded Bronze", "Silver", "Gold", "Platinum"].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleMetalLevelChange(level)}
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

            {/* Range Filters - Using the new DebouncedRangeFilter component */}
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 text-sm mb-2">Price & Coverage</h3>

              <DebouncedRangeFilter
                label="Monthly Premium"
                value={filterOptions.priceRange[1]}
                min={availableFilters.priceRange?.[0] || 0}
                max={availableFilters.priceRange?.[1] || 2000}
                step={10}
                onChange={handlePriceRangeChange}
                formatValue={formatCurrency}
                showDollarSign={true}
              />

              <DebouncedRangeFilter
                label="Annual Deductible"
                value={filterOptions.deductibleRange[1]}
                min={availableFilters.deductibleRange?.[0] || 0}
                max={availableFilters.deductibleRange?.[1] || 10000}
                step={100}
                onChange={handleDeductibleRangeChange}
                formatValue={formatCurrency}
                showDollarSign={true}
              />

              <DebouncedRangeFilter
                label="Out-of-Pocket Maximum"
                value={filterOptions.outOfPocketMaxRange[1]}
                min={availableFilters.outOfPocketMaxRange?.[0] || 0}
                max={availableFilters.outOfPocketMaxRange?.[1] || 10000}
                step={100}
                onChange={handleOutOfPocketMaxRangeChange}
                formatValue={formatCurrency}
                showDollarSign={true}
              />

              <DebouncedRangeFilter
                label="Annual Cost"
                value={filterOptions.annualCostRange[1]}
                min={availableFilters.annualCostRange?.[0] || 0}
                max={availableFilters.annualCostRange?.[1] || 20000}
                step={100}
                onChange={handleAnnualCostRangeChange}
                formatValue={formatCurrency}
                showDollarSign={true}
              />

              <DebouncedRangeFilter
                label="Minimum Rating"
                value={filterOptions.minRating}
                min={0}
                max={5}
                step={0.5}
                onChange={handleMinRatingChange}
                showStars={true}
              />
            </div>

            {/* Reset Filters Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Doctor Management Dialog */}
        <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
          <DialogContent className="max-w-3xl p-0">
            <DialogHeader>
              <DialogTitle>Manage Your Doctors</DialogTitle>
            </DialogHeader>
            <DoctorManagement onClose={() => setIsDoctorDialogOpen(false)} onFilterUpdate={handleDoctorFilterUpdate} />
          </DialogContent>
        </Dialog>

        {/* Medication Management Dialog */}
        <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
          <DialogContent className="max-w-3xl p-0">
            <DialogHeader>
              <DialogTitle>Manage Your Medications</DialogTitle>
            </DialogHeader>
            <MedicationManagement
              onClose={() => setIsMedicationDialogOpen(false)}
              onFilterUpdate={handleMedicationFilterUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  },
)

// Add display name for debugging
PlanFilters.displayName = "PlanFilters"

export default PlanFilters
