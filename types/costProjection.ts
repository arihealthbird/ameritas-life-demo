export type UsageLevel = "A little" | "Average" | "A lot"

export interface ServiceCost {
  count: number
  name: string
  stickerPrice: number
  insurancePays: number
  youPay: number
}

export interface CostProjection {
  usageLevel: UsageLevel
  services: ServiceCost[]
  totalStickerPrice: number
  totalInsurancePays: number
  totalYouPay: number
  monthlyYouPay: number
}
