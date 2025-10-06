"use client"
import { useState, useCallback, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import SimpleHeader from "@/components/SimpleHeader"
import BackButton from "@/components/BackButton"
import { SimpleParticles } from "@/components/ui/simple-particles"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { getMainFlowNextStep } from "@/utils/routeUtils"
import {
  Users,
  Home,
  Shield,
  Heart,
  FileText,
  HelpCircle,
  Clock,
  Infinity,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Info,
  Baby,
  UserCheck,
  UserPlus,
  ArrowRight,
  BarChart2,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { useQuizNavigation } from "@/hooks/use-quiz-navigation"

interface QuizOption {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface Question {
  id: string
  title: string
  subtitle: string
  options: QuizOption[]
  allowMultiple?: boolean
  isDependentsQuestion?: boolean
}

interface KeyFactor {
  title: string
  explanation: string
  type: "term" | "whole" | "neutral"
}

const DEPENDENT_OPTIONS_DATA = [
  { id: "spouse-partner", name: "Spouse/Partner", icon: Heart, description: "Your life partner" },
  { id: "children", name: "Children", icon: Baby, description: "Your kids or dependents" },
  { id: "parents", name: "Parents", icon: UserCheck, description: "Your mother or father" },
  { id: "others", name: "Others", icon: UserPlus, description: "Other family members" },
]

const quizQuestions: Question[] = [
  {
    id: "goals",
    title: "Let's get started! What are your goals for life insurance?",
    subtitle: "Select all that apply.",
    allowMultiple: true,
    options: [
      {
        id: "protect_loved_ones",
        label: "I want to protect my loved ones",
        description: "Provide financial security for family",
        icon: Users,
      },
      {
        id: "pay_off_mortgage",
        label: "I want to pay off my mortgage",
        description: "Cover home and major debts",
        icon: Home,
      },
      {
        id: "family_future",
        label: "I want to prepare for my family's future",
        description: "Long-term financial planning",
        icon: Shield,
      },
      {
        id: "peace_of_mind",
        label: "I'm looking for peace of mind",
        description: "General financial protection",
        icon: Heart,
      },
      {
        id: "final_expenses",
        label: "I want to cover my final expenses",
        description: "Funeral and end-of-life costs",
        icon: FileText,
      },
      {
        id: "not_sure",
        label: "I'm not sure",
        description: "Still exploring my options",
        icon: HelpCircle,
      },
    ],
  },
  {
    id: "duration",
    title: "How long do you need coverage?",
    subtitle: "Choose the option that best fits your situation.",
    allowMultiple: false,
    options: [
      {
        id: "specific_years",
        label: "For a specific period",
        description: "10-30 years (until kids are grown, mortgage paid)",
        icon: Clock,
      },
      {
        id: "entire_life",
        label: "For my entire life",
        description: "Permanent coverage that never expires",
        icon: Infinity,
      },
      {
        id: "unsure_duration",
        label: "I'm not sure",
        description: "Need help deciding on coverage length",
        icon: HelpCircle,
      },
    ],
  },
  {
    id: "budget",
    title: "What's most important for your budget?",
    subtitle: "Select your priority when it comes to premium payments.",
    allowMultiple: false,
    options: [
      {
        id: "lower_cost",
        label: "Lower monthly payments",
        description: "Affordable premiums, with higher rates upon renewal",
        icon: DollarSign,
      },
      {
        id: "stable_premiums",
        label: "Fixed monthly payments",
        description: "Premiums stay constant over the policy's lifespan",
        icon: TrendingUp,
      },
    ],
  },
  {
    id: "cash_value",
    title: "Are you interested in building cash value?",
    subtitle: "Some policies let you build savings alongside protection.",
    allowMultiple: false,
    options: [
      {
        id: "yes_cash_value",
        label: "Yes, that sounds appealing",
        description: "Build savings I can borrow against",
        icon: PiggyBank,
      },
      {
        id: "no_just_protection",
        label: "No, just protection please",
        description: "Affordable protection without savings",
        icon: Shield,
      },
    ],
  },
  {
    id: "dependents",
    title: "Who depends on you financially?",
    subtitle: "Select all that apply to help us tailor your coverage.",
    allowMultiple: true,
    isDependentsQuestion: true,
    options: DEPENDENT_OPTIONS_DATA.map((opt) => ({
      id: opt.id,
      label: opt.name,
      description: opt.description,
      icon: opt.icon,
    })),
  },
]

export default function InsuranceTypeQuizPage() {
  const { navigateToNext, navigateBack, navigateReplace, scrollToTopImmediate } = useQuizNavigation({
    smoothTransition: true,
    scrollToTop: true,
    scrollDelay: 100,
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recommendation, setRecommendation] = useState<{
    type: "term" | "whole"
    confidence: number
    keyFactors: KeyFactor[]
    overallExplanation: string
  } | null>(null)

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1
  const currentAnswers = answers[currentQuestion.id] || []

  const handleOptionToggle = (optionId: string) => {
    setAnswers((prev) => {
      const questionAnswers = prev[currentQuestion.id] || []

      if (currentQuestion.allowMultiple) {
        if (questionAnswers.includes(optionId)) {
          return { ...prev, [currentQuestion.id]: questionAnswers.filter((id) => id !== optionId) }
        } else {
          return { ...prev, [currentQuestion.id]: [...questionAnswers, optionId] }
        }
      } else {
        return { ...prev, [currentQuestion.id]: [optionId] }
      }
    })
  }

  const analyzeAnswers = useCallback((answers: Record<string, string[]>) => {
    let termScore = 0
    let wholeScore = 0
    const keyFactors: KeyFactor[] = []

    const goals = answers.goals || []
    if (goals.includes("protect_loved_ones") || goals.includes("pay_off_mortgage")) {
      termScore += 2
      keyFactors.push({
        title: "Covering Immediate Needs",
        explanation:
          "Your goal to protect loved ones and cover major debts like a mortgage points towards a solution that provides a significant death benefit for a specific period, which is a core feature of Term Life insurance.",
        type: "term",
      })
    }
    if (goals.includes("family_future")) {
      wholeScore += 2
      keyFactors.push({
        title: "Long-Term Financial Growth",
        explanation:
          "Your interest in long-term planning for your family's future aligns with Whole Life insurance, which offers a savings component that grows over time and can be used for future financial needs.",
        type: "whole",
      })
    }

    const duration = answers.duration?.[0]
    if (duration === "specific_years") {
      termScore += 3
      keyFactors.push({
        title: "Defined Coverage Period",
        explanation:
          "Needing coverage for a specific timeframe, such as until your children are independent or your mortgage is paid off, is the primary use case for Term Life insurance.",
        type: "term",
      })
    } else if (duration === "entire_life") {
      wholeScore += 3
      keyFactors.push({
        title: "Lifelong Protection",
        explanation:
          "Wanting coverage that lasts your entire life is the fundamental benefit of Whole Life insurance, ensuring a payout regardless of when you pass away.",
        type: "whole",
      })
    }

    const budget = answers.budget?.[0]
    if (budget === "lower_cost") {
      termScore += 2
      keyFactors.push({
        title: "Budget-Friendly Premiums",
        explanation:
          "Prioritizing lower initial monthly payments makes Term Life an attractive option, as it typically offers the most coverage for the lowest cost, especially when you're younger.",
        type: "term",
      })
    } else if (budget === "stable_premiums") {
      wholeScore += 2
      keyFactors.push({
        title: "Predictable, Fixed Costs",
        explanation:
          "The desire for fixed premiums that never increase is a key feature of Whole Life insurance, providing long-term budget stability and peace of mind.",
        type: "whole",
      })
    }

    const cashValue = answers.cash_value?.[0]
    if (cashValue === "no_just_protection") {
      termScore += 3
      keyFactors.push({
        title: "Focus on Pure Protection",
        explanation:
          "If your main goal is a straightforward death benefit without a savings or investment component, Term Life insurance provides the most efficient and affordable protection.",
        type: "term",
      })
    } else if (cashValue === "yes_cash_value") {
      wholeScore += 3
      keyFactors.push({
        title: "Building a Financial Asset",
        explanation:
          "Your interest in a policy that builds cash value points to Whole Life insurance. This feature creates a financial asset you can borrow against or use for future goals.",
        type: "whole",
      })
    }

    const total = termScore + wholeScore
    const confidence = total > 0 ? Math.round((Math.max(termScore, wholeScore) / total) * 100) : 0
    const type = termScore >= wholeScore ? ("term" as const) : ("whole" as const)

    return {
      type,
      confidence,
      keyFactors,
      overallExplanation:
        type === "term"
          ? "Term life insurance provides affordable protection for a specific period, making it ideal for covering temporary financial obligations."
          : "Whole life insurance offers permanent coverage with cash value growth, providing lifelong protection and financial flexibility.",
    }
  }, [])

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      // Ensure scroll to top before moving to next question
      scrollToTopImmediate()
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      scrollToTopImmediate()
      setCurrentQuestionIndex((prev) => prev - 1)
    } else {
      navigateBack()
    }
  }

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    const result = analyzeAnswers(answers)
    setRecommendation(result)
    sessionStorage.setItem("insuranceQuizAnswers", JSON.stringify(answers))
    const financialDependents = answers.dependents || []
    sessionStorage.setItem("financialDependents", JSON.stringify(financialDependents))
    sessionStorage.setItem("insuranceRecommendation", JSON.stringify(result))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setShowResults(true)
  }, [answers, analyzeAnswers])

  const handleContinueToNextStep = () => {
    const nextStep = getMainFlowNextStep("/insurance-type-quiz")
    if (nextStep) {
      navigateToNext(nextStep)
    } else {
      console.error("No next step defined after /insurance-type-quiz")
    }
  }

  useEffect(() => {
    const storedAnswers = sessionStorage.getItem("insuranceQuizAnswers")
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers))
    }
  }, [])

  const isCurrentQuestionAnswered = currentAnswers.length > 0

  if (showResults && recommendation) {
    // Consistent pink/purple color scheme
    const particleColor = "#D946EF" // Vivid Mulberry (Purple/Pink)
    const gradientFromClass = "from-purple-500"
    const gradientToClass = "to-pink-500"
    const accentBorderClass = "border-purple-500"
    const accentBgClass = "bg-purple-100"
    const accentTextClass = "text-purple-800"
    const iconBgClass = "bg-purple-100 text-purple-600"
    const buttonGradient = "bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-pink-500/30 focus:ring-pink-300"

    const handleBackFromResults = () => {
      scrollToTopImmediate()
      setShowResults(false)
      setCurrentQuestionIndex(quizQuestions.length - 1)
      setRecommendation(null)
    }

    return (
      <>
        <SimpleHeader />
        <motion.div
          className="min-h-screen bg-gray-50 relative overflow-hidden py-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SimpleParticles
            className="absolute inset-0 -z-10 pointer-events-none"
            quantity={100}
            color={particleColor}
            size={0.6}
          />

          <div className="max-w-md mx-auto relative z-10">
            <div className="absolute top-0 right-0 z-20 -mt-4 -mr-4 sm:mt-0 sm:mr-0">
              <BirdyAIFloatingButton
                title="Understand Your Results"
                explanation="Get insights into your life insurance recommendation and what it means for you."
                tips={[
                  `What are the benefits of ${recommendation.type === "term" ? "Term Life" : "Whole Life"}?`,
                  "How is my premium calculated?",
                  "Can I see other options?",
                  "What happens in the next step?",
                ]}
              />
            </div>

            {/* Back button container, consistent with quiz question pages */}
            <div className="mb-0 h-10">
              <BackButton onClick={handleBackFromResults} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200" // Consistent card styling
            >
              <div className="text-center mb-8">
                <motion.h1
                  className="text-3xl sm:text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Your Recommendation
                </motion.h1>
                <motion.p
                  className="text-md text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Here's the insurance type that best matches your needs.
                </motion.p>
              </div>

              <motion.div
                className={cn(
                  `border-t-4 rounded-xl p-6 mb-8 text-gray-800 relative overflow-hidden shadow-lg bg-white`,
                  accentBorderClass,
                )}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                    <div
                      className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0 rounded-full flex items-center justify-center text-white shadow-md",
                        `bg-gradient-to-br ${gradientFromClass} ${gradientToClass}`,
                      )}
                    >
                      {recommendation.type === "term" ? <Clock size={32} /> : <Shield size={32} />}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900">
                      {recommendation.type === "term" ? "Term Life Insurance" : "Whole Life Insurance"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">{recommendation.overallExplanation}</p>
                    <div
                      className={cn(
                        "flex items-center justify-center sm:justify-start rounded-full px-3 py-1.5 text-xs font-medium w-fit mx-auto sm:mx-0",
                        accentBgClass,
                        accentTextClass,
                      )}
                    >
                      <BarChart2 size={14} className="mr-1.5" />
                      <span>{recommendation.confidence}% Match Confidence</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center border-b pb-2">
                  Key Factors in Your Recommendation
                </h3>
                <div className="space-y-3">
                  {recommendation.keyFactors.map((factor, index) => (
                    <motion.div
                      key={index}
                      className="p-3.5 bg-gray-50 rounded-lg border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-start">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5",
                            iconBgClass,
                          )}
                        >
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-md">{factor.title}</h4>
                          <p className="text-gray-600 text-xs">{factor.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-amber-50 border-l-4 border-amber-400 text-amber-800 p-4 rounded-md mb-8 shadow-sm"
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mr-2.5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Important Note</h4>
                    <p className="text-xs">
                      This recommendation is a starting point. We'll guide you through specific Ameritas plans and
                      detailed coverage options in the upcoming steps.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <Button
                  onClick={handleContinueToNextStep}
                  size="lg"
                  className={cn(
                    "w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-md font-semibold transition-all duration-300 transform hover:scale-105 text-white hover:shadow-xl focus:outline-none focus:ring-4",
                    buttonGradient,
                  )}
                >
                  <span>Continue to Next Step</span>
                  <ArrowRight size={20} />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-white relative overflow-hidden">
        <SimpleParticles
          className="absolute inset-0 -z-10 pointer-events-none"
          quantity={100}
          color="#fc3893"
          size={0.5}
        />

        <div className="max-w-xl mx-auto px-4 py-12">
          <div className="max-w-md mx-auto mb-0 h-10">
            <BackButton onClick={handleBack} />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 relative z-10 max-w-md mx-auto">
            <div className="absolute -top-4 -right-4 z-20">
              {currentQuestion.isDependentsQuestion ? (
                <BirdyAIFloatingButton
                  title="Life Insurance Help"
                  explanation="Get instant answers about life insurance, policy types, and coverage needs."
                  tips={[
                    "What is term life insurance?",
                    "How much life insurance do I need?",
                    "Can I include my parents on my policy?",
                  ]}
                />
              ) : (
                <BirdyAIFloatingButton
                  title="Life Insurance Guidance"
                  explanation="Get answers about term vs. whole life, coverage amounts, and policy features."
                  tips={[
                    "What's the difference between term and whole life?",
                    "How much life insurance coverage do I need?",
                    "Can I change my policy type later?",
                    "What is cash value in a life insurance policy?",
                  ]}
                />
              )}
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                {currentQuestion.title}
              </h1>
              <p className="text-gray-600">{currentQuestion.subtitle}</p>

              <div className="flex justify-center mt-4 space-x-2">
                {quizQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentQuestionIndex
                        ? "bg-purple-500 w-6"
                        : index < currentQuestionIndex
                          ? "bg-purple-300"
                          : "bg-gray-200",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option) => {
                  const IconComponent = option.icon
                  const isSelected = currentAnswers.includes(option.id)

                  return (
                    <Label htmlFor={option.id} className="block cursor-pointer" key={option.id}>
                      <div
                        className={cn(
                          "group relative rounded-2xl border-2 p-6 transition-all duration-300",
                          "hover:scale-[1.02] hover:shadow-xl",
                          isSelected
                            ? "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 border-transparent text-white shadow-2xl shadow-pink-500/25"
                            : "border-gray-200 bg-white hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                            isSelected ? "opacity-100" : "group-hover:opacity-20",
                            "bg-gradient-to-br from-white/10 to-transparent",
                          )}
                        />

                        {isSelected && (
                          <div className="absolute inset-0 rounded-2xl overflow-hidden">
                            <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full" />
                            <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/30 rounded-full" />
                            <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-white/15 rounded-full" />
                          </div>
                        )}

                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1 pr-6">
                            <div
                              className={cn(
                                "relative p-3 rounded-xl transition-all duration-300",
                                isSelected
                                  ? "bg-white/20 shadow-lg"
                                  : "bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200",
                              )}
                            >
                              <IconComponent
                                className={cn(
                                  "h-6 w-6 transition-all duration-300",
                                  isSelected ? "text-white" : "text-purple-600 group-hover:text-purple-700",
                                )}
                              />
                              {isSelected && <div className="absolute inset-0 rounded-xl bg-white/5" />}
                            </div>

                            <div>
                              <Label
                                htmlFor={option.id}
                                className={cn(
                                  "text-base font-semibold cursor-pointer transition-all duration-300 leading-tight",
                                  isSelected ? "text-white" : "text-gray-800 group-hover:text-purple-700",
                                )}
                              >
                                {option.label}
                              </Label>
                              <p
                                className={cn(
                                  "text-sm mt-1 transition-all duration-300",
                                  isSelected ? "text-white/80" : "text-gray-500 group-hover:text-purple-600",
                                )}
                              >
                                {option.description}
                              </p>
                            </div>
                          </div>

                          <div className="relative ml-4">
                            <Checkbox
                              id={option.id}
                              checked={isSelected}
                              onCheckedChange={() => handleOptionToggle(option.id)}
                              className={cn(
                                "h-6 w-6 transition-all duration-300",
                                isSelected
                                  ? "border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-purple-600 shadow-lg"
                                  : "border-gray-400 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white group-hover:border-purple-400",
                              )}
                            />
                            {isSelected && <div className="absolute inset-0 rounded-sm bg-white/10" />}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 transition-all duration-300">
                            <div className="w-3 h-3 bg-white rounded-full shadow-lg opacity-80" />
                          </div>
                        )}
                      </div>
                    </Label>
                  )
                })}
              </div>

              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered || isSubmitting}
                className={cn(
                  "w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-6 rounded-lg transition-all duration-300",
                  isCurrentQuestionAnswered
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/20"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed",
                )}
              >
                <span>{isSubmitting ? "Processing..." : isLastQuestion ? "Complete Quiz" : "Continue"}</span>
              </Button>

              {!isCurrentQuestionAnswered && (
                <p className="text-red-500 text-sm mt-1 text-center">Please select at least one option to continue.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
