"use client"

import type React from "react"
import { Checkbox } from "@/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { FilterOptions } from "@/types/plans"

interface CarrierFilterProps {
  filterOptions: FilterOptions
  handleFilterChange: (type: keyof FilterOptions, value: any) => void
  availableFilters: any
}

const CarrierFilter: React.FC<CarrierFilterProps> = ({ filterOptions, handleFilterChange, availableFilters }) => {
  const handleCarrierChange = (carrier: string) => {
    const updatedCarriers = filterOptions.carriers.includes(carrier)
      ? filterOptions.carriers.filter((c) => c !== carrier)
      : [...filterOptions.carriers, carrier]

    handleFilterChange("carriers", updatedCarriers)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Insurance Carrier</h3>
      <div className="space-y-2">
        {availableFilters.carriers?.map((carrier: string) => (
          <div key={carrier} className="flex items-center space-x-2">
            <Checkbox
              id={`carrier-${carrier}`}
              checked={filterOptions.carriers.includes(carrier)}
              onCheckedChange={() => handleCarrierChange(carrier)}
              className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label htmlFor={`carrier-${carrier}`} className="text-sm text-gray-700 cursor-pointer">
              {carrier}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarrierFilter
