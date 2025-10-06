"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Clock, Calendar, Infinity } from "lucide-react"
import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"
import { useQuizAnswers } from "@/hooks/use-quiz-answers"

const durationOptions = [
  {
    id: "temporary",
    title: "Temporary (10-30 years)",
    description: "Coverage for a specific period, typically while you have dependents or debts",
    icon: Clock,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    popular: true,
  },
  {
    id: "lifetime",
    title: "Lifetime Coverage",
    description: "Permanent coverage that lasts your entire life with potential cash value",
    icon: Infinity,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "flexible",
    title: "Flexible Duration",
    description: "I'm not sure and would like recommendations based on my situation",
    icon: Calendar,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
]

export default function DurationPage() {
  const [selectedDuration, setSelectedDuration] = useState<string>("")
  const { navigateToNext, navigateBack } = useQuizNavigation()
  const { updateAnswer } = useQuizAnswers()

  const handleContinue = () => {
    if (selectedDuration) {
      updateAnswer("duration", selectedDuration)
      navigateToNext("/insurance-type-quiz/budget")
    }
  }

  return (
    <QuizPageWrapper
      onContinue={handleContinue}
      canContinue={!!selectedDuration}
      className="bg-gradient-to-br from-green-50 to-emerald-100"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">How long do you need coverage?</h1>
          <p className="text-lg text-gray-600">The duration of coverage affects both the type of policy and cost.</p>
        </div>

        <div className="space-y-4 mb-8">
          {durationOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 relative ${
                  selectedDuration === option.id ? "ring-2 ring-green-500 bg-green-50 border-green-300" : option.color
                }`}
                onClick={() => setSelectedDuration(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedDuration === option.id ? "bg-green-600 text-white" : "bg-white"
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
                        selectedDuration === option.id ? "border-green-500 bg-green-500" : "border-gray-300"
                      }`}
                    >
                      {selectedDuration === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
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

          <div className="text-sm text-gray-500">{selectedDuration && "Press Enter or click Continue"}</div>

          <Button
            onClick={handleContinue}
            disabled={!selectedDuration}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </QuizPageWrapper>
  )
}
