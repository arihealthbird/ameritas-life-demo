"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  User,
  Info,
  Cigarette,
  CigaretteOff,
  Calendar,
  UserIcon as Male,
  UserIcon as Female,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { parseDateString, formatDateOfBirth, validateAgeRestrictions } from "@/utils/dateUtils"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"
import { getFamilyMemberById, updateFamilyMember } from "@/utils/familyMemberUtils"
import type { FamilyMember } from "@/components/FamilyMemberForm"
import { updateFamilyMemberCoverageStatus } from "@/utils/enrollmentUtils"

export default function FamilyMemberPersonalInfoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const familyMemberId = searchParams.get("familyMemberId")
  const memberType = searchParams.get("type") as "spouse" | "dependent"
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
  const [includedInCoverage, setIncludedInCoverage] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [originalFamilyMember, setOriginalFamilyMember] = useState<FamilyMember | null>(null)

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
    if (!familyMemberId) {
      toast({
        title: "Missing family member information",
        description: "Unable to identify which family member to edit",
        variant: "destructive",
      })
      return
    }

    // Load family member data
    const member = getFamilyMemberById(familyMemberId)
    if (member) {
      setOriginalFamilyMember(member)

      // Parse date of birth
      if (member.dateOfBirth) {
        try {
          const date = parseDateString(member.dateOfBirth)
          if (date) {
            setDateOfBirth(date)
            setDateOfBirthInput(member.dateOfBirth)

            // Check age restrictions
            const restrictions = validateAgeRestrictions(date)
            setAgeRestriction(restrictions)
          }
        } catch (e) {
          console.error("Error parsing date:", e)
        }
      }

      // Set other pre-filled values from the initial quote
      setGender(member.gender || "")
      setTobaccoUsage(member.tobaccoUsage || "")
      setIncludedInCoverage(member.includedInCoverage !== undefined ? member.includedInCoverage : true)

      // Set name fields if available
      if (member.firstName) setFirstName(member.firstName)
      if (member.lastName) setLastName(member.lastName)
    } else {
      toast({
        title: "Family member not found",
        description: "Unable to find the specified family member",
        variant: "destructive",
      })
    }
  }, [familyMemberId, memberType, toast])

  // Validate form on any input change
  useEffect(() => {
    validateForm()
  }, [firstName, lastName, dateOfBirth, gender, tobaccoUsage, ageRestriction, includedInCoverage])

  const validateForm = () => {
    // Require first name, last name, DOB, gender, and tobacco usage for all family members
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

    // Form is valid only if there are no field errors
    const formIsValid = !hasFieldErrors
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
      if (familyMemberId && originalFamilyMember) {
        const updatedMember: FamilyMember = {
          ...originalFamilyMember,
          dateOfBirth: dateOfBirthInput,
          gender: gender as "male" | "female",
          tobaccoUsage: tobaccoUsage as "smoker" | "non-smoker",
          firstName: firstName,
          lastName: lastName,
          includedInCoverage: includedInCoverage,
        }

        updateFamilyMember(updatedMember)

        // Update coverage status in the enrollment utils
        updateFamilyMemberCoverageStatus(familyMemberId, includedInCoverage)

        // If the user is a tobacco user, we need to save this information
        // for the tobacco usage page
        if (tobaccoUsage === "smoker") {
          // Create a standardized tobacco usage data object
          const tobaccoData = {
            isTobaccoUser: "yes",
            lastUsageDate: null, // This will be collected in the tobacco usage page
          }

          // Save it for this specific family member
          sessionStorage.setItem(`tobaccoUsageData_${familyMemberId}`, JSON.stringify(tobaccoData))
        }

        // Mark this family member as having started enrollment
        const enrollmentProgressJson = sessionStorage.getItem("familyMemberEnrollmentProgress") || "{}"
        const enrollmentProgress = JSON.parse(enrollmentProgressJson)
        enrollmentProgress[familyMemberId] = {
          ...enrollmentProgress[familyMemberId],
          personalInfoCompleted: true,
          lastStep: "personal",
        }
        sessionStorage.setItem("familyMemberEnrollmentProgress", JSON.stringify(enrollmentProgress))
      }

      // Show success toast
      toast({
        title: "Information Saved",
        description: `${memberType === "spouse" ? "Spouse" : "Dependent"} information has been saved successfully`,
      })

      // Always navigate to the contact information page as the next step
      router.push(
        `/enroll/family-member/contact-information?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`,
      )
    } catch (error) {
      console.error("Error saving information:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle date of birth input
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
      } else {
        setDateOfBirth(null)
        setAgeRestriction(null)
      }
    } else {
      // Clear the date if incomplete
      setDateOfBirth(null)
      setAgeRestriction(null)
    }
  }

  // Handle name input to prevent numerical characters
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: "firstName" | "lastName") => {
    const value = e.target.value

    // Only allow letters, spaces, hyphens, and apostrophes
    const sanitizedValue = value.replace(/[0-9]/g, "")

    if (field === "firstName") {
      setFirstName(sanitizedValue)
    } else {
      setLastName(sanitizedValue)
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

  // Get contextually accurate title and description based on member type
  const getContextualTitle = () => {
    return memberType === "spouse" ? "Spouse Information" : "Dependent Information"
  }

  const getContextualDescription = () => {
    return memberType === "spouse"
      ? "Please provide the personal details for your spouse"
      : "Please provide the personal details for your dependent"
  }

  const getContextualAITitle = () => {
    return memberType === "spouse" ? "Spouse Information Help" : "Dependent Information Help"
  }

  const getContextualAIExplanation = () => {
    return memberType === "spouse"
      ? "Get instant answers about providing your spouse's information for health insurance enrollment."
      : "Get instant answers about providing your dependent's information for health insurance enrollment."
  }

  const getContextualAITips = () => {
    const baseType = memberType === "spouse" ? "spouse's" : "dependent's"
    return [
      `Learn why we need your ${baseType} information`,
      "Understand how this affects your coverage",
      "Learn about coverage options for family members",
      "Understand how age affects eligibility",
    ]
  }

  // No previous step for personal information, it's the first step
  const backUrl = undefined
  const backText = undefined

  return (
    <FamilyMemberEnrollmentLayout
      currentStep="personal"
      title={getContextualTitle()}
      description={getContextualDescription()}
      aiTitle={getContextualAITitle()}
      aiExplanation={getContextualAIExplanation()}
      aiTips={getContextualAITips()}
      backUrl={backUrl}
      backText={backText}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Section */}
        <div>
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <User className="mr-1.5 h-4 w-4 text-purple-500" />
            {memberType === "spouse" ? "Spouse" : "Dependent"} Details
          </h2>

          {/* Name fields for both spouse and dependent */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* First Name */}
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => handleNameChange(e, "firstName")}
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
                onChange={(e) => handleNameChange(e, "lastName")}
                className={cn("h-8 text-sm", shouldShowError("lastName") ? "border-red-500" : "")}
                placeholder="Last name"
              />
              {shouldShowError("lastName") && <p className="text-red-500 text-xs">Required</p>}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1 mt-3">
            <label htmlFor="dob" className="block text-xs font-medium text-gray-700">
              {memberType === "spouse" ? "Spouse's" : "Dependent's"} Date of Birth{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="dob"
                placeholder="MM/DD/YYYY"
                value={dateOfBirthInput}
                onChange={handleDateOfBirthChange}
                className={cn(
                  "w-full h-8 px-3 py-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                  shouldShowError("dateOfBirth") ? "border-red-500" : "border-gray-300",
                )}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Calendar className="h-3 w-3" />
              </div>
            </div>
            {shouldShowError("dateOfBirth") && <p className="text-red-500 text-xs">Please select a date of birth</p>}

            {/* Age Warning for Dependents */}
            {dateOfBirth && ageRestriction && (
              <div
                className={cn(
                  "mt-2 p-2 rounded-md text-xs",
                  ageRestriction.isOver65
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : ageRestriction.isUnder19
                      ? memberType === "dependent"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                      : "hidden",
                )}
              >
                {ageRestriction.isOver65 && (
                  <p>
                    This person is over 65 and may be eligible for Medicare coverage instead of marketplace insurance.
                  </p>
                )}
                {ageRestriction.isUnder19 && memberType === "dependent" && (
                  <p>This dependent is under 19 and may be eligible for CHIP or Medicaid coverage.</p>
                )}
                {ageRestriction.isUnder19 && memberType !== "dependent" && (
                  <p>This person must be at least 19 years old to be enrolled as a spouse.</p>
                )}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1 mt-3">
            <label className="block text-xs font-medium text-gray-700">
              {memberType === "spouse" ? "Spouse's" : "Dependent's"} Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={cn(
                  "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                  gender === "male"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                  shouldShowError("gender") ? "border-red-300" : "",
                )}
              >
                <Male className={cn("h-3 w-3 mr-1", gender === "male" ? "text-white" : "text-gray-500")} />
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={cn(
                  "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                  gender === "female"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                  shouldShowError("gender") ? "border-red-300" : "",
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
              {memberType === "spouse" ? "Spouse's" : "Dependent's"} Tobacco Usage{" "}
              <span className="text-red-500 mr-1">*</span>
              <span className="text-gray-400 ml-1">
                <Info className="h-3 w-3" />
              </span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTobaccoUsage("non-smoker")}
                className={cn(
                  "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                  tobaccoUsage === "non-smoker"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                  shouldShowError("tobaccoUsage") ? "border-red-300" : "",
                )}
              >
                <CigaretteOff
                  className={cn("h-3 w-3 mr-1", tobaccoUsage === "non-smoker" ? "text-white" : "text-gray-500")}
                />
                Non-smoker
              </button>
              <button
                type="button"
                onClick={() => setTobaccoUsage("smoker")}
                className={cn(
                  "flex-1 h-8 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 border flex items-center justify-center",
                  tobaccoUsage === "smoker"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                  shouldShowError("tobaccoUsage") ? "border-red-300" : "",
                )}
              >
                <Cigarette className={cn("h-3 w-3 mr-1", tobaccoUsage === "smoker" ? "text-white" : "text-gray-500")} />
                Smoker
              </button>
            </div>
            {shouldShowError("tobaccoUsage") && <p className="text-red-500 text-xs">Required</p>}
          </div>

          {/* Include in Coverage */}
          <div className="space-y-1 mt-4">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer",
                  includedInCoverage ? "bg-purple-600 border-purple-600" : "border-gray-300",
                )}
                onClick={() => setIncludedInCoverage(!includedInCoverage)}
              >
                {includedInCoverage && <Check className="h-3 w-3 text-white" />}
              </div>
              <label
                className="text-sm font-medium leading-none text-gray-700 cursor-pointer"
                onClick={() => setIncludedInCoverage(!includedInCoverage)}
              >
                Include in coverage
              </label>
              {includedInCoverage && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" /> Included
                </span>
              )}
              {!includedInCoverage && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Not included
                </span>
              )}
            </div>
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
            {isSubmitting ? "Saving..." : "Save and Continue"}
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
