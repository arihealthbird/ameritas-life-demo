"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { InsurancePlan } from "@/types/plans"

interface BirdyAIInfoTabContentProps {
  title: string
  explanation: string
  tips: string[]
  tabContentVariants: any
  onSuggestedQuestionClick?: (question: string) => void
  plan?: InsurancePlan
}

const BirdyAIInfoTabContent: React.FC<BirdyAIInfoTabContentProps> = ({
  title,
  explanation,
  tips,
  tabContentVariants,
  onSuggestedQuestionClick,
  plan,
}) => {
  return (
    <motion.div
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto p-4"
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-500/10 rounded-xl p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
            {title}
          </h3>
          <p className="text-gray-700 text-sm">{explanation}</p>
        </div>

        {tips.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Try asking about:</h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="h-5 w-5 rounded-full bg-purple-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-purple-600">{index + 1}</span>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan && (
          <div className="bg-purple-600/5 rounded-xl p-4 border border-purple-600/10">
            <h4 className="text-sm font-medium text-gray-900 mb-2">About {plan.name}</h4>
            <p className="text-sm text-gray-700 mb-2">
              This {plan.metalLevel} plan from {plan.carrier} has a monthly premium of ${plan.premium} and a deductible
              of ${plan.deductible}.
            </p>
            <p className="text-sm text-gray-700">
              Ask me specific questions about this plan's coverage, network, or benefits!
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50">
          <h4 className="text-sm font-medium text-gray-900 mb-2">About Birdy AI</h4>
          <p className="text-sm text-gray-700">
            Birdy AI is your personal health insurance assistant. I can help you understand insurance terms, find the
            right plan, and answer your coverage questions.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default BirdyAIInfoTabContent
