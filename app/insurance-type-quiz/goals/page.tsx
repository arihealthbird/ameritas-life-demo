"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Target, Shield, DollarSign, Users } from "lucide-react"
import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"
import { useQuizAnswers } from "@/hooks/use-quiz-answers"

const goalOptions = [
  {
    id: "protection",
    title: "Financial Protection",
    description: "Protect my family's financial future",
    icon: Shield,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "income-replacement",
    title: "Income Replacement",
    description: "Replace my income if something happens to me",
    icon: DollarSign,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "debt-coverage",
    title: "Debt Coverage",
    description: "Cover outstanding debts and expenses",
    icon: Target,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    id: "legacy",
    title: "Leave a Legacy",
    description: "Leave money for my beneficiaries",
    icon: Users,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
]

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string>("")
  const { navigateToNext, navigateBack } = useQuizNavigation()
  const { updateAnswer } = useQuizAnswers()

  const handleContinue = () => {
    if (selectedGoal) {
      updateAnswer("goals", selectedGoal)
      navigateToNext("/insurance-type-quiz/duration")
    }
  }

  return (
    <QuizPageWrapper
      onContinue={handleContinue}
      canContinue={!!selectedGoal}
      className="bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <Target className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your primary goal for life insurance?</h1>
          <p className="text-lg text-gray-600">
            Understanding your main objective helps us recommend the right coverage for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {goalOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedGoal === option.id ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300" : option.color
                }`}
                onClick={() => setSelectedGoal(option.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${selectedGoal === option.id ? "bg-blue-600 text-white" : "bg-white"}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{option.title}</h3>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedGoal === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selectedGoal === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
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

          <div className="text-sm text-gray-500">{selectedGoal && "Press Enter or click Continue"}</div>

          <Button
            onClick={handleContinue}
            disabled={!selectedGoal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </QuizPageWrapper>
  )
}
