"use client"

import type React from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PlanMetalBadgeProps {
  metalLevel: string
  planType?: string
}

const PlanMetalBadge: React.FC<PlanMetalBadgeProps> = ({ metalLevel, planType }) => {
  // Update the getMetalLevelStyles function to handle undefined or null metalLevel values
  const getMetalLevelStyles = (level: string | undefined) => {
    // If level is undefined or null, return a default style
    if (!level) return "bg-gray-100 text-gray-800"

    const lowerLevel = level.toLowerCase()

    if (lowerLevel === "gold") return "bg-yellow-100 text-yellow-800"
    if (lowerLevel === "silver") return "bg-gray-200 text-gray-800"
    if (lowerLevel === "bronze") return "bg-amber-100 text-amber-800"
    if (lowerLevel === "platinum") return "bg-gray-700 bg-opacity-20 text-gray-800"
    return "bg-blue-100 text-blue-800"
  }

  // Also update the getMetalLevelDescription function to handle undefined values
  const getMetalLevelDescription = (level: string | undefined) => {
    // If level is undefined or null, return a default description
    if (!level) return "Plan metal level information unavailable"

    const lowerLevel = level.toLowerCase()

    if (lowerLevel === "gold") return "Higher premiums but lower out-of-pocket costs"
    if (lowerLevel === "silver") return "Moderate premiums and out-of-pocket costs"
    if (lowerLevel === "bronze") return "Lower premiums but higher out-of-pocket costs"
    if (lowerLevel === "platinum") return "Highest premiums but lowest out-of-pocket costs"
    return "Special plan category with unique benefits"
  }

  // Update the JSX to conditionally render the metal level badge only if metalLevel exists
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getMetalLevelStyles(metalLevel))}>
              {metalLevel || "Unknown"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>{getMetalLevelDescription(metalLevel)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {planType && (
        <div className="flex items-center">
          <span className="text-xs text-healthbird-gray-600">{planType}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1 text-healthbird-gray-400 hover:text-healthbird-gray-600">
                  <Info size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>
                  {planType === "HMO"
                    ? "Health Maintenance Organization: Requires referrals for specialists and limits coverage to in-network providers."
                    : planType === "PPO"
                      ? "Preferred Provider Organization: More flexibility to see specialists and some out-of-network coverage."
                      : planType === "EPO"
                        ? "Exclusive Provider Organization: No coverage for out-of-network care except in emergencies."
                        : planType === "POS"
                          ? "Point of Service: Combines features of HMO and PPO plans."
                          : "This plan type has specific network and referral requirements."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}

export default PlanMetalBadge
