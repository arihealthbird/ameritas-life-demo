"use client"
import type React from "react"
import { Shield, TrendingUp, Users, CreditCard, Heart, Calculator } from "lucide-react"

interface LifeInsuranceCoverageDisplayProps {
  recommendedCoverage: number
  isLoading?: boolean
  calculationBreakdown?: Record<string, number>
}

const LifeInsuranceCoverageDisplay: React.FC<LifeInsuranceCoverageDisplayProps> = ({
  recommendedCoverage,
  isLoading = false,
  calculationBreakdown,
}) => {
  // Enhanced formatting logic with proper validation and 5M+ handling
  const formatCoverage = (amount: number): string => {
    // Validate the input amount
    if (isNaN(amount) || typeof amount !== "number" || amount < 0) {
      return "$0"
    }

    // Handle amounts over 5 million
    if (amount >= 5000000) {
      return "$5.0M+"
    }

    // Handle amounts over 1 million but less than 5 million
    if (amount >= 1000000) {
      const millions = (amount / 1000000).toFixed(1)
      return `$${millions}M`
    }

    // Handle amounts over 1000 but less than 1 million
    if (amount >= 1000) {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    }

    // Handle smaller amounts
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const formatBreakdownAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  // Validation to ensure we have a proper coverage calculation
  const isValidCoverage = (amount: number): boolean => {
    return !isNaN(amount) && typeof amount === "number" && amount >= 0
  }

  // Determine if we should show loading state
  const shouldShowLoading = isLoading || !isValidCoverage(recommendedCoverage)

  const breakdownItems = calculationBreakdown
    ? [
        {
          icon: TrendingUp,
          label: "Income Protection",
          amount: calculationBreakdown.incomeReplacement || 0,
          description: "10 years of income replacement",
          color: "text-blue-600",
        },
        {
          icon: Users,
          label: "Children's Future",
          amount: calculationBreakdown.educationFund || 0,
          description: "Education and care expenses",
          color: "text-green-600",
        },
        {
          icon: CreditCard,
          label: "Debt Coverage",
          amount: calculationBreakdown.debtClearance || 0,
          description: "Outstanding debts and loans",
          color: "text-orange-600",
        },
        {
          icon: Heart,
          label: "Final Expenses",
          amount: calculationBreakdown.finalExpenses || 0,
          description: "Funeral and immediate costs",
          color: "text-purple-600",
        },
      ].filter((item) => item.amount > 0)
    : []

  if (shouldShowLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 shadow-sm">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Calculator className="h-6 w-6 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">Calculating Your Coverage...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-purple-200 rounded animate-pulse"></div>
          <div className="h-4 bg-purple-200 rounded animate-pulse w-3/4"></div>
          <div className="h-8 bg-purple-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50 shadow-sm transition-all duration-500 ease-in-out">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Your Estimated Coverage</h3>
          <p className="text-sm text-gray-600">Based on your current information</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2 transition-all duration-300">
          {formatCoverage(recommendedCoverage)}
        </div>
        <p className="text-sm text-gray-600">Recommended life insurance coverage</p>
      </div>

      {breakdownItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Coverage Breakdown:</h4>
          {breakdownItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/40"
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <div>
                  <div className="text-sm font-medium text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-600">{item.description}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-800">{formatBreakdownAmount(item.amount)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-white/40 rounded-lg border border-white/60">
        <p className="text-xs text-gray-600 text-center">
          💡 This is an estimate. Your actual coverage needs may vary based on additional factors we'll discuss.
        </p>
      </div>
    </div>
  )
}

export default LifeInsuranceCoverageDisplay
