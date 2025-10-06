"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, CheckCircle, Star, TrendingUp } from "lucide-react"
import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"
import { useQuizAnswers } from "@/hooks/use-quiz-answers"

export default function ResultsPage() {
  const { navigateToNext, navigateBack } = useQuizNavigation()
  const { answers } = useQuizAnswers()

  const handleContinue = () => {
    navigateToNext("/date-of-birth")
  }

  // Generate recommendations based on answers
  const getRecommendation = () => {
    const { goals, duration, budget, cashValue, dependents } = answers

    if (duration === "temporary" && cashValue === "no") {
      return {
        type: "Term Life Insurance",
        description: "Perfect for temporary protection needs at an affordable cost",
        benefits: [
          "Lower premiums",
          "Simple and straightforward",
          "Ideal for covering debts and dependents",
          "Flexible term lengths",
        ],
        estimatedCost: budget === "budget-conscious" ? "$25-50/month" : "$50-100/month",
      }
    } else if (cashValue === "yes" || duration === "lifetime") {
      return {
        type: "Whole Life Insurance",
        description: "Permanent coverage with cash value that grows over time",
        benefits: ["Lifetime coverage guarantee", "Builds cash value", "Fixed premiums", "Potential dividends"],
        estimatedCost: budget === "comprehensive" ? "$200-400/month" : "$100-200/month",
      }
    } else {
      return {
        type: "Universal Life Insurance",
        description: "Flexible permanent coverage with investment options",
        benefits: ["Flexible premiums", "Cash value growth potential", "Lifetime coverage", "Investment options"],
        estimatedCost: "$150-300/month",
      }
    }
  }

  const recommendation = getRecommendation()

  return (
    <QuizPageWrapper
      onContinue={handleContinue}
      canContinue={true}
      className="bg-gradient-to-br from-emerald-50 to-teal-100"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full mb-4">
            <Star className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Recommendation</h1>
          <p className="text-lg text-gray-600">Based on your answers, here's what we recommend for your situation.</p>
        </div>

        <Card className="mb-8 border-emerald-200 bg-emerald-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-emerald-800 flex items-center justify-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>{recommendation.type}</span>
            </CardTitle>
            <p className="text-emerald-700">{recommendation.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {recommendation.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Estimated Cost:</h4>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">{recommendation.estimatedCost}</div>
                  <p className="text-sm text-gray-600">Actual rates depend on age, health, and coverage amount</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Your Quiz Answers:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Primary Goal:</span>
              <span className="ml-2 text-gray-600 capitalize">{answers.goals?.replace("-", " ")}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Coverage Duration:</span>
              <span className="ml-2 text-gray-600 capitalize">{answers.duration}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Budget:</span>
              <span className="ml-2 text-gray-600 capitalize">{answers.budget?.replace("-", " ")}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cash Value:</span>
              <span className="ml-2 text-gray-600 capitalize">{answers.cashValue}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={navigateBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="text-sm text-gray-500">Press Enter or click Continue to get quotes</div>

          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2"
          >
            <span>Get Quotes</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </QuizPageWrapper>
  )
}
