"use client"

import type React from "react"
import type { InsurancePlan } from "@/types/plans"
import BirdyAIInfoTabContent from "./InfoTab/BirdyAIInfoTabContent"

interface BirdyAIInfoTabProps {
  title: string
  explanation: string
  tips: string[]
  tabContentVariants: any
  onSuggestedQuestionClick?: (question: string) => void
  plan?: InsurancePlan
}

const BirdyAIInfoTab: React.FC<BirdyAIInfoTabProps> = (props) => {
  return <BirdyAIInfoTabContent {...props} />
}

export default BirdyAIInfoTab
