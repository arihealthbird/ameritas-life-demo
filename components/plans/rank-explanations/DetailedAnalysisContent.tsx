import type React from "react"
import type { InsurancePlan } from "@/types/plans"
import { Check, CircleDot } from "lucide-react"

interface DetailedAnalysisContentProps {
  plan: InsurancePlan
}

const DetailedAnalysisContent: React.FC<DetailedAnalysisContentProps> = ({ plan }) => {
  const renderScore = (score: number | undefined) => {
    let bgColorClass = "bg-green-100"
    let textColorClass = "text-green-800"

    if (score && score <= 3) {
      bgColorClass = "bg-red-100"
      textColorClass = "text-red-800"
    } else if (score && score <= 7) {
      bgColorClass = "bg-amber-100"
      textColorClass = "text-amber-800"
    }

    return (
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center rounded-full w-10 h-10 text-lg font-semibold ${bgColorClass}`}
        >
          {score}
        </div>
        <span className="text-xs text-gray-500 mt-1">out of 10</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
        <div>
          <span className="block text-sm font-medium">Premium</span>
          <span className="block text-xl font-semibold">${plan.premium.toLocaleString()}</span>
        </div>
        {renderScore(9)}
      </div>
      <div className="bg-green-50 text-green-800 rounded-xl p-3 flex items-center justify-between border border-green-100">
        <span className="text-sm">Subsidy applied: $307 per month</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Maximum out-of-pocket</span>
            <span className="block text-xl font-semibold">${plan.outOfPocketMax.toLocaleString()}</span>
          </div>
          {renderScore(10)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Deductible</span>
            <span className="block text-xl font-semibold">${plan.deductible.toLocaleString()}</span>
          </div>
          {renderScore(6)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Primary Care Visit</span>
            <span className="block text-xl font-semibold">${plan.doctorVisitCopay?.toLocaleString()} copay</span>
          </div>
          {renderScore(8)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Specialty Care Visit</span>
            <span className="block text-xl font-semibold">${plan.specialistVisitCopay?.toLocaleString()} copay</span>
          </div>
          {renderScore(7)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Generic Medications</span>
            <span className="block text-xl font-semibold">$10 copay</span>
          </div>
          {renderScore(9)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Brand Medications</span>
            <span className="block text-xl font-semibold">$30 copay</span>
          </div>
          {renderScore(6)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Urgent Care Visit</span>
            <span className="block text-xl font-semibold">$50 copay</span>
          </div>
          {renderScore(5)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Emergency Room Visit</span>
            <span className="block text-xl font-semibold">$300 copay</span>
          </div>
          {renderScore(4)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Hospital Stay</span>
            <span className="block text-xl font-semibold">$250/day</span>
          </div>
          {renderScore(7)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Labor and Delivery</span>
            <span className="block text-xl font-semibold">$500 copay</span>
          </div>
          {renderScore(8)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Imaging (CT/PET/MRI)</span>
            <span className="block text-xl font-semibold">$100 copay</span>
          </div>
          {renderScore(7)}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium">Blood Work</span>
            <span className="block text-xl font-semibold">$15 copay</span>
          </div>
          {renderScore(9)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Network Type</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md uppercase font-medium">POS</span>
          </div>
          <div className="flex items-start">
            <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Standard network coverage based on plan type</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Metal Tier</span>
            <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-medium flex items-center">
              Gold <CircleDot className="h-3 w-3 ml-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Higher monthly premium but lower out-of-pocket costs</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Plan pays approximately 80% of costs, you pay 20%</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Good for people who need frequent medical care or have ongoing conditions
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 text-gray-800 rounded-xl p-4 border border-gray-100">
        <span className="font-medium block mb-1">How we rank plan benefits</span>
        <p className="text-sm">
          Each benefit is scored by comparing it to all other available plans in your area. Higher scores (shown on a
          scale of 1-10) indicate better coverage or value for that specific benefit compared to alternatives. This
          helps you identify which aspects of this plan stand out compared to alternatives.
        </p>
      </div>
    </div>
  )
}

export default DetailedAnalysisContent
