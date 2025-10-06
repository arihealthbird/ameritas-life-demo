"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { Stepper, type Step } from "@/components/Stepper"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { isConditionalFlowActive } from "@/utils/enrollmentUtils"

// Define the enrollment steps for family members
export const familyMemberSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "incarceration", name: "Incarceration" },
  { id: "demographics", name: "Demographics" },
  { id: "income", name: "Income" },
  { id: "tobacco", name: "Tobacco Usage" },
]

interface FamilyMemberEnrollmentLayoutProps {
  children: React.ReactNode
  currentStep: string
  title: string
  description: string
  aiTitle: string
  aiExplanation: string
  aiTips: string[]
  backUrl?: string
  backText?: string
  showSkip?: boolean
  onSkip?: () => void
}

export default function FamilyMemberEnrollmentLayout({
  children,
  currentStep,
  title,
  description,
  aiTitle,
  aiExplanation,
  aiTips,
  backUrl,
  backText,
  showSkip = false,
  onSkip,
}: FamilyMemberEnrollmentLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const familyMemberId = searchParams.get("familyMemberId")
  const memberType = searchParams.get("type") as "spouse" | "dependent"

  // Check if this family member should be in the conditional flow
  const isConditionalFlow = familyMemberId ? isConditionalFlowActive(familyMemberId) : false

  const handleBack = () => {
    if (backUrl) {
      router.push(`${backUrl}?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`)
    } else {
      router.push(`/enroll/review?planId=${planId}`)
    }
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText || "Back to Review"}
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={familyMemberSteps} currentStep={currentStep} className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton title={aiTitle} explanation={aiExplanation} tips={aiTips} />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">{title}</h1>
                <p className="text-gray-500">{description}</p>
              </div>
            </div>

            {children}

            {/* Skip button for conditional flow */}
            {(showSkip || isConditionalFlow) && onSkip && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="w-full md:w-2/3 py-4 rounded-full text-base font-medium border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 flex items-center justify-center gap-2"
                >
                  Skip this step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
