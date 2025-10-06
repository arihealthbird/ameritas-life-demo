"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, LockIcon, ScaleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Stepper, type Step } from "@/components/Stepper"

// Define the enrollment steps with the new incarceration step
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "incarceration", name: "Incarceration" },
  { id: "demographics", name: "Demographics" },
  { id: "verify", name: "Verify" },
  { id: "plan", name: "Plan Selection" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

export default function IncarcerationStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()

  // Form state
  const [isIncarcerated, setIsIncarcerated] = useState<string | null>(null)
  const [isPendingDisposition, setIsPendingDisposition] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)

  // Load pre-filled data from session storage if available
  useEffect(() => {
    const storedIncarceration = sessionStorage.getItem("isIncarcerated")
    const storedPendingDisposition = sessionStorage.getItem("isPendingDisposition")

    if (storedIncarceration) {
      setIsIncarcerated(storedIncarceration)
    }

    if (storedPendingDisposition) {
      setIsPendingDisposition(storedPendingDisposition)
    }
  }, [])

  // Validate form whenever values change
  useEffect(() => {
    validateForm()
  }, [isIncarcerated, isPendingDisposition])

  // Add animation styles
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out forwards;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const validateForm = () => {
    // Form is valid if user has answered the incarceration question
    // AND if they answered "yes", they must also answer the pending disposition question
    let isValid = false
    if (isIncarcerated === "no") {
      isValid = true
    } else if (isIncarcerated === "yes" && isPendingDisposition !== null) {
      isValid = true
    }
    setFormIsValid(isValid)
    return isValid
  }

  const handleIncarcerationChange = (value: string) => {
    setIsIncarcerated(value)
    // Reset pending disposition when changing incarceration status
    if (value === "no") {
      setIsPendingDisposition(null)
    }
  }

  const handlePendingDispositionChange = (value: string) => {
    setIsPendingDisposition(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Please answer all required questions to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save data to session storage
      sessionStorage.setItem(
        "incarcerationStatus",
        JSON.stringify({
          isIncarcerated,
        }),
      )

      // Redirect to the next page in the enrollment flow
      router.push("/enroll/demographics")
    } catch (error) {
      console.error("Error saving incarceration status:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push(`/enroll/citizenship-information?planId=${planId}`)
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Citizenship Information
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="incarceration" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton
                  title="Incarceration Status Help"
                  explanation="Get instant answers about providing your incarceration status for health insurance enrollment."
                  tips={[
                    "Learn why we need your incarceration information",
                    "Understand how incarceration affects eligibility",
                    "Learn about special enrollment periods after release",
                    "Get help with incarceration verification issues",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Incarceration Status</h1>
                <p className="text-gray-500">
                  Please provide your incarceration status to continue with your enrollment
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Incarceration Question */}
              <div className="space-y-4">
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <LockIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <label className="block text-base font-semibold text-gray-800">
                      Are you currently incarcerated, detained, or jailed?
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant={isIncarcerated === "yes" ? "default" : "outline"}
                      className={`w-full py-6 text-base ${
                        isIncarcerated === "yes"
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                          : "border-2 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                      onClick={() => handleIncarcerationChange("yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={isIncarcerated === "no" ? "default" : "outline"}
                      className={`w-full py-6 text-base ${
                        isIncarcerated === "no"
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                          : "border-2 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                      onClick={() => handleIncarcerationChange("no")}
                    >
                      No
                    </Button>
                  </div>
                </div>

                {/* Pending Disposition Question - Only show if incarcerated */}
                {isIncarcerated === "yes" && (
                  <div className="w-full mt-8 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <ScaleIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">
                        Are you incarcerated pending disposition of charges?
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Button
                        type="button"
                        variant={isPendingDisposition === "yes" ? "default" : "outline"}
                        className={`w-full py-6 text-base ${
                          isPendingDisposition === "yes"
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                            : "border-2 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                        onClick={() => handlePendingDispositionChange("yes")}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={isPendingDisposition === "no" ? "default" : "outline"}
                        className={`w-full py-6 text-base ${
                          isPendingDisposition === "no"
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                            : "border-2 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                        onClick={() => handlePendingDispositionChange("no")}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="mt-4" />

              {/* Navigation Buttons */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formIsValid}
                  className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Continue to Demographics"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
