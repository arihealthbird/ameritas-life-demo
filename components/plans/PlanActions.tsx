"use client"
import type React from "react"
import { GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InsurancePlan } from "@/types/plans"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface PlanActionsProps {
  plan: InsurancePlan
  selectedPlan: string | null
  onSelectPlan: (planId: string) => void
  onEnrollPlan: (planId: string) => void
  sortOption: "matchScore" | string
  plansToCompare?: string[]
  onToggleCompare?: (planId: string) => void
}

const PlanActions: React.FC<PlanActionsProps> = ({
  plan,
  selectedPlan,
  onSelectPlan,
  onEnrollPlan,
  sortOption = "matchScore",
  plansToCompare = [],
  onToggleCompare,
}) => {
  const isMobile = useIsMobile()
  const router = useRouter()
  const isSelected = selectedPlan === plan.id
  const isCompared = plansToCompare.includes(plan.id)
  const [isEnrolling, setIsEnrolling] = useState(false)

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEnrolling(true)
    // Navigate to the account creation page with the plan ID
    router.push(`/enroll/create-account?planId=${plan.id}`)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Action buttons */}
      <div className="mt-auto space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="justify-center border-gray-300 text-gray-800 h-10" asChild>
            <Link href={`/plan-details/${plan.id}`}>Details</Link>
          </Button>

          <Button
            onClick={handleEnroll}
            className={cn(
              "justify-center bg-purple-600 hover:bg-purple-700 text-white h-10",
              isSelected || isEnrolling ? "opacity-70 cursor-not-allowed" : "",
            )}
            disabled={isSelected || isEnrolling}
          >
            {isEnrolling ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enrolling...
              </>
            ) : isSelected ? (
              "Selected"
            ) : (
              "Enroll"
            )}
          </Button>
        </div>

        {/* Compare button */}
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(plan.id)}
            className={`
              flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded border transition-all
              ${
                isCompared
                  ? "bg-purple-50 border-purple-200 text-purple-700"
                  : "bg-white border-gray-300 text-gray-600 hover:border-purple-200 hover:text-purple-600"
              }
            `}
          >
            <GitCompare size={14} />
            <span className="text-sm">{isCompared ? "Remove from comparison" : "Add to comparison"}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default PlanActions
