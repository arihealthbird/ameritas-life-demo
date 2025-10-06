"use client"

import type React from "react"
import type { LifeInsurancePlan } from "@/types/plans"
import { Star, AlertCircle, Info } from "lucide-react"

interface CategoryComparisonTableProps {
  plan: LifeInsurancePlan
}

const CategoryComparisonTable: React.FC<CategoryComparisonTableProps> = ({ plan }) => {
  // Calculate average and worst plan values (simulated data)
  const averagePremium = plan.premium + 70
  const worstPremium = plan.premium + 230

  const averageAnnualCost = (plan.premium + 70) * 12
  const worstAnnualCost = (plan.premium + 230) * 12

  // Helper to render colored difference text
  const renderDifference = (amount: number, isPriceDifference = true) => {
    const isPositive = isPriceDifference ? amount > 0 : amount < 0
    const color = isPositive ? "text-red-500" : "text-green-500"
    const prefix = isPriceDifference ? (amount > 0 ? "+" : "") : amount > 0 ? "" : "-"

    return (
      <span className={`${color} text-sm`}>
        {isPriceDifference
          ? prefix + "$" + Math.abs(amount).toFixed(2)
          : prefix + Math.abs(amount).toFixed(1) + " points"}
      </span>
    )
  }

  // Helper to render stars
  const renderStars = (rating: number, maxRating = 5) => {
    return (
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : i < rating
                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                  : "text-gray-300"
            }
          />
        ))}
      </div>
    )
  }

  // Helper to render value tag
  const renderValueTag = (text: string, type: "positive" | "neutral" | "negative") => {
    const bgColor =
      type === "positive"
        ? "bg-green-100 text-green-800"
        : type === "negative"
          ? "bg-red-100 text-red-800"
          : "bg-amber-100 text-amber-800"

    return <span className={`text-xs px-2 py-1 rounded-full ${bgColor}`}>{text}</span>
  }

  return (
    <div className="space-y-6">
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold mb-4">Category Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-1/4 py-3 text-left text-gray-700">Metric</th>
                <th className="w-1/4 py-3 text-left text-gray-700">This Plan</th>
                <th className="w-1/4 py-3 text-left text-gray-700">Average Plan</th>
                <th className="w-1/4 py-3 text-left text-gray-700">Worst Plan</th>
              </tr>
            </thead>
            <tbody>
              {/* Estimated Annual Cost */}
              <tr className="border-b border-gray-200">
                <td className="py-4">
                  <div className="font-medium">Annual Premium Cost</div>
                  <div className="text-sm text-gray-500">Lower is better</div>
                </td>
                <td className="py-4">
                  <div className="font-bold text-lg">${(plan.premium * 12).toLocaleString()}</div>
                  <div className="mt-1">{renderValueTag("Best Value", "positive")}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${averageAnnualCost.toLocaleString()}</div>
                  <div className="mt-1">{renderDifference(1656)}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${worstAnnualCost.toLocaleString()}</div>
                  <div className="mt-1">{renderDifference(4416)}</div>
                </td>
              </tr>

              {/* Monthly Premium */}
              <tr className="border-b border-gray-200">
                <td className="py-4">
                  <div className="font-medium">Monthly Premium</div>
                  <div className="text-sm text-gray-500">Lower is better</div>
                </td>
                <td className="py-4">
                  <div className="font-bold text-lg">${plan.premium.toLocaleString()}</div>
                  <div className="mt-1">{renderValueTag("Best Value", "positive")}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${averagePremium.toLocaleString()}</div>
                  <div className="mt-1">{renderDifference(70)}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${worstPremium.toLocaleString()}</div>
                  <div className="mt-1">{renderDifference(230)}</div>
                </td>
              </tr>

              {/* Key Benefits */}
              <tr className="border-b border-gray-200">
                <td className="py-4">
                  <div className="font-medium">Death Benefit Coverage</div>
                  <div className="text-sm text-gray-500">Higher is better</div>
                </td>
                <td className="py-4">
                  <div className="font-bold text-lg">${plan.deathBenefit.toLocaleString()}</div>
                  {/* <div className="mt-1">{renderValueTag("Best Coverage", "positive")}</div> */}
                </td>
                <td className="py-4">
                  <div className="font-medium">${(plan.deathBenefit * 0.75).toLocaleString()}</div>
                  {/* <div className="mt-1">{renderDifference(-1.5, false)}</div> */}
                </td>
                <td className="py-4">
                  <div className="font-medium">${(plan.deathBenefit * 0.5).toLocaleString()}</div>
                  {/* <div className="mt-1">{renderDifference(-4.5, false)}</div> */}
                </td>
              </tr>

              {/* Satisfaction */}
              <tr>
                <td className="py-4">
                  <div className="font-medium">Plan Rating</div>
                  <div className="text-sm text-gray-500">Higher is better</div>
                </td>
                <td className="py-4">
                  <div className="mb-1">{renderStars(plan.rating || 4.5)}</div>
                  {/* <div className="mt-1">{renderValueTag("Highest Rated", "positive")}</div> */}
                </td>
                <td className="py-4">
                  <div className="mb-1">{renderStars(3.5)}</div>
                  {/* <div className="mt-1">{renderDifference(-1, false)} stars</div> */}
                </td>
                <td className="py-4">
                  <div className="mb-1">{renderStars(2.5)}</div>
                  {/* <div className="mt-1">{renderDifference(-2, false)} stars</div> */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold mb-4">Key Factors</h4>
        <div className="space-y-3">
          <KeyFactorItem
            title="Premium Affordability"
            description={`Annual premium cost of ${(plan.premium * 12).toLocaleString()} relative to your income`}
            impact="High Impact"
            type="negative"
          />
          <KeyFactorItem
            title="Death Benefit Amount"
            description={`Death benefit of ${plan.deathBenefit} provides financial security for your beneficiaries`}
            impact="High Impact"
            type="positive"
          />
          <KeyFactorItem
            title="Cash Value Features"
            description="Policy accumulates cash value over time"
            impact="Medium Impact"
            type="positive"
          />
          <KeyFactorItem
            title="Term Length"
            description="20-year term provides coverage for a specific period"
            impact="Medium Impact"
            type="neutral"
          />
          <KeyFactorItem
            title="Carrier Reputation"
            description="Company has a strong financial rating and customer service record"
            impact="High Impact"
            type="positive"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold mb-4">Customer Satisfaction</h4>
        <p className="text-sm text-gray-600 mb-4">How this plan compares to the market</p>

        <div className="space-y-2">
          <SatisfactionBar label="This Plan" rating={4} />
          <SatisfactionBar label="Industry Average" rating={4} />
          <SatisfactionBar label="Worst Plan" rating={2} />
        </div>

        <div className="mt-6 space-y-4">
          <ReviewItem
            category="Claims Processing"
            description="Members rate the efficiency of claims processing."
            rating={4}
          />
          <ReviewItem
            category="Customer Service"
            description="Members report their experiences with customer service representatives."
            rating={4}
          />
          <ReviewItem
            category="Policy Administration"
            description="Members evaluate how efficiently policy changes and administrative tasks are handled."
            rating={4}
          />
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm text-gray-500 flex items-start">
          <Info className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>
            About Customer Satisfaction Ratings: These ratings are based on surveys from actual plan members and reflect
            their experiences with the plan over the past year. Higher ratings indicate greater member satisfaction.
          </span>
        </div>
      </div>
    </div>
  )
}

interface KeyFactorItemProps {
  title: string
  description: string
  impact: "High Impact" | "Medium Impact"
  type: "positive" | "negative" | "neutral"
}

function KeyFactorItem({ title, description, impact, type }: KeyFactorItemProps) {
  let icon = null
  let bgColor = "bg-green-50"
  let textColor = "text-green-700"

  if (type === "negative") {
    icon = <AlertCircle className="h-4 w-4 text-red-500" />
    bgColor = "bg-red-50"
    textColor = "text-red-700"
  }

  if (type === "neutral") {
    icon = <AlertCircle className="h-4 w-4 text-amber-500" />
    bgColor = "bg-amber-50"
    textColor = "text-amber-700"
  }

  return (
    <div className={`flex items-start justify-between p-3 rounded-lg ${bgColor}`}>
      <div className="flex items-start gap-2">
        {icon}
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className={`text-xs font-medium ${textColor}`}>{impact}</div>
    </div>
  )
}

interface SatisfactionBarProps {
  label: string
  rating: number
}

function SatisfactionBar({ label, rating }: SatisfactionBarProps) {
  const percentage = (rating / 5) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <span className="text-sm text-gray-500">{rating}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

interface ReviewItemProps {
  category: string
  description: string
  rating: number
}

function ReviewItem({ category, description, rating }: ReviewItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-700">{category}</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="text-sm text-gray-500 ml-1">{rating}.0</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}

export default CategoryComparisonTable
