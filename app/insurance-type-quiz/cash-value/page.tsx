"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, PiggyBank, TrendingUp, HelpCircle } from "lucide-react"
import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"
import { useQuizAnswers } from "@/hooks/use-quiz-answers"

const cashValueOptions = [
  {
    id: "yes",
    title: "Yes, I want cash value",
    description: "I want a policy that builds cash value I can borrow against or withdraw",
    icon: PiggyBank,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "no",
    title: "No, just protection",
    description: "I only want life insurance protection without cash value features",
    icon: TrendingUp,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    popular: true,
  },
  {
    id: "unsure",
    title: "I'm not sure",
    description: "I'd like to learn more about the differences and get recommendations",
    icon: HelpCircle,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
]

export default function CashValuePage() {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const { navigateToNext, navigateBack } = useQuizNavigation()
  const { updateAnswer } = useQuizAnswers()

  const handleContinue = () => {
    if (selectedOption) {
      updateAnswer("cashValue", selectedOption)
      navigateToNext("/insurance-type-quiz/dependents")
    }
  }

  return (
    <QuizPageWrapper
      onContinue={handleContinue}
      canContinue={!!selectedOption}
      className="bg-gradient-to-br from-orange-50 to-yellow-100"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full mb-4">
            <PiggyBank className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Are you interested in cash value features?</h1>
          <p className="text-lg text-gray-600">
            Some life insurance policies build cash value that you can access during your lifetime.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {cashValueOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 relative ${
                  selectedOption === option.id ? "ring-2 ring-orange-500 bg-orange-50 border-orange-300" : option.color
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedOption === option.id ? "bg-orange-600 text-white" : "bg-white"
                      }`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{option.title}</h3>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
                      }`}
                    >
                      {selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">What is cash value?</h4>
              <p className="text-sm text-blue-800">
                Cash value is a savings component in permanent life insurance that grows over time. You can borrow
                against it or withdraw funds, but it typically makes premiums higher.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={navigateBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="text-sm text-gray-500">{selectedOption && "Press Enter or click Continue"}</div>

          <Button
            onClick={handleContinue}
            disabled={!selectedOption}
            className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </QuizPageWrapper>
  )
}
