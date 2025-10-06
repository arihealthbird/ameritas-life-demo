export interface FAQ {
  question: string
  questionEs: string
  answer: string
  answerEs: string
}

export interface FAQCategory {
  id: string
  faqs: FAQ[]
}

export interface InsurancePlan {
  id: string
  name: string
  carrier: string
  type: string
  metalLevel: string
  premium: number
  deductible: number
  outOfPocketMax: number
  doctorVisitCopay: number
  specialistVisitCopay: number
  genericDrugCopay: number
  brandDrugCopay: number
  coversDoctors: boolean
  coversMedications: boolean
  rank: number
  matchScore: number
  estimatedAnnualCost: number
  rating: number
}
