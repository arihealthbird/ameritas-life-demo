"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Cigarette, CigaretteOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import type { FamilyMember } from "@/components/FamilyMemberForm"
import SimpleHeader from "@/components/SimpleHeader"
import { parseDateString, formatDateOfBirth, calculateAge } from "@/utils/dateUtils"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { FamilyMemberFormRef } from "@/components/FamilyMemberForm"

// Import the BackButton component
import BackButton from "@/components/BackButton"
// Import the simplified version
import { SimpleParticles } from "@/components/ui/simple-particles"

// Define a type for age validation issues
type AgeValidationIssue = {
  type: "spouse" | "dependent"
  index?: number // For dependents
  age: number
  isOver65: boolean
}

export default function DateOfBirthPage() {
  const router = useRouter()
  const [dateOfBirthInput, setDateOfBirthInput] = useState<string>("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [gender, setGender] = useState<string | undefined>(undefined)
  const [tobaccoUsage, setTobaccoUsage] = useState<string | undefined>(undefined)
  const [healthStatus, setHealthStatus] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({
    dateOfBirth: false,
    gender: false,
    tobaccoUsage: false,
    healthStatus: false,
  })

  // Add a state to track if the date field has been touched
  const [dateFieldTouched, setDateFieldTouched] = useState(false)

  // Primary applicant age validation states
  const [primaryApplicantAge, setPrimaryApplicantAge] = useState<number | null>(null)
  const [isPrimaryOver65, setIsPrimaryOver65] = useState<boolean>(false)
  const [isPrimaryAgeValid, setIsPrimaryAgeValid] = useState<boolean>(true)

  // Consolidated age validation state for family members only (over 65)
  const [showAgeValidationDialog, setShowAgeValidationDialog] = useState(false)
  const [ageValidationIssues, setAgeValidationIssues] = useState<AgeValidationIssue[]>([])

  // Family members state
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

  // Form completeness tracking
  const [formCompleteness, setFormCompleteness] = useState<Record<string, boolean>>({
    primary: false,
  })

  // Form data tracking
  const [pendingFamilyMembers, setPendingFamilyMembers] = useState<Record<string, FamilyMember>>({})

  // Spouse form state
  const [showSpouseForm, setShowSpouseForm] = useState(false)
  const [spouseFormId, setSpouseFormId] = useState<string | null>(null)

  // Dependent form states
  const [dependentForms, setDependentForms] = useState<string[]>([])

  const [isFormValid, setIsFormValid] = useState(false)

  // Form refs
  const spouseFormRef = useRef<FamilyMemberFormRef>(null)
  const dependentFormRefs = useRef<Record<string, FamilyMemberFormRef | null>>({})

  // Handle close age validation dialog
  const handleCloseAgeValidationDialog = useCallback(() => {
    setShowAgeValidationDialog(false)

    // Combine existing family members with pending ones
    const allFamilyMembers = [...familyMembers, ...Object.values(pendingFamilyMembers)]

    // Calculate household size including all family members regardless of coverage status
    const householdSize = 1 + allFamilyMembers.length // 1 for primary applicant + all family members

    // Save to session storage
    sessionStorage.setItem("dateOfBirth", dateOfBirth?.toISOString() || "")
    sessionStorage.setItem("gender", gender || "")
    sessionStorage.setItem("tobaccoUsage", tobaccoUsage || "")
    sessionStorage.setItem("healthStatus", healthStatus || "")
    sessionStorage.setItem("familyMembers", JSON.stringify(allFamilyMembers))
    sessionStorage.setItem("householdSize", householdSize.toString())

    // Save primary applicant age to session storage for household page
    if (primaryApplicantAge !== null) {
      sessionStorage.setItem("primaryApplicantAge", primaryApplicantAge.toString())
    }

    // Navigate to household page
    router.push("/household")
  }, [
    dateOfBirth,
    gender,
    tobaccoUsage,
    familyMembers,
    pendingFamilyMembers,
    router,
    primaryApplicantAge,
    healthStatus,
  ])

  // Find the back button handler
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  // Update primary applicant form validity
  useEffect(() => {
    const isPrimaryComplete = !!dateOfBirth && !!gender && !!tobaccoUsage && !!healthStatus

    setFormCompleteness((prev) => ({
      ...prev,
      primary: isPrimaryComplete,
    }))
  }, [dateOfBirth, gender, tobaccoUsage, healthStatus])

  // Update overall form validity whenever any form's completeness changes
  useEffect(() => {
    // Check if primary applicant form is complete
    const isPrimaryComplete = formCompleteness.primary

    // Check if all family member forms are complete
    const allFormsComplete = Object.values(formCompleteness).every((isComplete) => isComplete)

    // Form is valid if primary is complete and all family member forms are complete
    // AND primary applicant age is valid (not over 65)
    setIsFormValid(isPrimaryComplete && allFormsComplete && isPrimaryAgeValid)
  }, [formCompleteness, isPrimaryAgeValid])

  // Add a function to check if a date is valid
  const isValidDate = (date: Date, inputString: string): boolean => {
    // Check if the date is valid (not NaN)
    if (isNaN(date.getTime())) return false

    // Additional check to ensure the date is real
    // For example, February 30 would be converted to March 2 by JavaScript
    // So we need to check if the month is the same as what was input
    const month = date.getMonth() + 1 // JavaScript months are 0-indexed
    const day = date.getDate()

    // Extract the month and day from the input string
    const parts = inputString.split("/")
    const inputMonth = Number.parseInt(parts[0], 10)
    const inputDay = Number.parseInt(parts[1], 10)

    // Check if the parsed date matches the input date
    return month === inputMonth && day === inputDay
  }

  // Modify the handleDateOfBirthChange function to include better validation
  const handleDateOfBirthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const formatted = formatDateOfBirth(value)

      // Update the input value
      setDateOfBirthInput(formatted)

      // Try to parse the date if we have a complete format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
        const parsedDate = parseDateString(formatted)

        // Check if the date is valid
        if (parsedDate && isValidDate(parsedDate, formatted)) {
          setDateOfBirth(parsedDate)
          setFormErrors((prev) => ({ ...prev, dateOfBirth: false }))

          // Check age restrictions
          const age = calculateAge(parsedDate)
          setPrimaryApplicantAge(age)

          // Only check for over 65 on this page
          const isOver65 = age > 65
          setIsPrimaryOver65(isOver65)

          // Age is valid if not over 65
          setIsPrimaryAgeValid(!isOver65)
        } else {
          setDateOfBirth(null)
          setPrimaryApplicantAge(null)
          setIsPrimaryOver65(false)
          setIsPrimaryAgeValid(true)
          if (dateFieldTouched) {
            setFormErrors((prev) => ({ ...prev, dateOfBirth: true }))
          }
        }
      } else {
        // Clear the date if incomplete
        setDateOfBirth(null)
        setPrimaryApplicantAge(null)
        setIsPrimaryOver65(false)
        setIsPrimaryAgeValid(true)
        if (formatted && dateFieldTouched) {
          setFormErrors((prev) => ({ ...prev, dateOfBirth: true }))
        }
      }
    },
    [dateFieldTouched],
  )

  // Add handlers for field focus and blur
  const handleDateFieldFocus = () => {
    // Don't set touched on focus to avoid immediate validation
  }

  const handleDateFieldBlur = () => {
    setDateFieldTouched(true)
    // Validate on blur if there's a value
    if (dateOfBirthInput) {
      if (!dateOfBirth) {
        setFormErrors((prev) => ({ ...prev, dateOfBirth: true }))
      }
    }
  }

  // Validate primary applicant form before submission
  const validateForm = useCallback((): boolean => {
    const errors = {
      dateOfBirth: !dateOfBirth,
      gender: !gender,
      tobaccoUsage: !tobaccoUsage,
      healthStatus: !healthStatus,
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }, [dateOfBirth, gender, tobaccoUsage, healthStatus])

  // Handle form change for family members - use useCallback to prevent recreation on every render
  const handleFamilyMemberFormChange = useCallback((formId: string, isComplete: boolean, formData?: FamilyMember) => {
    // Update form completeness
    setFormCompleteness((prev) => {
      // Only update if the value changed to avoid unnecessary renders
      if (prev[formId] === isComplete) {
        return prev
      }
      return {
        ...prev,
        [formId]: isComplete,
      }
    })

    // If form is complete and we have data, store it
    if (isComplete && formData) {
      setPendingFamilyMembers((prev) => {
        // Check if the data actually changed
        const currentData = prev[formId]
        if (
          currentData &&
          currentData.dateOfBirth === formData.dateOfBirth &&
          currentData.gender === formData.gender &&
          currentData.tobaccoUsage === formData.tobaccoUsage &&
          currentData.includedInCoverage === formData.includedInCoverage
        ) {
          return prev
        }
        return {
          ...prev,
          [formId]: formData,
        }
      })
    }
  }, [])

  // Check for age restrictions before submission - only for family members over 65
  const checkFamilyMemberAgeRestrictions = useCallback((): boolean => {
    const issues: AgeValidationIssue[] = []

    // Check spouse for over 65 only
    if (showSpouseForm && spouseFormId && pendingFamilyMembers[spouseFormId]) {
      const spouse = pendingFamilyMembers[spouseFormId]
      // Only check if the spouse is included in coverage
      if (spouse.dateOfBirth && spouse.includedInCoverage !== false) {
        const parsedDate = parseDateString(spouse.dateOfBirth)
        if (parsedDate) {
          const age = calculateAge(parsedDate)
          const isOver65 = age > 65

          if (isOver65) {
            issues.push({
              type: "spouse",
              age,
              isOver65,
            })
          }
        }
      }
    }

    // Check dependents for over 65 only
    dependentForms.forEach((formId, index) => {
      if (pendingFamilyMembers[formId]) {
        const dependent = pendingFamilyMembers[formId]
        // Only check if the dependent is included in coverage
        if (dependent.dateOfBirth && dependent.includedInCoverage !== false) {
          const parsedDate = parseDateString(dependent.dateOfBirth)
          if (parsedDate) {
            const age = calculateAge(parsedDate)
            const isOver65 = age > 65

            if (isOver65) {
              issues.push({
                type: "dependent",
                index: index + 1,
                age,
                isOver65,
              })
            }
          }
        }
      }
    })

    // If we have issues, show the dialog
    if (issues.length > 0) {
      setAgeValidationIssues(issues)
      setShowAgeValidationDialog(true)
      return true
    }

    return false
  }, [showSpouseForm, spouseFormId, pendingFamilyMembers, dependentForms])

  const proceedToNextStep = useCallback(() => {
    // Combine existing family members with pending ones
    const allFamilyMembers = [...familyMembers, ...Object.values(pendingFamilyMembers)]

    // Calculate household size including all family members regardless of coverage status
    const householdSize = 1 + allFamilyMembers.length // 1 for primary applicant + all family members

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would save this data to state/context or API
      console.log({
        dateOfBirth,
        gender,
        tobaccoUsage,
        healthStatus,
        age: dateOfBirth ? calculateAge(dateOfBirth) : null,
        familyMembers: allFamilyMembers,
        householdSize: householdSize,
      })

      // Save to session storage
      sessionStorage.setItem("dateOfBirth", dateOfBirth?.toISOString() || "")
      sessionStorage.setItem("gender", gender!)
      sessionStorage.setItem("tobaccoUsage", tobaccoUsage!)
      sessionStorage.setItem("healthStatus", healthStatus!)
      sessionStorage.setItem("familyMembers", JSON.stringify(allFamilyMembers))
      sessionStorage.setItem("householdSize", householdSize.toString())

      // Save primary applicant age to session storage for household page
      if (primaryApplicantAge !== null) {
        sessionStorage.setItem("primaryApplicantAge", primaryApplicantAge.toString())
      }

      // Add a slight delay to allow for exit animation
      setTimeout(() => {
        // Navigate to household page
        router.push("/household")
      }, 300)
    }, 1000)
  }, [
    dateOfBirth,
    gender,
    tobaccoUsage,
    familyMembers,
    pendingFamilyMembers,
    router,
    primaryApplicantAge,
    healthStatus,
  ])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Validate all forms
      const isPrimaryValid = validateForm()

      if (!isPrimaryValid) {
        // Scroll to the first error
        return
      }

      // Check for age restrictions in family members before proceeding (only over 65)
      const hasFamilyMemberAgeRestrictions = checkFamilyMemberAgeRestrictions()
      if (hasFamilyMemberAgeRestrictions) {
        // The consolidated age validation dialog will be shown for family members
        return
      }

      setIsSubmitting(true)
      proceedToNextStep()
    },
    [validateForm, checkFamilyMemberAgeRestrictions, proceedToNextStep],
  )

  // Update the handleAddSpouse function
  const handleAddSpouse = useCallback(() => {
    const newSpouseId = `spouse-${Date.now()}`
    setSpouseFormId(newSpouseId)
    setShowSpouseForm(true)

    // Add to form completeness tracking with initial value of false
    setFormCompleteness((prev) => ({
      ...prev,
      [newSpouseId]: false,
    }))

    // Scroll to the spouse form after it renders
    setTimeout(() => {
      const spouseFormElement = document.getElementById(newSpouseId)
      if (spouseFormElement) {
        spouseFormElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)

    return newSpouseId
  }, [])

  // Update the handleCancelSpouse function
  const handleCancelSpouse = useCallback(() => {
    if (spouseFormId) {
      // Remove from form completeness tracking
      setFormCompleteness((prev) => {
        const newState = { ...prev }
        delete newState[spouseFormId]
        return newState
      })

      // Remove from pending family members
      setPendingFamilyMembers((prev) => {
        const newState = { ...prev }
        delete newState[spouseFormId]
        return newState
      })
    }

    setShowSpouseForm(false)
    setSpouseFormId(null)
  }, [spouseFormId])

  // Update the handleAddDependent function
  const handleAddDependent = useCallback(() => {
    const dependentId = `dependent-${Date.now()}`

    // Add to dependent forms
    setDependentForms((prev) => [...prev, dependentId])

    // Add to form completeness tracking with initial value of false
    setFormCompleteness((prev) => ({
      ...prev,
      [dependentId]: false,
    }))

    // Scroll to the dependent form after it renders
    setTimeout(() => {
      const dependentFormElement = document.getElementById(dependentId)
      if (dependentFormElement) {
        dependentFormElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)

    return dependentId
  }, [])

  // Update the handleRemoveDependent function
  const handleRemoveDependent = useCallback((id: string) => {
    // Remove from dependent forms
    setDependentForms((prev) => prev.filter((formId) => formId !== id))

    // Remove from form completeness tracking
    setFormCompleteness((prev) => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })

    // Remove from pending family members
    setPendingFamilyMembers((prev) => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })

    // Remove ref
    if (dependentFormRefs.current[id]) {
      delete dependentFormRefs.current[id]
    }
  }, [])

  const hasSpouse = familyMembers.some((member) => member.type === "spouse") || showSpouseForm

  return (
    <div>
      <SimpleHeader />
      {/* Ensure the parent div has position: relative */}
      <div className="min-h-screen bg-white relative overflow-hidden">
        <SimpleParticles
          className="absolute inset-0 -z-10 pointer-events-none"
          quantity={100}
          color="#fc3893"
          size={0.5}
        />

        <div className="max-w-xl mx-auto px-4 py-12">
          {/* Container to align BackButton with card */}
          <div className="max-w-md mx-auto mb-0 h-10">
            <BackButton />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 relative z-10 max-w-md mx-auto">
            {/* Position Birdy AI button at the top right corner of the card */}
            <div className="absolute -top-4 -right-4 z-20">
              <BirdyAIFloatingButton
                title="Health Insurance Help"
                explanation="Get instant answers about health insurance, enrollment process, and coverage options."
                tips={[
                  "Ask about age requirements for health plans",
                  "Learn about coverage for family members",
                  "Understand how tobacco usage affects rates",
                ]}
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Your Details
              </h1>
              <p className="text-gray-600">Quick and easy — we'll find your perfect coverage in seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Date of Birth - Removed tooltip */}
              <div className="space-y-2">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-800">
                  Your Date of Birth
                </label>

                <div className="relative max-w-sm">
                  <input
                    type="text"
                    id="dob"
                    placeholder="MM/DD/YYYY"
                    value={dateOfBirthInput}
                    onChange={handleDateOfBirthChange}
                    onFocus={handleDateFieldFocus}
                    onBlur={handleDateFieldBlur}
                    className={cn(
                      "w-full h-12 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                      formErrors.dateOfBirth && dateFieldTouched
                        ? "border-red-500"
                        : isPrimaryOver65
                          ? "border-blue-300"
                          : "border-gray-300",
                    )}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                {formErrors.dateOfBirth && dateFieldTouched && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid date in MM/DD/YYYY format</p>
                )}

                {/* Medicare Notice - Only show for over 65 */}
                {dateOfBirth && isPrimaryOver65 && (
                  <div
                    className="mt-3 p-4 rounded-lg border shadow-sm transition-all duration-300
                      bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium mb-1">
                          <span className="text-blue-700">Medicare Eligibility Notice</span>
                        </h3>
                        <div className="text-sm">
                          <div className="text-blue-600">
                            <p>
                              You are {primaryApplicantAge} years old. You may be eligible for Medicare, which is
                              typically the primary health insurance option for individuals 65 and older.
                            </p>
                            <p className="mt-2">
                              While you can still apply for a Marketplace plan, Medicare may offer better coverage
                              options for your needs. The "Continue" button is disabled until you update your date of
                              birth.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800">Your Gender</label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm",
                      gender === "male"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.gender ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setGender("male")
                      setFormErrors((prev) => ({ ...prev, gender: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => {
                        setGender("male")
                        setFormErrors((prev) => ({ ...prev, gender: false }))
                      }}
                      className="sr-only"
                    />
                    <Label htmlFor="male" className="flex items-center justify-center cursor-pointer w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className={cn(
                          "h-4 w-4 mr-2",
                          gender === "male" ? "text-white fill-current" : "text-gray-700 fill-current",
                        )}
                      >
                        <path d="M320 128c0-5.5-.5-10.8-1.3-16l-30.1 0c-14.9 0-29.1-5.9-39.6-16.4l-6.3-6.3C223.4 113.5 194 128 162.3 128L128 128l0 16c0 53 43 96 96 96s96-43 96-96l0-16zM307.2 80C290.6 51.3 259.5 32 224 32c-41.8 0-77.4 26.7-90.5 64l28.9 0c26.7 0 51.2-15 63.2-38.9c.8-1.6 1.8-3.1 3.1-4.5c6.2-6.2 16.4-6.2 22.6 0L271.6 73c4.5 4.5 10.6 7 17 7l18.6 0zM96 128C96 57.3 153.3 0 224 0s128 57.3 128 128l0 16c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-16zM32 480L416 480c-1.9-71-60-128-131.5-128l-120.9 0C92.1 352 33.9 409 32 480zM0 483.6C0 393.2 73.2 320 163.6 320l120.9 0C374.8 320 448 393.2 448 483.6c0 15.7-12.7 28.4-28.4 28.4L28.4 512C12.7 512 0 499.3 0 483.6z" />
                      </svg>
                      <span className="font-medium">Male</span>
                    </Label>
                  </div>

                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-pink-300 hover:bg-pink-50 hover:shadow-sm",
                      gender === "female"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.gender ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setGender("female")
                      setFormErrors((prev) => ({ ...prev, gender: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => {
                        setGender("female")
                        setFormErrors((prev) => ({ ...prev, gender: false }))
                      }}
                      className="sr-only"
                    />
                    <Label htmlFor="female" className="flex items-center justify-center cursor-pointer w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className={cn(
                          "h-4 w-4 mr-2",
                          gender === "female" ? "text-white fill-current" : "text-gray-700 fill-current",
                        )}
                      >
                        <path d="M320 128c0-5.5-.5-10.8-1.3-16l-30.1 0c-14.9 0-29.1-5.9-39.6-16.4l-6.3-6.3C223.4 113.5 194 128 162.3 128L128 128l0 16c0 53 43 96 96 96s96-43 96-96l0-16zM224 0c70.7 0 128 57.3 128 128c0 35.3 16.6 68.4 44.8 89.6l4.3 3.2c9.4 7.1 14.9 18.1 14.9 29.9c0 20.6-16.7 37.3-37.3 37.3L320 288c-8.8 0-16-7.2-16-16s7.2-16 16-16l58.7 0c2.9 0 5.3-2.4 5.3-5.3c0-1.7-.8-3.3-2.1-4.3l-4.3-3.2c-15.8-11.9-28.8-26.7-38.4-43.4C318.5 242.6 274.7 272 224 272s-94.5-29.4-115.2-72.2c-9.6 16.7-22.6 31.5-38.4 43.4l-4.3 3.2c-1.3 1-2.1 2.6-2.1 4.3c0 2.9 2.4 5.3 5.3 5.3l58.7 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-58.7 0C48.7 288 32 271.3 32 250.7c0-11.8 5.5-22.8 14.9-29.9l4.3-3.2C79.4 196.4 96 163.3 96 128C96 57.3 153.3 0 224 0zm4.7 52.7c6.2-6.2 16.4-6.2 22.6 0L271.6 73c4.5 4.5 10.6 7 17 7l18.6 0C290.6 51.3 259.5 32 224 32c-41.8 0-77.4 26.7-90.5 64l28.9 0c26.7 0 51.2-15 63.2-38.9c.8-1.6 1.8-3.1 3.1-4.5c6.2-6.2 16.4-6.2 22.6 0L271.6 73c4.5 4.5 10.6 7 17 7l18.6 0zM32 480L416 480c-1.9-71-60-128-131.5-128l-120.9 0C92.1 352 33.9 409 32 480zM0 483.6C0 393.2 73.2 320 163.6 320l120.9 0C374.8 320 448 393.2 448 483.6c0 15.7-12.7 28.4-28.4 28.4L28.4 512C12.7 512 0 499.3 0 483.6z" />
                      </svg>
                      <span className="font-medium">Female</span>
                    </Label>
                  </div>
                </div>

                {formErrors.gender && <p className="text-red-500 text-sm mt-1">Please select your gender</p>}
              </div>

              {/* Tobacco Usage */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <label className="block text-sm font-medium text-gray-800">Tobacco Usage</label>
                  <div className="relative group">
                    <div className="cursor-help text-gray-400 hover:text-gray-600">
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
                        className="lucide lucide-help-circle"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
                      If you use tobacco, you may have to pay more for your insurance. If you get a tobacco-related
                      illness and don't tell your insurance company, they may not cover the costs.
                      <div className="absolute left-0 top-full w-3 h-3 -mt-1 ml-2 transform rotate-45 bg-gray-800"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-pink-300 hover:shadow-sm",
                      tobaccoUsage === "non-smoker"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.tobaccoUsage ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setTobaccoUsage("non-smoker")
                      setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="non-smoker"
                      name="tobaccoUsage"
                      value="non-smoker"
                      checked={tobaccoUsage === "non-smoker"}
                      onChange={() => {
                        setTobaccoUsage("non-smoker")
                        setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
                      }}
                      className="sr-only"
                    />
                    <Label
                      htmlFor="non-smoker"
                      className="flex items-center justify-center cursor-pointer w-full h-full"
                    >
                      <CigaretteOff
                        className={cn("h-4 w-4 mr-2", tobaccoUsage === "non-smoker" ? "text-white" : "text-gray-500")}
                      />
                      <span className="font-medium">Non-smoker</span>
                    </Label>
                  </div>

                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-pink-300 hover:shadow-sm",
                      tobaccoUsage === "smoker"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.tobaccoUsage ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setTobaccoUsage("smoker")
                      setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="smoker"
                      name="tobaccoUsage"
                      value="smoker"
                      checked={tobaccoUsage === "smoker"}
                      onChange={() => {
                        setTobaccoUsage("smoker")
                        setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
                      }}
                      className="sr-only"
                    />
                    <Label htmlFor="smoker" className="flex items-center justify-center cursor-pointer w-full h-full">
                      <Cigarette
                        className={cn("h-4 w-4 mr-2", tobaccoUsage === "smoker" ? "text-white" : "text-gray-500")}
                      />
                      <span className="font-medium">Smoker</span>
                    </Label>
                  </div>
                </div>

                {formErrors.tobaccoUsage && (
                  <p className="text-red-500 text-sm mt-1">Please select your tobacco usage</p>
                )}
              </div>

              {/* Your Health */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <label className="block text-sm font-medium text-gray-800">Your Health</label>
                  <div className="relative group">
                    <div className="cursor-help text-gray-400 hover:text-gray-600">
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
                        className="lucide lucide-help-circle"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
                      Your health status helps us find the best coverage options for you. This information may affect
                      your premium rates and available plans.
                      <div className="absolute left-0 top-full w-3 h-3 -mt-1 ml-2 transform rotate-45 bg-gray-800"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-sm">
                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-pink-300 hover:shadow-sm",
                      healthStatus === "improving"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.healthStatus ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setHealthStatus("improving")
                      setFormErrors((prev) => ({ ...prev, healthStatus: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="improving"
                      name="healthStatus"
                      value="improving"
                      checked={healthStatus === "improving"}
                      onChange={() => {
                        setHealthStatus("improving")
                        setFormErrors((prev) => ({ ...prev, healthStatus: false }))
                      }}
                      className="sr-only"
                    />
                    <Label
                      htmlFor="improving"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center"
                    >
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
                        className={cn("h-4 w-4 mb-1", healthStatus === "improving" ? "text-white" : "text-gray-500")}
                      >
                        <path d="M12 19V5" />
                        <path d="m5 12 7-7 7 7" />
                      </svg>
                      <span className="font-medium text-xs">Improving</span>
                    </Label>
                  </div>

                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-pink-300 hover:shadow-sm",
                      healthStatus === "great"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.healthStatus ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setHealthStatus("great")
                      setFormErrors((prev) => ({ ...prev, healthStatus: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="great"
                      name="healthStatus"
                      value="great"
                      checked={healthStatus === "great"}
                      onChange={() => {
                        setHealthStatus("great")
                        setFormErrors((prev) => ({ ...prev, healthStatus: false }))
                      }}
                      className="sr-only"
                    />
                    <Label
                      htmlFor="great"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center"
                    >
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
                        className={cn("h-4 w-4 mb-1", healthStatus === "great" ? "text-white" : "text-gray-500")}
                      >
                        <path d="M8 21l8-11-8-11" />
                        <circle cx="12" cy="8" r="2" />
                      </svg>
                      <span className="font-medium text-xs">Great</span>
                    </Label>
                  </div>

                  <div
                    className={cn(
                      "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                      "hover:border-pink-300 hover:shadow-sm",
                      healthStatus === "excellent"
                        ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                        : "border-gray-200 bg-white",
                      formErrors.healthStatus ? "border-red-300" : "",
                    )}
                    onClick={() => {
                      setHealthStatus("excellent")
                      setFormErrors((prev) => ({ ...prev, healthStatus: false }))
                    }}
                  >
                    <input
                      type="radio"
                      id="excellent"
                      name="healthStatus"
                      value="excellent"
                      checked={healthStatus === "excellent"}
                      onChange={() => {
                        setHealthStatus("excellent")
                        setFormErrors((prev) => ({ ...prev, healthStatus: false }))
                      }}
                      className="sr-only"
                    />
                    <Label
                      htmlFor="excellent"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center"
                    >
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
                        className={cn("h-4 w-4 mb-1", healthStatus === "excellent" ? "text-white" : "text-gray-500")}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="font-medium text-xs">Excellent</span>
                    </Label>
                  </div>
                </div>

                {formErrors.healthStatus && (
                  <p className="text-red-500 text-sm mt-1">Please select your health status</p>
                )}
              </div>

              {/* Family Members Section */}

              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid || !isPrimaryAgeValid}
                className={cn(
                  "w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-6 rounded-lg transition-all duration-300",
                  isFormValid && isPrimaryAgeValid
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/20"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed",
                )}
              >
                <span>Continue</span>
              </Button>

              {/* Explanation message when button is disabled */}
              {!isFormValid && isPrimaryAgeValid && (
                <div className="mt-2 text-center text-sm text-amber-600">
                  <p>
                    {!formCompleteness.primary
                      ? "Please complete your personal information before continuing."
                      : "Please complete all family member information before continuing."}
                  </p>
                </div>
              )}

              {/* Explanation message when button is disabled due to primary applicant age */}
              {!isPrimaryAgeValid && (
                <div className="mt-2 text-center text-sm text-blue-600">
                  <p>Please update your date of birth to continue or contact support for Medicare options.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Redesigned Age Validation Dialog for Family Members (over 65 only) */}
      {showAgeValidationDialog && (
        <Dialog open={showAgeValidationDialog} onOpenChange={setShowAgeValidationDialog}>
          <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white flex items-center">
                  <ShieldCheck className="h-6 w-6 mr-2" />
                  Medicare Eligibility Notice
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                We've detected the following family members who may be eligible for Medicare:
              </p>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {ageValidationIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800">
                          {issue.type === "spouse" && "Spouse"}
                          {issue.type === "dependent" && `Dependent ${issue.index}`}
                          {" - Medicare Eligible"}
                        </h3>
                        <div className="mt-1 text-sm">
                          <p className="text-blue-700">
                            This person is {issue.age} years old and may be eligible for Medicare, which is typically
                            the primary health insurance option for individuals 65 and older.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-gray-700">
                Would you like to continue with this application? You may still proceed, but some family members may be
                eligible for different coverage options.
              </p>
            </div>

            <DialogFooter className="p-6 pt-0">
              <Button
                onClick={handleCloseAgeValidationDialog}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
              >
                Continue Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
