"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, DollarSign, Wallet, CreditCard } from "lucide-react"
import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"
import { useQuizAnswers } from "@/hooks/use-quiz-answers"

const budgetOptions = [
  {
    id: "budget-conscious",
    title: "Budget-Conscious",
    description: "Looking for the most affordable option that provides basic coverage",
    range: "Under $50/month",
    icon: Wallet,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "moderate",
    title: "Moderate Budget",
    description: "Willing to pay a reasonable amount for good coverage and benefits",
    range: "$50-150/month",
    icon: CreditCard,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    popular: true,
  },
  {
    id: "comprehensive",
    title: "Comprehensive Coverage",
    description: "Want the best coverage available with additional benefits and features",
    range: "$150+/month",
    icon: DollarSign,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
]

export default function BudgetPage() {
  const [selectedBudget, setSelectedBudget] = useState<string>("")
  const { navigateToNext, navigateBack } = useQuizNavigation()
  const { updateAnswer } = useQuizAnswers()

  const handleContinue = () => {
    if (selectedBudget) {
      updateAnswer("budget", selectedBudget)
      navigateToNext("/insurance-type-quiz/cash-value")
    }
  }

  return (
    <QuizPageWrapper
      onContinue={handleContinue}
      canContinue={!!selectedBudget}
      className="bg-gradient-to-br from-purple-50 to-pink-100"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full mb-4">
            <DollarSign className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your monthly budget for life insurance?</h1>
          <p className="text-lg text-gray-600">
            Your budget helps us find the right balance between coverage and affordability.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {budgetOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 relative ${
                  selectedBudget === option.id ? "ring-2 ring-purple-500 bg-purple-50 border-purple-300" : option.color
                }`}
                onClick={() => setSelectedBudget(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedBudget === option.id ? "bg-purple-600 text-white" : "bg-white"
                      }`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{option.title}</h3>
                        <span className="text-sm font-medium text-purple-600">{option.range}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedBudget === option.id ? "border-purple-500 bg-purple-500" : "border-gray-300"
                      }`}
                    >
                      {selectedBudget === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={navigateBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="text-sm text-gray-500">{selectedBudget && "Press Enter or click Continue"}</div>

          <Button
            onClick={handleContinue}
            disabled={!selectedBudget}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </QuizPageWrapper>
  )
}
