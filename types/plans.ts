// Keep existing Health InsurancePlan type if needed for other parts of a larger app,
// or remove if this app is solely for life insurance now.
// For this refactor, we'll assume it can coexist or be replaced.

export interface HealthInsurancePlan {
  id: string
  name: string
  carrier: string
  type: string
  metalLevel: string
  premium: number
  deductible: number
  outOfPocketMax: number
  rating: number
  rank?: number
  matchScore?: number
  estimatedAnnualCost: number
  coversDoctors: boolean
  coversMedications: boolean
  doctorVisitCopay?: number
  specialistVisitCopay?: number
  genericDrugCopay?: number
  subsidy?: number
  originalPremium?: number
  annualCost?: number
  brandDrugCopay?: number
  primaryCareVisit?: string | number
  specialistVisit?: string | number
  urgentCare?: string | number
  genericDrugs?: string | number
  preferredBrandDrugs?: string | number
  nonPreferredBrandDrugs?: string | number
  specialtyDrugs?: string | number
  inpatientHospital?: string | number
  outpatientSurgery?: string | number
  emergencyRoom?: string | number
  ambulance?: string | number
  laboratoryTests?: string | number
  xRay?: string | number
  diagnosticImaging?: string | number
  maternityDelivery?: string | number
}

export interface LifeInsurancePlan {
  id: string
  name: string
  carrier: "Ameritas" // Specific to Ameritas
  type: "Term" | "Whole" | "Universal"
  deathBenefit: number
  premium: number // Monthly premium
  termLength?: number // In years, for Term Life
  cashValueFeature?: boolean // True for Whole/Universal
  guaranteedPremiums?: boolean
  issueAgeRange?: [number, number]
  rating?: number // e.g., AM Best rating for Ameritas
  description: string
  features: string[]
  matchScore?: number // Can still be used for ranking
  rank?: number
}

// Update FilterOptions for Life Insurance
export interface LifeFilterOptions {
  planTypes: Array<"Term" | "Whole" | "Universal">
  deathBenefitRange: [number, number]
  premiumRange: [number, number]
  termLengthRange?: [number, number] // For Term Life
  cashValue: boolean // Filter for plans with cash value
  minRating: number
}

// If HealthInsurancePlan is no longer needed, you can rename LifeInsurancePlan to InsurancePlan
// and LifeFilterOptions to FilterOptions. For now, I'll keep them distinct.
// To avoid breaking existing imports of FilterOptions, let's make a union or be specific.
// For this exercise, I'll assume we are replacing FilterOptions.
export type FilterOptions = LifeFilterOptions
export type InsurancePlan = LifeInsurancePlan // This will make other files use LifeInsurancePlan by default
