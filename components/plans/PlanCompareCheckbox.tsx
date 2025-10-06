"use client"

import type React from "react"
import { Check, GitCompare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PlanCompareCheckboxProps {
  planId: string
  isSelected: boolean
  onToggle: (planId: string) => void
  className?: string
}

const PlanCompareCheckbox: React.FC<PlanCompareCheckboxProps> = ({ planId, isSelected, onToggle, className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onToggle(planId)}
            className={cn(
              "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border transition-all duration-200",
              isSelected
                ? "bg-healthbird-purple/10 border-healthbird-purple text-healthbird-purple"
                : "bg-white border-healthbird-gray-300 text-healthbird-gray-500 hover:border-healthbird-purple/50 hover:text-healthbird-purple/70",
              className,
            )}
            aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-xs font-medium">Compare</span>
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4" />
                <span className="text-xs font-medium">Compare</span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {isSelected ? "Remove from comparison" : "Add to comparison"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PlanCompareCheckbox
