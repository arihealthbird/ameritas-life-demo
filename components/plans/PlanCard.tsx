"use client"

import type React from "react"
import { Star, Shield, TrendingUp, Clock, CheckCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LifeInsurancePlan } from "@/types/plans" // Use LifeInsurancePlan
import PlanCompareCheckbox from "./PlanCompareCheckbox"
import { cn } from "@/lib/utils"
import RankBadge from "./rank-explanations/RankBadge"

interface PlanCardProps {
  plan: LifeInsurancePlan
  isSelected: boolean
  onSelect: (planId: string) => void
  onEnroll: (planId: string) => void
  isComparing: boolean
  onToggleCompare: (planId: string) => void
  planType?: "health" | "life" // Added to differentiate styling/content if needed
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  onSelect,
  onEnroll,
  isComparing,
  onToggleCompare,
  planType = "life", // Default to life
}) => {
  const handleSelectAndScroll = () => {
    onSelect(plan.id)
    // Optional: scroll to top or to a specific section
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md border transition-all duration-300 hover:shadow-lg relative",
        isSelected ? "border-purple-500 ring-2 ring-purple-500" : "border-gray-200",
      )}
    >
      {plan.rank && (
        <div className="absolute top-3 right-3 z-10">
          <RankBadge rank={plan.rank} plan={plan as any} />{" "}
          {/* Cast plan for now if RankBadge expects health plan specifics */}
        </div>
      )}

      <div className="p-5">
        {/* Carrier and Rating */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              {/* Placeholder for Ameritas Logo or use initials */}
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">AM</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{plan.carrier}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">{plan.name}</p>
          </div>
          {plan.rating && (
            <div className="flex items-center text-xs text-gray-500 shrink-0">
              <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
              {plan.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Key Details */}
        <div className="space-y-3 my-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center">
              <Shield size={14} className="mr-1.5 text-purple-500" /> Death Benefit
            </span>
            <span className="text-base font-semibold text-gray-800">${plan.deathBenefit.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center">
              <DollarSign size={14} className="mr-1.5 text-green-500" /> Est. Monthly Premium
            </span>
            <span className="text-base font-semibold text-gray-800">${plan.premium.toLocaleString()}</span>
          </div>
          {plan.type === "Term" && plan.termLength && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1.5 text-blue-500" /> Term Length
              </span>
              <span className="text-base font-semibold text-gray-800">{plan.termLength} Years</span>
            </div>
          )}
          {plan.cashValueFeature && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center">
                <TrendingUp size={14} className="mr-1.5 text-pink-500" /> Cash Value
              </span>
              <span className="text-base font-semibold text-gray-800">
                <CheckCircle size={16} className="text-green-500" />
              </span>
            </div>
          )}
        </div>

        {/* Plan Type Badge */}
        <div className="mb-4">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full
            ${
              plan.type === "Term"
                ? "bg-blue-100 text-blue-700"
                : plan.type === "Whole"
                  ? "bg-green-100 text-green-700"
                  : plan.type === "Universal"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {plan.type} Life
          </span>
        </div>

        {/* Brief Description */}
        <p className="text-xs text-gray-500 mb-4 h-10 overflow-hidden">{plan.description}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSelectAndScroll}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEnroll(plan.id)}
            className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            Start Application
          </Button>
        </div>
      </div>

      {/* Compare Checkbox */}
      <div className="border-t border-gray-200 px-5 py-3">
        <PlanCompareCheckbox
          planId={plan.id}
          isChecked={isComparing}
          onToggleCompare={onToggleCompare}
          label="Compare this plan"
        />
      </div>
    </div>
  )
}

export default PlanCard
