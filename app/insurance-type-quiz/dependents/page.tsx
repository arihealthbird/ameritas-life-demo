"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Users, Baby, Heart, User } from "lucide-react"
import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"
import { useQuizAnswers } from "@/hooks/use-quiz-answers"

const dependentOptions = [
  {
    id: "spouse-children",
    title: "Spouse and Children",
    description: "I have a spouse/partner and children who depend on my income",
    icon: Users,
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    popular: true,
  },
  {
    id: "spouse-only",
    title: "Spouse/Partner Only",
    description: "I have a spouse or partner but no children",
    icon: Heart,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
  },
  {
    id: "children-only",
    title: "Children Only",
    description: "I'm a single parent with children who depend on me",
    icon: Baby,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "no-dependents",
    title: "No Dependents",
    description: "I don't have anyone who financially depends on me",
    icon: User,
    color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
  },
]

export default function DependentsPage() {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const { navigateToNext, navigateBack } = useQuizNavigation()
  const { updateAnswer } = useQuizAnswers()

  const handleContinue = () => {
    if (selectedOption) {
      updateAnswer("dependents", selectedOption)
      navigateToNext("/insurance-type-quiz/results")
    }
  }

  return (
    <QuizPageWrapper
      onContinue={handleContinue}
      canContinue={!!selectedOption}
      className="bg-gradient-to-br from-pink-50 to-rose-100"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 text-white rounded-full mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Who depends on your income?</h1>
          <p className="text-lg text-gray-600">
            Understanding your dependents helps determine how much coverage you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {dependentOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 relative ${
                  selectedOption === option.id ? "ring-2 ring-pink-500 bg-pink-50 border-pink-300" : option.color
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Common
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedOption === option.id ? "bg-pink-600 text-white" : "bg-white"
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
                        selectedOption === option.id ? "border-pink-500 bg-pink-500" : "border-gray-300"
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

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={navigateBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="text-sm text-gray-500">{selectedOption && "Press Enter or click Continue"}</div>

          <Button
            onClick={handleContinue}
            disabled={!selectedOption}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>See Results</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </QuizPageWrapper>
  )
}
