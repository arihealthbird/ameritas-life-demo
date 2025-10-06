"use client"

import type React from "react"
import { HelpCircle } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { InsurancePlan } from "@/types/plans"

interface PlanCostInfoProps {
  plan: InsurancePlan
}

const PlanCostInfo: React.FC<PlanCostInfoProps> = ({ plan }) => {
  // Calculate the original premium (price before subsidy)
  const originalPremium =
    plan.originalPremium || (plan.subsidy ? plan.premium + plan.subsidy : null) || Math.round(plan.premium * 1.2)

  // Calculate the premium to display (post-subsidy)
  const displayedPremium = plan.premium

  // Only show "was price" if there's a subsidy or originalPremium is explicitly set
  // and it's different from the current premium
  const showWasPrice = originalPremium > displayedPremium && (plan.subsidy > 0 || plan.originalPremium)

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {/* Monthly Premium */}
      <div>
        <div className="flex items-center mb-1">
          <span className="text-xs text-gray-500">Monthly Premium</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1 text-gray-400 hover:text-gray-600">
                  <HelpCircle size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">The fixed amount you pay each month for your health insurance coverage.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold text-gray-900">${displayedPremium}</p>
          {showWasPrice && (
            <div className="flex items-center">
              <p className="text-xs text-gray-400 line-through">was ${originalPremium}</p>
              <span className="ml-1 text-xs text-green-600">(${plan.subsidy} subsidy applied)</span>
            </div>
          )}
        </div>
      </div>

      {/* Annual Deductible */}
      <div>
        <div className="flex items-center mb-1">
          <span className="text-xs text-gray-500">Annual Deductible</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1 text-gray-400 hover:text-gray-600">
                  <HelpCircle size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  The amount you pay for covered healthcare services before your insurance plan starts to pay.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xl font-bold text-gray-900">${plan.deductible.toLocaleString()}</p>
      </div>

      {/* Doctor Visit */}
      <div className="flex items-center">
        <div className="mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 9V12L14 14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Doctor Visit</p>
          <p className="text-sm font-medium text-gray-900">${plan.doctorVisitCopay || 20} copay</p>
        </div>
      </div>

      {/* Specialist Visit */}
      <div className="flex items-center">
        <div className="mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M20 8V14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23 11H17" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Specialist Visit</p>
          <p className="text-sm font-medium text-gray-900">${plan.specialistVisitCopay || 35} copay</p>
        </div>
      </div>

      {/* Generic Drugs */}
      <div className="flex items-center">
        <div className="mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 14L15 8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 8.5L16 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M5 21L19 21C20.1046 21 21 20.1046 21 19L21 5C21 3.89543 20.1046 3 19 3L5 3C3.89543 3 3 3.89543 3 5L3 19C3 20.1046 3.89543 21 5 21Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Generic Drugs</p>
          <p className="text-sm font-medium text-gray-900">${plan.genericDrugCopay || 10} copay</p>
        </div>
      </div>

      {/* Out of Pocket Max */}
      <div className="flex items-center">
        <div className="mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Out of Pocket Max</p>
          <p className="text-sm font-medium text-gray-900">${plan.outOfPocketMax.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default PlanCostInfo
