"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Phone, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Stepper, type Step } from "@/components/Stepper"

// Define the enrollment steps
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "verify", name: "Verify" },
  { id: "plan", name: "Plan Selection" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

export default function ContactInformationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

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
    const storedEmail = sessionStorage.getItem("userEmail") || sessionStorage.getItem("email")
    const storedPhoneNumber = sessionStorage.getItem("phoneNumber")

    if (storedEmail) setEmail(storedEmail)
    if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber)
  }, [])

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
      // Show general validation error
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save data to session storage
      sessionStorage.setItem("phoneNumber", phoneNumber)
      sessionStorage.setItem("email", email)

      // Show success toast
      toast({
        title: "Information Saved",
        description: "Your contact information has been saved successfully",
      })

      // Redirect to the address information page
      router.push(`/enroll/address-information?planId=${planId}`)
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

  const handleBack = () => {
    router.push(`/enroll/personal-information?planId=${planId}`)
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

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Personal Information
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="contact" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-6">
              <div className="absolute top-[-30px] right-[-10px]">
                <BirdyAIFloatingButton
                  title="Contact Information Help"
                  explanation="Get instant answers about providing your contact information for health insurance enrollment."
                  tips={[
                    "Learn why we need your contact information",
                    "Understand how your information is protected",
                    "Learn how we'll use your contact information",
                    "Understand how to update your contact information later",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-purple-600 mb-1">Contact Information</h1>
                <p className="text-gray-500 text-sm">Please provide your contact details</p>
              </div>
            </div>

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
                    {shouldShowError("phoneNumber") && (
                      <p className="text-red-500 text-xs">Valid phone number required</p>
                    )}
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
                      placeholder="you@example.com"
                      readOnly={!!sessionStorage.getItem("userEmail")}
                    />
                    {shouldShowError("email") && <p className="text-red-500 text-xs">Valid email required</p>}
                    {sessionStorage.getItem("userEmail") && (
                      <p className="text-gray-500 text-xs flex items-center mt-0.5">
                        <Info className="h-3 w-3 mr-1" />
                        Email from your account cannot be changed here
                      </p>
                    )}
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
                  {isSubmitting ? "Saving..." : "Continue to Address Information"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {!isFormValid && submissionAttempted && (
                  <p className="text-center text-xs text-amber-600 mt-2">
                    Please complete all required fields to continue
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
