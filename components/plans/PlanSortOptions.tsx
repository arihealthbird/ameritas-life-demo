"use client"

import type React from "react"

import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface PlanSortOptionsProps {
  sortOption: string
  onSortChange: (option: string) => void
}

const PlanSortOptions: React.FC<PlanSortOptionsProps> = ({ sortOption, onSortChange }) => {
  const getSortLabel = (option: string) => {
    switch (option) {
      case "matchScore":
        return "Best Match"
      case "premium":
        return "Lowest Premium"
      case "deductible":
        return "Lowest Deductible"
      case "outOfPocketMax":
        return "Lowest Out-of-Pocket"
      case "rating":
        return "Highest Rating"
      default:
        return "Best Match"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-healthbird-gray-300 text-healthbird-gray-700">
          Sort: {getSortLabel(sortOption)}
          <ChevronDown size={16} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className={sortOption === "matchScore" ? "bg-healthbird-purple/10 text-healthbird-purple" : ""}
          onClick={() => onSortChange("matchScore")}
        >
          Best Match
        </DropdownMenuItem>
        <DropdownMenuItem
          className={sortOption === "premium" ? "bg-healthbird-purple/10 text-healthbird-purple" : ""}
          onClick={() => onSortChange("premium")}
        >
          Lowest Premium
        </DropdownMenuItem>
        <DropdownMenuItem
          className={sortOption === "deductible" ? "bg-healthbird-purple/10 text-healthbird-purple" : ""}
          onClick={() => onSortChange("deductible")}
        >
          Lowest Deductible
        </DropdownMenuItem>
        <DropdownMenuItem
          className={sortOption === "outOfPocketMax" ? "bg-healthbird-purple/10 text-healthbird-purple" : ""}
          onClick={() => onSortChange("outOfPocketMax")}
        >
          Lowest Out-of-Pocket
        </DropdownMenuItem>
        <DropdownMenuItem
          className={sortOption === "rating" ? "bg-healthbird-purple/10 text-healthbird-purple" : ""}
          onClick={() => onSortChange("rating")}
        >
          Highest Rating
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PlanSortOptions
