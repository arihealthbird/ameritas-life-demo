"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Check, DollarSign, Shield, Clock, TrendingUp, User } from "lucide-react" // Updated icons
import { Button } from "@/components/ui/button"
import { mockLifePlans } from "@/data/mockPlans" // Use mockLifePlans
import type { LifeInsurancePlan } from "@/types/plans" // Use LifeInsurancePlan
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import PlanDetailsAccordions from "@/components/PlanDetailsAccordions" // This will be refactored
import { Star, HelpCircle } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
// EstimatedCostTab might not be directly applicable or needs heavy refactor for life insurance
// import { EstimatedCostTab } from "@/components/plans/EstimatedCostTab"
import RankBadge from "@/components/plans/rank-explanations/RankBadge"

export default function PlanDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params?.planId as string
  const [plan, setPlan] = useState<LifeInsurancePlan | null>(null)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (planId) {
      const foundPlan = mockLifePlans.find((p) => p.id === planId)
      if (foundPlan) {
        setPlan(foundPlan)
      } else {
        router.push("/plans") // Redirect to life plans page
      }
    }
  }, [planId, router])

  const handleBack = () => {
    router.push("/plans") // Redirect to life plans page
  }

  const handleEnroll = () => {
    setIsEnrolling(true)
    // Navigate to a life insurance application page
    router.push(`/enroll/life-insurance-application?planId=${planId}`)
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-600">Loading Ameritas plan details...</div>
      </div>
    )
  }

  const planTypeDisplay = {
    Term: { name: "Term Life", color: "bg-blue-100 text-blue-800" },
    Whole: { name: "Whole Life", color: "bg-green-100 text-green-800" },
    Universal: { name: "Universal Life", color: "bg-indigo-100 text-indigo-800" },
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to plan results</span>
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6 hover:shadow-lg transition-all duration-300 relative">
          {!isMobile && plan.rank && (
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-2">
                <RankBadge rank={plan.rank} plan={plan as any} /> {/* Cast for now */}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Plan Carrier Info & Type */}
            <div className="w-full md:w-1/4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100/70 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">AM</span> {/* Ameritas Initials */}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{plan.carrier}</h3>
                  {plan.rating && (
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={`${star <= Math.floor(plan.rating!) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                        />
                      ))}
                      <span className="text-xs ml-1">{plan.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${planTypeDisplay[plan.type]?.color || "bg-gray-100 text-gray-800"} inline-block`}
              >
                {planTypeDisplay[plan.type]?.name || plan.type}
              </div>
            </div>

            {/* Plan Key Details */}
            <div className="w-full md:w-1/2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Shield size={12} className="mr-1 text-purple-600" /> Death Benefit
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <HelpCircle size={12} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">The amount paid to beneficiaries upon the insured's death.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                  <p className="text-xl font-bold text-gray-900">${plan.deathBenefit.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <DollarSign size={12} className="mr-1 text-green-600" /> Est. Monthly Premium
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <HelpCircle size={12} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">The estimated amount you pay each month for this coverage.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                  <p className="text-xl font-bold text-gray-900">${plan.premium.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {plan.type === "Term" && plan.termLength && (
                  <div className="flex items-center">
                    <Clock size={14} className="text-blue-600 mr-1.5" />
                    <div>
                      <p className="text-xs text-gray-600">Term Length</p>
                      <p className="text-sm font-medium text-gray-900">{plan.termLength} Years</p>
                    </div>
                  </div>
                )}
                {plan.cashValueFeature && (
                  <div className="flex items-center">
                    <TrendingUp size={14} className="text-pink-600 mr-1.5" />
                    <div>
                      <p className="text-xs text-gray-600">Cash Value Growth</p>
                      <p className="text-sm font-medium text-green-600">Yes</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <User size={14} className="text-gray-600 mr-1.5" />
                  <div>
                    <p className="text-xs text-gray-600">Issue Ages</p>
                    <p className="text-sm font-medium text-gray-900">
                      {plan.issueAgeRange ? `${plan.issueAgeRange[0]}-${plan.issueAgeRange[1]}` : "Varies"}
                    </p>
                  </div>
                </div>
                {plan.guaranteedPremiums !== undefined && (
                  <div className="flex items-center">
                    <CheckCircle
                      size={14}
                      className={plan.guaranteedPremiums ? "text-green-600 mr-1.5" : "text-gray-400 mr-1.5"}
                    />
                    <div>
                      <p className="text-xs text-gray-600">Guaranteed Premiums</p>
                      <p className="text-sm font-medium text-gray-900">
                        {plan.guaranteedPremiums ? "Yes" : "Flexible/No"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Plan Actions */}
            <div className="w-full md:w-1/4 flex flex-col">
              {isMobile && plan.rank && (
                <div className="absolute top-3 right-3 z-10">
                  <RankBadge rank={plan.rank} plan={plan as any} /> {/* Cast for now */}
                </div>
              )}
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-gray-700">Personalized Match Score</div>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xl text-gray-900">{plan.matchScore || 80}%</div>{" "}
                  {/* Default if no matchScore */}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${plan.matchScore || 80}%` }}></div>
                </div>
                <div className="text-xs text-green-700 mt-1">
                  {plan.matchScore && plan.matchScore >= 80
                    ? "Good match for your needs"
                    : "Consider if this meets your needs"}
                </div>
              </div>
              <div className="space-y-2 mt-auto">
                <Button
                  onClick={handleEnroll}
                  className={cn(
                    "w-full justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white h-12",
                    isEnrolling ? "opacity-70 cursor-not-allowed" : "",
                  )}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Starting Application...
                    </>
                  ) : (
                    <>
                      {" "}
                      <Check className="w-4 h-4 mr-1" /> Start Application{" "}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Ameritas Plan Details</h2>
            <BirdyAIFloatingButton
              title="Ameritas Life Insurance Help"
              explanation="Get instant answers about this Ameritas plan, coverage details, and application process."
              tips={[
                "Explain cash value",
                "What are riders?",
                "How do beneficiaries work?",
                "Is this term convertible?",
              ]}
            />
          </div>
          {/* Pass 'life' type and the specific plan to PlanDetailsAccordions */}
          <PlanDetailsAccordions plan={plan} planType="life" />
        </div>

        {/* EstimatedCostTab might not be relevant or needs significant changes for life insurance */}
        {/* <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Premium Insights</h2>
          <EstimatedCostTab planId={params.planId} />
        </div> */}
      </div>
    </div>
  )
}
