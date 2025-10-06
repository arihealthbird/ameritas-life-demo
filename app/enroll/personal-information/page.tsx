"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  User,
  Info,
  Cigarette,
  CigaretteOff,
  Calendar,
  AlertCircle,
  UserIcon as Male,
  UserIcon as Female,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { parseDateString, formatDateOfBirth, validateAgeRestrictions } from "@/utils/dateUtils"
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

export default function PersonalInformationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirthInput, setDateOfBirthInput] = useState<string>("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [ageRestriction, setAgeRestriction] = useState<{ isUnder19: boolean; isOver65: boolean; age: number } | null>(
    null,
  )
  const [gender, setGender] = useState("")
  const [tobaccoUsage, setTobaccoUsage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [showAgePopup, setShowAgePopup] = useState(false)

  // Track which fields have been touched (interacted with)
  const [touchedFields, setTouchedFields] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    gender: false,
    tobaccoUsage: false,
  })

  // Track if form submission has been attempted
  const [submissionAttempted, setSubmissionAttempted] = useState(false)

  // Form errors
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    gender: false,
    tobaccoUsage: false,
  })

  // Load pre-filled data from session storage
  useEffect(() => {
    // Get data from session storage
    const storedDateOfBirth = sessionStorage.getItem("dateOfBirth")
    const storedGender = sessionStorage.getItem("gender")
    const storedTobaccoUsage = sessionStorage.getItem("tobaccoUsage")
    const storedFirstName = sessionStorage.getItem("firstName")
    const storedLastName = sessionStorage.getItem("lastName")

    // Parse date of birth
    if (storedDateOfBirth) {
      try {
        const date = new Date(storedDateOfBirth)
        if (!isNaN(date.getTime())) {
          setDateOfBirth(date)
          const month = (date.getMonth() + 1).toString().padStart(2, "0")
          const day = date.getDate().toString().padStart(2, "0")
          const year = date.getFullYear()
          setDateOfBirthInput(`${month}/${day}/${year}`)

          // Check age restrictions
          const restrictions = validateAgeRestrictions(date)
          setAgeRestriction(restrictions)

          // Show age popup if there are restrictions
          if (restrictions.isUnder19 || restrictions.isOver65) {
            setShowAgePopup(true)
          }
        }
      } catch (e) {
        console.error("Error parsing date:", e)
      }
    }

    // Set other pre-filled values
    if (storedGender) setGender(storedGender)
    if (storedTobaccoUsage) {
      // Convert old yes/no values to smoker/non-smoker
      if (storedTobaccoUsage === "yes") {
        setTobaccoUsage("smoker")
      } else if (storedTobaccoUsage === "no") {
        setTobaccoUsage("non-smoker")
      } else {
        setTobaccoUsage(storedTobaccoUsage)
      }
    }
    if (storedFirstName) setFirstName(storedFirstName)
    if (storedLastName) setLastName(storedLastName)
  }, [])

  // Validate form on any input change
  useEffect(() => {
    validateForm()
  }, [firstName, lastName, dateOfBirth, gender, tobaccoUsage, ageRestriction])

  const validateForm = () => {
    const newErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      dateOfBirth: !dateOfBirth,
      gender: !gender,
      tobaccoUsage: !tobaccoUsage,
    }

    setErrors(newErrors)

    // Check if any field has an error
    const hasFieldErrors = Object.values(newErrors).some(Boolean)

    // Check if there are age restrictions - only block for over 65
    const hasBlockingAgeRestrictions = ageRestriction && ageRestriction.isOver65

    // Form is valid if there are no field errors AND no blocking age restrictions (over 65)
    const formIsValid = !hasFieldErrors && !hasBlockingAgeRestrictions
    setIsFormValid(formIsValid)

    return formIsValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched and set submission attempted to true
    setTouchedFields({
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      tobaccoUsage: true,
    })
    setSubmissionAttempted(true)

    if (!validateForm()) {
      // If there are age restrictions for over 65, show specific message
      if (ageRestriction && ageRestriction.isOver65) {
        toast({
          title: "Age Restriction",
          description: "You must be under 65 years old to continue.",
          variant: "destructive",
        })
        return
      }

      // Otherwise show general validation error
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
      sessionStorage.setItem("firstName", firstName)
      sessionStorage.setItem("lastName", lastName)

      // Save date of birth
      if (dateOfBirth) {
        sessionStorage.setItem("dateOfBirth", dateOfBirth.toISOString())
      }

      // Convert smoker/non-smoker to yes/no for compatibility with existing code
      const tobaccoYesNo = tobaccoUsage === "smoker" ? "yes" : "no"
      sessionStorage.setItem("tobaccoUsage", tobaccoYesNo)

      // Show success toast
      toast({
        title: "Information Saved",
        description: "Your personal information has been saved successfully",
      })

      // Redirect to the contact information page
      router.push(`/enroll/contact-information?planId=${planId}`)
    } catch (error) {
      console.error("Error saving personal information:", error)
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
    router.push(`/enroll/create-account?planId=${planId}`)
  }

  // Handle date of birth input for primary applicant
  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatDateOfBirth(value)

    // Update the input value
    setDateOfBirthInput(formatted)

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      dateOfBirth: true,
    }))

    // Try to parse the date if we have a complete format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
      const parsedDate = parseDateString(formatted)

      // Check if the date is valid
      if (parsedDate) {
        setDateOfBirth(parsedDate)
        setErrors({ ...errors, dateOfBirth: false })

        // Check age restrictions
        const restrictions = validateAgeRestrictions(parsedDate)
        setAgeRestriction(restrictions)

        // Show age popup if there are restrictions
        if (restrictions.isUnder19 || restrictions.isOver65) {
          setShowAgePopup(true)
        } else {
          setShowAgePopup(false)
        }
      } else {
        setDateOfBirth(null)
        setAgeRestriction(null)
        setShowAgePopup(false)
      }
    } else {
      // Clear the date if incomplete
      setDateOfBirth(null)
      setAgeRestriction(null)
      setShowAgePopup(false)
    }
  }

  // Handle field blur (when user leaves a field)
  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  // Handle field change for text inputs
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: "firstName" | "lastName") => {
    if (field === "firstName") {
      setFirstName(e.target.value)
    } else if (field === "lastName") {
      setLastName(e.target.value)
    }

    // Mark field as touched
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
            Back
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="personal" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-6">
              <div className="absolute top-[-30px] right-[-10px]">
                <BirdyAIFloatingButton
                  title="Personal Information Help"
                  explanation="Get instant answers about providing your personal information for health insurance enrollment."
                  tips={[
                    "Learn why we need your personal information",
                    "Understand how your information is protected",
                    "Learn about tobacco usage classification",
                    "Understand how your information affects your coverage",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-purple-600 mb-1">Personal Information</h1>
                <p className="text-gray-500 text-sm">Please provide your personal details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details Section */}
              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="mr-1.5 h-4 w-4 text-purple-500" />
                  Personal Details
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {/* First Name */}
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => handleFieldChange(e, "firstName")}
                      onBlur={() => handleBlur("firstName")}
                      className={cn("h-8 text-sm", shouldShowError("firstName") ? "border-red-500" : "")}
                      placeholder="First name"
                    />
                    {shouldShowError("firstName") && <p className="text-red-500 text-xs">Required</p>}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => handleFieldChange(e, "lastName")}
                      onBlur={() => handleBlur("lastName")}
                      className={cn("h-8 text-sm", shouldShowError("lastName") ? "border-red-500" : "")}
                      placeholder="Last name"
                    />
                    {shouldShowError("lastName") && <p className="text-red-500 text-xs">Required</p>}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1 mt-3">
                  <label htmlFor="dob" className="block text-xs font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="dob"
                      placeholder="MM/DD/YYYY"
                      value={dateOfBirthInput}
                      onChange={handleDateOfBirthChange}
                      onBlur={() => handleBlur("dateOfBirth")}
                      className={cn(
                        "w-full h-8 px-3 py-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                        shouldShowError("dateOfBirth")
                          ? "border-red-500"
                          : ageRestriction && (ageRestriction.isUnder19 || ageRestriction.isOver65)
                            ? "border-amber-500"
                            : "border-gray-300",
                      )}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Calendar className="h-3 w-3" />
                    </div>
                  </div>
                  {shouldShowError("dateOfBirth") && (
                    <p className="text-red-500 text-xs">Please select your date of birth</p>
                  )}

                  {/* Age Restriction Popup */}
                  {showAgePopup && ageRestriction && (
                    <div
                      className={cn(
                        "mt-2 p-3 rounded-lg border shadow-sm",
                        ageRestriction.isUnder19 ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200",
                      )}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {ageRestriction.isUnder19 ? (
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Info className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="ml-2">
                          <h3 className="text-sm font-medium text-gray-800">
                            {ageRestriction.isUnder19 ? "Age Restriction" : "Medicare Eligibility"}
                          </h3>
                          <div className="mt-1 text-xs text-gray-700">
                            {ageRestriction.isUnder19 ? (
                              <>
                                <p>
                                  You are {ageRestriction.age} years old, which is under the minimum age of 19 for
                                  primary applicants.
                                </p>
                                <p className="mt-1">
                                  You may be eligible for Medicaid or CHIP coverage instead of a marketplace plan.
                                </p>
                                <p className="mt-2 font-medium">
                                  Please contact our support team for assistance with your application.
                                </p>
                              </>
                            ) : (
                              <>
                                <p>
                                  You are {ageRestriction.age} years old, which means you may be eligible for Medicare
                                  coverage.
                                </p>
                                <p className="mt-1">Medicare is typically available for individuals 65 and older.</p>
                                <p className="mt-2 font-medium">
                                  Please contact our Medicare specialists for assistance with your coverage options.
                                </p>
                              </>
                            )}
                          </div>
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => setShowAgePopup(false)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1 mt-3">
                  <label htmlFor="gender" className="block text-xs font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className={cn("flex gap-2", shouldShowError("gender") ? "border-red-500" : "")}>
                    <button
                      type="button"
                      onClick={() => {
                        setGender("male")
                        setTouchedFields((prev) => ({
                          ...prev,
                          gender: true,
                        }))
                      }}
                      className={cn(
                        "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                        gender === "male"
                          ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <Male className={cn("h-3 w-3 mr-1", gender === "male" ? "text-white" : "text-gray-500")} />
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGender("female")
                        setTouchedFields((prev) => ({
                          ...prev,
                          gender: true,
                        }))
                      }}
                      className={cn(
                        "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                        gender === "female"
                          ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <Female className={cn("h-3 w-3 mr-1", gender === "female" ? "text-white" : "text-gray-500")} />
                      Female
                    </button>
                  </div>
                  {shouldShowError("gender") && <p className="text-red-500 text-xs">Required</p>}
                </div>

                {/* Tobacco Usage */}
                <div className="space-y-1 mt-3">
                  <label htmlFor="tobaccoUsage" className="block text-xs font-medium text-gray-700 flex items-center">
                    Tobacco Usage <span className="text-red-500 mr-1">*</span>
                    <span className="text-gray-400 ml-1">
                      <Info className="h-3 w-3" />
                    </span>
                  </label>
                  <div className={cn("flex gap-2", shouldShowError("tobaccoUsage") ? "border-red-500" : "")}>
                    <button
                      type="button"
                      onClick={() => {
                        setTobaccoUsage("non-smoker")
                        setTouchedFields((prev) => ({
                          ...prev,
                          tobaccoUsage: true,
                        }))
                      }}
                      className={cn(
                        "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                        tobaccoUsage === "non-smoker"
                          ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <CigaretteOff
                        className={cn("h-3 w-3 mr-1", tobaccoUsage === "non-smoker" ? "text-white" : "text-gray-500")}
                      />
                      Non-smoker
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTobaccoUsage("smoker")
                        setTouchedFields((prev) => ({
                          ...prev,
                          tobaccoUsage: true,
                        }))
                      }}
                      className={cn(
                        "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                        tobaccoUsage === "smoker"
                          ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <Cigarette
                        className={cn("h-3 w-3 mr-1", tobaccoUsage === "smoker" ? "text-white" : "text-gray-500")}
                      />
                      Smoker
                    </button>
                  </div>
                  {shouldShowError("tobaccoUsage") && <p className="text-red-500 text-xs">Required</p>}
                </div>
              </div>

              <Separator className="my-2" />

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
                  {isSubmitting ? "Saving..." : "Continue to Contact Information"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {!isFormValid && ageRestriction && ageRestriction.isOver65 && (
                  <p className="text-center text-xs text-amber-600 mt-2">
                    You must be under 65 years old to continue with enrollment.
                  </p>
                )}
                {!isFormValid && !ageRestriction && submissionAttempted && (
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
