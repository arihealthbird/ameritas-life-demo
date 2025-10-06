"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { Stepper, type Step } from "@/components/Stepper"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"

// Define the enrollment steps with the agreements step
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "incarceration", name: "Incarceration" },
  { id: "demographics", name: "Demographics" },
  { id: "verify", name: "Verify" },
  { id: "agreements", name: "Agreements" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

interface AgreementLayoutProps {
  children: ReactNode
  title: string
  description: string
  currentStep: string
  backPath: string
  nextPath: string
  isNextDisabled: boolean
}

export default function AgreementLayout({
  children,
  title,
  description,
  currentStep,
  backPath,
  nextPath,
  isNextDisabled,
}: AgreementLayoutProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push(backPath)
  }

  const handleNext = () => {
    router.push(nextPath)
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep={currentStep} className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton
                  title="Agreement Help"
                  explanation="Get instant answers about the agreements for health insurance enrollment."
                  tips={[
                    "Learn why these agreements are necessary",
                    "Understand how these agreements affect your coverage",
                    "Get help with specific agreement questions",
                    "Learn about your rights and responsibilities",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">{title}</h1>
                <p className="text-gray-500">{description}</p>
              </div>
            </div>

            {/* Agreement Content */}
            <div className="mt-8">{children}</div>

            {/* Navigation Button */}
            <div className="mt-8 pt-4 flex justify-center">
              <Button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
