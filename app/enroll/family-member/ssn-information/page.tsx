"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Shield, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"
import { getFamilyMemberById, updateFamilyMember, getPreviousStep, getStepUrl } from "@/utils/familyMemberUtils"
import { isNotApplying, getNextEnrollmentStep } from "@/utils/enrollmentUtils"

export default function FamilyMemberSSNPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const familyMemberId = searchParams.get("familyMemberId") || ""
  const memberType = searchParams.get("type") as "spouse" | "dependent"
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [ssnValue, setSsnValue] = useState("")
  const [showSsn, setShowSsn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)
  const [touched, setTouched] = useState(false)
  const [submissionAttempted, setSubmissionAttempted] = useState(false)
  const [recentlyTypedIndex, setRecentlyTypedIndex] = useState<number | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [notApplying, setNotApplying] = useState(false)

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
    if (member && member.ssn) {
      setSsnValue(member.ssn)
    }
  }, [familyMemberId, toast])

  // Validate form whenever SSN changes
  useEffect(() => {
    validateForm()
  }, [ssnValue])

  // Clear the recently typed index after a delay
  useEffect(() => {
    if (recentlyTypedIndex !== null) {
      const timer = setTimeout(() => {
        setRecentlyTypedIndex(null)
      }, 1500) // 1.5 seconds before masking
      return () => clearTimeout(timer)
    }
  }, [recentlyTypedIndex])

  const validateForm = () => {
    // SSN must be exactly 9 digits
    const isValid = /^\d{9}$/.test(ssnValue)
    setFormIsValid(isValid)
    return isValid
  }

  // Format SSN with hyphens for display
  const formatDisplaySSN = (value: string): string => {
    if (!value) return ""

    // Create a masked version with the appropriate format
    let result = ""
    let digitCount = 0

    for (let i = 0; i < 11; i++) {
      // 9 digits + 2 hyphens = 11 characters
      // Add hyphens at positions 3 and 6
      if (i === 3 || i === 6) {
        result += "-"
        continue
      }

      // Calculate the digit index (accounting for hyphens)
      const digitIndex = i - (i > 6 ? 2 : i > 3 ? 1 : 0)

      if (digitCount < value.length) {
        // Show the actual digit if it should be visible
        if (showSsn || digitCount === recentlyTypedIndex) {
          result += value[digitCount]
        } else {
          result += "•"
        }
        digitCount++
      } else {
        // Add placeholder for missing digits
        result += "_"
      }
    }

    return result
  }

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value and remove non-digits
    const inputValue = e.target.value.replace(/\D/g, "")

    // Limit to 9 digits
    const truncatedValue = inputValue.slice(0, 9)

    // If we're adding a character, track the new character's index
    if (truncatedValue.length > ssnValue.length) {
      setRecentlyTypedIndex(truncatedValue.length - 1)
    }

    // Update state with raw digits (no formatting)
    setSsnValue(truncatedValue)
    setTouched(true)
  }

  const toggleSsnVisibility = () => {
    setShowSsn(!showSsn)
    // Focus the input field after toggling visibility
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleSkip = () => {
    // Navigate to the next step without saving any data
    const nextStep = getNextEnrollmentStep("ssn-information")
    router.push(
      `/enroll/family-member/${nextStep}?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`,
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionAttempted(true)

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Please enter a valid 9-digit Social Security Number",
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
            ssn: ssnValue,
          }
          updateFamilyMember(updatedMember)
        }
      }

      // Show success toast
      toast({
        title: "SSN Saved",
        description: `${memberType === "spouse" ? "Spouse" : "Dependent"} Social Security Number has been securely saved`,
      })

      // Always navigate to the citizenship page next
      router.push(
        `/enroll/family-member/citizenship-information?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`,
      )
    } catch (error) {
      console.error("Error saving SSN information:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle paste event to properly format pasted SSNs
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 9)

    setSsnValue(digitsOnly)
    setTouched(true)

    // If we pasted a complete SSN, don't show any digits
    if (digitsOnly.length === 9) {
      setRecentlyTypedIndex(null)
    } else if (digitsOnly.length > 0) {
      // Otherwise, show the last digit briefly
      setRecentlyTypedIndex(digitsOnly.length - 1)
    }
  }

  const shouldShowError = () => {
    return (touched || submissionAttempted) && !formIsValid
  }

  // Get the previous step for the back button
  const previousStep = getPreviousStep("ssn")
  const backUrl = previousStep ? getStepUrl(previousStep) : undefined
  const backText = previousStep ? `Back to ${previousStep.charAt(0).toUpperCase() + previousStep.slice(1)}` : undefined

  return (
    <FamilyMemberEnrollmentLayout
      currentStep="ssn"
      title={`${memberType === "spouse" ? "Spouse" : "Dependent"} Social Security Number`}
      description={`Please provide your ${memberType === "spouse" ? "spouse's" : "dependent's"} Social Security Number`}
      aiTitle={`${memberType === "spouse" ? "Spouse" : "Dependent"} SSN Information Help`}
      aiExplanation={`Get instant answers about providing your ${memberType === "spouse" ? "spouse's" : "dependent's"} Social Security Number for health insurance enrollment.`}
      aiTips={[
        `Learn why we need your ${memberType === "spouse" ? "spouse's" : "dependent's"} Social Security Number`,
        "Understand how this information is protected",
        "Learn about identity verification requirements",
        "Get help with SSN-related issues",
      ]}
      backUrl={backUrl}
      backText={backText}
      showSkip={notApplying}
      onSkip={handleSkip}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SSN Input Section */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-full max-w-[280px] text-center">
            <label htmlFor="ssn" className="block text-base font-semibold text-gray-800"></label>
          </div>

          <div className="relative w-full max-w-[280px]">
            {/* Input container with proper overflow handling */}
            <div className="relative overflow-visible">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Shield
                  className={`h-5 w-5 ${formIsValid && ssnValue.length === 9 ? "text-green-500" : "text-gray-400"}`}
                />
              </div>

              <div
                className={`relative h-12 border-2 overflow-hidden ${
                  shouldShowError()
                    ? "border-red-500"
                    : formIsValid && ssnValue.length === 9
                      ? "border-green-500"
                      : isFocused
                        ? "border-purple-500 ring-2 ring-purple-100"
                        : "border-gray-200"
                } rounded-lg transition-all duration-200 bg-white`}
              >
                {/* Hidden input for handling the actual value */}
                <input
                  ref={inputRef}
                  id="ssn"
                  type="text"
                  inputMode="numeric"
                  value={ssnValue}
                  onChange={handleSsnChange}
                  onPaste={handlePaste}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="sr-only"
                  autoComplete="off"
                  aria-invalid={shouldShowError()}
                  aria-describedby={shouldShowError() ? "ssn-error" : undefined}
                />

                {/* Display element with formatted SSN */}
                <div
                  className="absolute inset-0 pl-10 pr-10 flex items-center font-mono text-lg tracking-wider cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  <span className={`${ssnValue.length === 0 && !isFocused ? "text-gray-400" : "text-gray-900"}`}>
                    {ssnValue.length > 0 ? formatDisplaySSN(ssnValue) : "___-__-____"}
                  </span>
                </div>

                {/* Visibility toggle button */}
                <button
                  type="button"
                  onClick={toggleSsnVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                >
                  {showSsn ? (
                    <EyeOff className="h-5 w-5" aria-label="Hide SSN" />
                  ) : (
                    <Eye className="h-5 w-5" aria-label="Show SSN" />
                  )}
                </button>

                {/* Validation indicator */}
                {formIsValid && ssnValue.length === 9 && !shouldShowError() && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Error message - positioned with proper spacing */}
            {shouldShowError() && (
              <div id="ssn-error" className="flex items-center text-red-500 text-xs mt-2 w-full">
                <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span>Please enter a valid 9-digit Social Security Number</span>
              </div>
            )}
          </div>
        </div>

        {/* Add extra spacing before separator when error is present */}
        <div className={`${shouldShowError() ? "mt-10" : "mt-2"}`}></div>

        <Separator className="mt-4" />

        {/* Navigation Buttons */}
        <div className="pt-4 flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting || !formIsValid}
            className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Continue to Next Step"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Security Assurance Message - Repositioned below the Continue button */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-700">Your information is secured with:</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column - Encryption */}
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <path d="M21.64 3.64a1.35 1.35 0 0 0-1.94 0L16 7.34l-2-2a1.35 1.35 0 0 0-1.94 0L9.34 8.06l1.94 1.94L7.34 14l-2-2a1.35 1.35 0 0 0-1.94 0L.64 14.76a1.35 1.35 0 0 0 0 1.94l2.83 2.83a1.35 1.35 0 0 0 1.94 0L8.06 17l2 2a1.35 1.35 0 0 0 1.94 0l2.72-2.72-1.94-1.94L16 11.06l2 2a1.35 1.35 0 0 0 1.94 0l2.72-2.72a1.35 1.35 0 0 0 0-1.94z"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">256-bit encryption</p>
                <p className="text-sm text-gray-500">Protected with bank-level security</p>
              </div>
            </div>

            {/* Right column - HIPAA */}
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">HIPAA compliant</p>
                <p className="text-sm text-gray-500">Meets healthcare privacy standards</p>
              </div>
            </div>
          </div>

          {/* Bottom message */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start gap-2">
            <Shield className="h-4 w-4 text-purple-600 mt-0.5" />
            <p className="text-sm text-gray-700">
              Your {memberType === "spouse" ? "spouse's" : "dependent's"} SSN is shared only with insurance carriers and
              is protected and encrypted.
            </p>
          </div>
        </div>
      </form>
    </FamilyMemberEnrollmentLayout>
  )
}
