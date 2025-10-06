import type React from "react"
import type { FilterOptions } from "@/types/plans"
import { Checkbox } from "@/ui/checkbox"
import { Label } from "@/components/ui/label"
import { User, Pill } from "lucide-react"

interface CoverageFilterProps {
  filterOptions: FilterOptions
  handleFilterChange: (type: keyof FilterOptions, value: any) => void
  availableFilters: any
}

const CoverageFilter: React.FC<CoverageFilterProps> = ({ filterOptions, handleFilterChange, availableFilters }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Coverage</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="coversDoctors"
            checked={filterOptions.coversDoctors}
            onCheckedChange={(checked) => handleFilterChange("coversDoctors", !!checked)}
            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          />
          <Label htmlFor="coversDoctors" className="flex items-center cursor-pointer">
            <User size={16} className="mr-2 text-purple-600" />
            <span>Covers my doctors</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="coversMedications"
            checked={filterOptions.coversMedications}
            onCheckedChange={(checked) => handleFilterChange("coversMedications", !!checked)}
            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          />
          <Label htmlFor="coversMedications" className="flex items-center cursor-pointer">
            <Pill size={16} className="mr-2 text-purple-600" />
            <span>Covers my medications</span>
          </Label>
        </div>
      </div>
    </div>
  )
}

export default CoverageFilter
