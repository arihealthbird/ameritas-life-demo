"use client"

import { useState } from "react"

interface SubsidyParams {
  income: number
  householdSize: number
  frequency: "annually" | "monthly" | "biweekly" | "weekly"
}

interface SubsidyResult {
  monthlySubsidy: number
  annualSubsidy: number
  error?: string
}

export function useSubsidyCalculator() {
  const [loading, setLoading] = useState(false)

  const calculateSubsidyWithDefaults = async (params: SubsidyParams): Promise<SubsidyResult> => {
    setLoading(true)

    try {
      // Convert income to annual if needed
      let annualIncome = params.income
      if (params.frequency === "monthly") {
        annualIncome = params.income * 12
      } else if (params.frequency === "biweekly") {
        annualIncome = params.income * 26
      } else if (params.frequency === "weekly") {
        annualIncome = params.income * 52
      }

      // Simple mock calculation for demo purposes
      // In a real app, this would be a more complex calculation based on FPL guidelines
      const baseSubsidy = 300
      const sizeMultiplier = params.householdSize * 50
      const incomeReduction = Math.floor(annualIncome / 10000) * 30

      const monthlySubsidy = Math.max(0, baseSubsidy + sizeMultiplier - incomeReduction)
      const annualSubsidy = monthlySubsidy * 12

      return {
        monthlySubsidy,
        annualSubsidy,
      }
    } catch (error) {
      console.error("Error calculating subsidy:", error)
      return {
        monthlySubsidy: 0,
        annualSubsidy: 0,
        error: "Failed to calculate subsidy",
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    calculateSubsidyWithDefaults,
    loading,
  }
}
