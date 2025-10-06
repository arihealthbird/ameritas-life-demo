import type { InsurancePlan } from "@/types/plans"

export function getPlanCostBreakdown(plan: InsurancePlan) {
  return {
    premium: plan.premium,
    deductible: plan.deductible,
    outOfPocketMax: plan.outOfPocketMax,
    doctorVisit: plan.doctorVisitCopay || 20,
    specialistVisit: plan.specialistVisitCopay || 35,
    genericDrugs: plan.genericDrugCopay || 10,
  }
}

export function getRankingReason(plan: InsurancePlan) {
  if (!plan.rank) return null

  if (plan.rank === 1) {
    return {
      title: "Best Overall Value",
      description: "This plan offers the best balance of coverage and cost for your specific needs.",
    }
  }

  if (plan.rank === 2) {
    return {
      title: "Great Coverage",
      description: "This plan provides excellent coverage for your healthcare needs.",
    }
  }

  if (plan.rank === 3) {
    return {
      title: "Budget-Friendly Option",
      description: "This plan offers good coverage at a lower cost.",
    }
  }

  return {
    title: `Ranked #${plan.rank}`,
    description: "This plan is a good match for your healthcare needs.",
  }
}

export function getRankBadgeStyle(rank: number) {
  if (rank === 1) {
    return {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-300",
    }
  }

  if (rank === 2) {
    return {
      bgColor: "bg-gray-200",
      textColor: "text-gray-800",
      iconColor: "text-gray-600",
      borderColor: "border-gray-300",
    }
  }

  if (rank === 3) {
    return {
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      iconColor: "text-amber-600",
      borderColor: "border-amber-300",
    }
  }

  return {
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    iconColor: "text-purple-600",
    borderColor: "border-purple-300",
  }
}

export function getPlanCardHighlight(plan: InsurancePlan, sortOption: string) {
  if (plan.rank === 1) {
    return {
      title: "Best Overall Value",
      description: "This plan offers the best balance of coverage and cost for your specific needs.",
    }
  }

  if (sortOption === "premium" && plan.premium < 300) {
    return {
      title: "Low Monthly Premium",
      description: "This plan has one of the lowest monthly premiums available.",
    }
  }

  if (sortOption === "deductible" && plan.deductible < 1000) {
    return {
      title: "Low Deductible",
      description: "This plan has a lower deductible than most other plans.",
    }
  }

  if (plan.coversDoctors && plan.coversMedications) {
    return {
      title: "Comprehensive Coverage",
      description: "This plan covers both your doctors and medications.",
    }
  }

  return null
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const getOrdinal = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}
