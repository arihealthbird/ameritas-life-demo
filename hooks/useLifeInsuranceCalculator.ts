"use client"

interface LifeInsuranceNeedsInput {
  annualIncome: number
  debtAmount: number
  numberOfChildren: number
  primaryApplicantAge: number | null
  // Potentially add quiz answers for goals, existing coverage, etc.
}

interface LifeInsuranceNeedsOutput {
  recommendedCoverage: number
  calculationBreakdown?: Record<string, number> // For transparency
}

// Constants for calculation (can be adjusted or made dynamic)
const INCOME_REPLACEMENT_YEARS = 10
const EDUCATION_COST_PER_CHILD = 50000 // Per child, for college, etc.
const FINAL_EXPENSES = 15000 // Funeral costs, medical bills, etc.
// const MORTGAGE_PAYOFF_TARGET_PERCENTAGE = 0.8 // Assume 80% of debt might be mortgage - not currently used directly

export function useLifeInsuranceCalculator() {
  const calculateNeeds = (inputs: LifeInsuranceNeedsInput): LifeInsuranceNeedsOutput => {
    const { annualIncome, debtAmount, numberOfChildren /*, primaryApplicantAge*/ } = inputs // primaryApplicantAge not used yet

    let incomeReplacementNeed = 0
    if (annualIncome > 0) {
      incomeReplacementNeed = annualIncome * INCOME_REPLACEMENT_YEARS
    }

    const educationNeed = numberOfChildren * EDUCATION_COST_PER_CHILD

    const debtClearanceNeed = debtAmount

    const totalCalculatedNeed = incomeReplacementNeed + educationNeed + debtClearanceNeed + FINAL_EXPENSES

    // Round to nearest $10,000 or $50,000 for typical policy amounts
    // Let's use $25,000 as a common rounding increment for life insurance
    const roundedCoverage = Math.ceil(totalCalculatedNeed / 25000) * 25000

    return {
      recommendedCoverage: Math.max(0, roundedCoverage), // Ensure non-negative
      calculationBreakdown: {
        incomeReplacement: incomeReplacementNeed,
        educationFund: educationNeed,
        debtClearance: debtClearanceNeed,
        finalExpenses: FINAL_EXPENSES,
        totalRaw: totalCalculatedNeed,
      },
    }
  }

  return { calculateNeeds }
}
