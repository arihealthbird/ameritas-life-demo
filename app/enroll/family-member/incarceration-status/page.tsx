"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, LockIcon, ScaleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"
import { getFamilyMemberById, updateFamilyMember, getPreviousStep, getStepUrl } from "@/utils/familyMemberUtils"
import { isNotApplying } from "@/utils/enrollmentUtils"
import Link from "next/link"

export default function FamilyMemberIncarcerationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const familyMemberId = searchParams.get("familyMemberId") || ""
  const memberType = searchParams.get("type") as "spouse" | "dependent"
  const { toast } = useToast()

  // Form state
  const [isIncarcerated, setIsIncarcerated] = useState<string | null>(null)
  const [isPendingDisposition, setIsPendingDisposition] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)
  const [submissionAttempted, setSubmissionAttempted] = useState(false)
  const [notApplying, setNotApplying] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Prefetch the next page to speed up navigation
  useEffect(() => {
    // Construct the next page URL
    const nextPageUrl = `/enroll/family-member/demographics?planId=${encodeURIComponent(planId || "")}&familyMemberId=${encodeURIComponent(familyMemberId)}&type=${encodeURIComponent(memberType)}`

    // Prefetch the next page
    router.prefetch(nextPageUrl)
  }, [router, planId, familyMemberId, memberType])

  // Load pre-filled data from session storage
  useEffect(() => {
    if (!familyMemberId) {
      toast({
        title: "Missing family member information",
        description: "Unable to identify which family member to edit",
        variant: "destructive",
      })
      return
    }

    // Check if this family member is not applying for coverage
    setNotApplying(isNotApplying(familyMemberId))

    // Load family member data
    const member = getFamilyMemberById(familyMemberId)
    if (member) {
      if (member.isIncarcerated) setIsIncarcerated(member.isIncarcerated)
      if (member.isPendingDisposition) setIsPendingDisposition(member.isPendingDisposition)
    }
  }, [familyMemberId, toast])

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
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    .page-transition {
      transition: opacity 0.3s ease-in-out;
    }
    .page-transition-exit {
      opacity: 0;
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

  // Optimized navigation with transition
  const navigateToNextPage = () => {
    // Start transition animation
    setIsTransitioning(true)

    // Construct the URL with all necessary parameters
    const nextUrl = `/enroll/family-member/demographics?planId=${encodeURIComponent(planId || "")}&familyMemberId=${encodeURIComponent(familyMemberId)}&type=${encodeURIComponent(memberType)}`

    // Use Next.js router for client-side navigation
    setTimeout(() => {
      router.push(nextUrl)
    }, 100) // Short delay to allow transition to start
  }

  const handleSkip = () => {
    // Navigate to the next step without saving any data
    navigateToNextPage()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionAttempted(true)

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Please answer all required questions",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update family member data
      if (familyMemberId) {
        const member = getFamilyMemberById(familyMemberId)
        if (member) {
          const updatedMember = {
            ...member,
            isIncarcerated,
            isPendingDisposition: isIncarcerated === "yes" ? isPendingDisposition : null,
          }
          updateFamilyMember(updatedMember)
        }
      }

      // Show success toast
      toast({
        title: "Information Saved",
        description: `${memberType === "spouse" ? "Spouse" : "Dependent"} incarceration status has been saved successfully`,
      })

      // Use optimized navigation
      navigateToNextPage()
    } catch (error) {
      console.error("Error saving incarceration status:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Get the previous step for the back button
  const previousStep = getPreviousStep("incarceration")
  const backUrl = previousStep ? getStepUrl(previousStep) : undefined
  const backText = previousStep ? `Back to ${previousStep.charAt(0).toUpperCase() + previousStep.slice(1)}` : undefined

  // Create the next page URL for prefetching
  const nextPageUrl = `/enroll/family-member/demographics?planId=${encodeURIComponent(planId || "")}&familyMemberId=${encodeURIComponent(familyMemberId)}&type=${encodeURIComponent(memberType)}`

  // Return statement and submit button section
  return (
    <>
      {/* Prefetch link for the next page */}
      <Link href={nextPageUrl} prefetch={true} className="hidden" />

      <div className={`page-transition ${isTransitioning ? "page-transition-exit" : ""}`}>
        <FamilyMemberEnrollmentLayout
          currentStep="incarceration"
          title={`${memberType === "spouse" ? "Spouse" : "Dependent"} Incarceration Status`}
          description={`Please provide your ${memberType === "spouse" ? "spouse's" : "dependent's"} incarceration status`}
          aiTitle={`${memberType === "spouse" ? "Spouse" : "Dependent"} Incarceration Status Help`}
          aiExplanation={`Get instant answers about providing your ${memberType === "spouse" ? "spouse's" : "dependent's"} incarceration status for health insurance enrollment.`}
          aiTips={[
            `Learn why we need your ${memberType === "spouse" ? "spouse's" : "dependent's"} incarceration information`,
            "Understand how incarceration affects eligibility",
            "Learn about special enrollment periods after release",
            "Get help with incarceration verification issues",
          ]}
          backUrl={backUrl}
          backText={backText}
          showSkip={notApplying}
          onSkip={handleSkip}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Incarceration Question */}
            <div className="space-y-4">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <LockIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <label className="block text-base font-semibold text-gray-800">
                    Is your {memberType === "spouse" ? "spouse" : "dependent"} currently incarcerated, detained, or
                    jailed?
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
                      Is your {memberType === "spouse" ? "spouse" : "dependent"} incarcerated pending disposition of
                      charges?
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

            {/* Submit button */}
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting || !formIsValid}
                className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isTransitioning ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>{isSubmitting ? "Saving..." : "Loading..."}</span>
                  </div>
                ) : (
                  <>
                    Continue to Next Step
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </FamilyMemberEnrollmentLayout>
      </div>
    </>
  )
}
