"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"
import { getFamilyMemberById, updateFamilyMember, getPreviousStep, getStepUrl } from "@/utils/familyMemberUtils"
import { isNotApplying, getNextEnrollmentStep, isConditionalFlowActive } from "@/utils/enrollmentUtils"

export default function FamilyMemberContactInfoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const familyMemberId = searchParams.get("familyMemberId") || ""
  const memberType = searchParams.get("type") as "spouse" | "dependent"
  const { toast } = useToast()

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [notApplying, setNotApplying] = useState(false)
  const [isConditionalFlow, setIsConditionalFlow] = useState(false)

  // Track which fields have been touched (interacted with)
  const [touchedFields, setTouchedFields] = useState({
    phoneNumber: false,
    email: false,
  })

  // Track if form submission has been attempted
  const [submissionAttempted, setSubmissionAttempted] = useState(false)

  // Form errors
  const [errors, setErrors] = useState({
    phoneNumber: false,
    email: false,
  })

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
    const isNotApplyingMember = isNotApplying(familyMemberId)
    setNotApplying(isNotApplyingMember)

    // Check if conditional flow should be active
    const conditionalFlow = isConditionalFlowActive(familyMemberId)
    setIsConditionalFlow(conditionalFlow)

    // Load family member data
    const member = getFamilyMemberById(familyMemberId)
    if (member) {
      // Set pre-filled values if they exist
      if (member.phoneNumber) setPhoneNumber(member.phoneNumber)
      if (member.email) setEmail(member.email)
    } else {
      toast({
        title: "Family member not found",
        description: "Unable to find the specified family member",
        variant: "destructive",
      })
    }
  }, [familyMemberId, toast])

  // Validate form on any input change
  useEffect(() => {
    validateForm()
  }, [phoneNumber, email])

  const validateForm = () => {
    const phoneDigits = phoneNumber.replace(/\D/g, "")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const newErrors = {
      phoneNumber: !phoneNumber.trim() || phoneDigits.length !== 10,
      email: !email.trim() || !emailRegex.test(email),
    }

    setErrors(newErrors)

    // Form is valid only if there are no field errors
    const formIsValid = !Object.values(newErrors).some(Boolean)
    setIsFormValid(formIsValid)

    return formIsValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched and set submission attempted to true
    setTouchedFields({
      phoneNumber: true,
      email: true,
    })
    setSubmissionAttempted(true)

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid",
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
            phoneNumber,
            email,
          }
          updateFamilyMember(updatedMember)
        }
      }

      // Show success toast
      toast({
        title: "Information Saved",
        description: `${memberType === "spouse" ? "Spouse" : "Dependent"} contact information has been saved successfully`,
      })

      // Always navigate to the SSN page next
      router.push(
        `/enroll/family-member/ssn-information?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`,
      )
    } catch (error) {
      console.error("Error saving contact information:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    // Navigate to the next step without saving any data
    const nextStep = getNextEnrollmentStep("contact-information")
    router.push(
      `/enroll/family-member/${nextStep}?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`,
    )
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const input = e.target.value.replace(/\D/g, "").slice(0, 10)

    // Format with parentheses and hyphen
    let formattedNumber = ""
    if (input.length <= 3) {
      formattedNumber = input
    } else if (input.length <= 6) {
      formattedNumber = `(${input.slice(0, 3)}) ${input.slice(3)}`
    } else {
      formattedNumber = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6)}`
    }

    setPhoneNumber(formattedNumber)

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      phoneNumber: true,
    }))
  }

  // Handle field change for email input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      email: true,
    }))
  }

  // Handle field blur (when user leaves a field)
  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  // Helper function to determine if an error should be shown
  const shouldShowError = (field: keyof typeof errors) => {
    return (touchedFields[field] || submissionAttempted) && errors[field]
  }

  // Get the previous step for the back button
  const previousStep = getPreviousStep("contact")
  const backUrl = previousStep ? getStepUrl(previousStep) : undefined
  const backText = previousStep ? `Back to ${previousStep.charAt(0).toUpperCase() + previousStep.slice(1)}` : undefined

  return (
    <FamilyMemberEnrollmentLayout
      currentStep="contact"
      title={`${memberType === "spouse" ? "Spouse" : "Dependent"} Contact Information`}
      description={`Please provide contact details for your ${memberType === "spouse" ? "spouse" : "dependent"}`}
      aiTitle={`${memberType === "spouse" ? "Spouse" : "Dependent"} Contact Information Help`}
      aiExplanation={`Get instant answers about providing your ${memberType === "spouse" ? "spouse's" : "dependent's"} contact information for health insurance enrollment.`}
      aiTips={[
        `Learn why we need your ${memberType === "spouse" ? "spouse's" : "dependent's"} contact information`,
        "Understand how this information is protected",
        "Learn how we'll use this contact information",
        "Understand how to update contact information later",
      ]}
      backUrl={backUrl}
      backText={backText}
      showSkip={notApplying || isConditionalFlow}
      onSkip={handleSkip}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div>
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <Phone className="mr-1.5 h-4 w-4 text-purple-500" />
            Contact Details
          </h2>
          <div className="space-y-3">
            {/* Phone Number */}
            <div className="space-y-1">
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("phoneNumber")}
                className={cn("h-8 text-sm", shouldShowError("phoneNumber") ? "border-red-500" : "")}
                placeholder="(123) 456-7890"
                maxLength={14}
              />
              {shouldShowError("phoneNumber") && <p className="text-red-500 text-xs">Valid phone number required</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                className={cn("h-8 text-sm", shouldShowError("email") ? "border-red-500" : "")}
                placeholder="email@example.com"
              />
              {shouldShowError("email") && <p className="text-red-500 text-xs">Valid email required</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={cn(
              "w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all",
              isFormValid ? "hover:shadow-md opacity-100" : "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Saving..." : "Continue to Next Step"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          {!isFormValid && submissionAttempted && (
            <p className="text-center text-xs text-amber-600 mt-2">Please complete all required fields to continue</p>
          )}
        </div>
      </form>
    </FamilyMemberEnrollmentLayout>
  )
}
