export type IncomeSourceType = "job" | "self-employed" | "unemployed" | "unemployment" | "other"
export type FrequencyType = "yearly" | "monthly" | "biweekly" | "weekly"

export interface IncomeSource {
  type: IncomeSourceType
  amount: number
  frequency: FrequencyType
  employerName?: string
  employerPhone?: string
  jobType?: string
  expirationDate?: string
  description?: string
}
