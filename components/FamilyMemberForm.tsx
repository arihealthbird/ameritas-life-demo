"use client"

import type React from "react"

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useRef } from "react"
import { Calendar, Cigarette, CigaretteOff, UserIcon as Male, UserIcon as Female, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseDateString, formatDateOfBirth, validateAgeRestrictions } from "@/utils/dateUtils"
import { Label } from "@/components/ui/label"

export interface FamilyMember {
  id: string
  type: "spouse" | "dependent" | "primary"
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  tobaccoUsage: string
  includedInCoverage: boolean
  relationship?: string
  countInHouseholdSize?: boolean // Add this flag to explicitly track household size inclusion
  phoneNumber?: string
  email?: string
  ssn?: string
  isUSCitizen?: string
  immigrationDocumentType?: string
  isIncarcerated?: string
  isPendingDisposition?: string
  skipAgeValidation?: boolean // Add this flag to explicitly skip age validation
}

export interface FamilyMemberFormRef {
  validateAndGetData: () => FamilyMember | null
}

interface FamilyMemberFormProps {
  type: "spouse" | "dependent" | "primary"
  isPrimaryApplicant?: boolean
  onSave?: (member: FamilyMember) => void
  onCancel?: () => void
  existingMember?: FamilyMember
  autoSave?: boolean
  formId?: string
  onFormChange?: (isComplete: boolean, formData?: FamilyMember) => void
}

const FamilyMemberForm = forwardRef<FamilyMemberFormRef, FamilyMemberFormProps>(
  (
    { type, isPrimaryApplicant = false, onSave, onCancel, existingMember, autoSave = false, formId, onFormChange },
    ref,
  ) => {
    const [dateOfBirthInput, setDateOfBirthInput] = useState<string>(existingMember?.dateOfBirth || "")
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
    const [gender, setGender] = useState<"male" | "female" | "">(existingMember?.gender || "")
    const [tobaccoUsage, setTobaccoUsage] = useState<"smoker" | "non-smoker" | "">(existingMember?.tobaccoUsage || "")
    const [includedInCoverage, setIncludedInCoverage] = useState<boolean>(
      existingMember?.includedInCoverage !== undefined ? existingMember.includedInCoverage : true,
    )
    const [ageRestriction, setAgeRestriction] = useState<{ isUnder19: boolean; isOver65: boolean; age: number } | null>(
      null,
    )
    const [formIsValid, setFormIsValid] = useState(false)
    const [formErrors, setFormErrors] = useState({
      dateOfBirth: false,
      gender: false,
      tobaccoUsage: false,
    })

    // Add a ref to track if we should skip age validation
    const skipAgeValidationRef = useRef<boolean>(existingMember?.skipAgeValidation || false)

    // Add a state to track if the date field has been touched
    const [dateFieldTouched, setDateFieldTouched] = useState(false)

    // Parse existing date of birth if available
    useEffect(() => {
      if (existingMember?.dateOfBirth) {
        const parsedDate = parseDateString(existingMember.dateOfBirth)
        if (parsedDate) {
          setDateOfBirth(parsedDate)
          // Check age restrictions
          const restrictions = validateAgeRestrictions(parsedDate)
          setAgeRestriction(restrictions)
        }
      }

      // Initialize skipAgeValidation from existing member
      if (existingMember?.skipAgeValidation) {
        skipAgeValidationRef.current = true
      }
    }, [existingMember])

    // Validate form whenever values change
    useEffect(() => {
      validateForm()
    }, [dateOfBirth, gender, tobaccoUsage, includedInCoverage])

    // Notify parent component of form changes
    useEffect(() => {
      const formData = getFormData()
      onFormChange?.(formIsValid, formData)

      // Auto-save if enabled and form is valid
      if (autoSave && formIsValid && onSave && formData) {
        onSave(formData)
      }
    }, [formIsValid, dateOfBirth, gender, tobaccoUsage, includedInCoverage, autoSave, onSave, onFormChange])

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      validateAndGetData: () => {
        if (validateForm()) {
          return getFormData()
        }
        return null
      },
    }))

    const validateForm = (): boolean => {
      const errors = {
        dateOfBirth: !dateOfBirth,
        gender: !gender,
        tobaccoUsage: !tobaccoUsage,
      }

      setFormErrors(errors)
      const isValid = !!dateOfBirth && !!gender && !!tobaccoUsage
      setFormIsValid(isValid)
      return isValid
    }

    const getFormData = (): FamilyMember | undefined => {
      if (!dateOfBirth) return undefined

      return {
        id: existingMember?.id || formId || `family-member-${Date.now()}`,
        type,
        dateOfBirth: dateOfBirthInput,
        gender,
        tobaccoUsage,
        includedInCoverage,
        firstName: existingMember?.firstName || "",
        lastName: existingMember?.lastName || "",
        relationship: type === "dependent" ? existingMember?.relationship || "child" : undefined,
        skipAgeValidation: skipAgeValidationRef.current, // Include the skipAgeValidation flag
      }
    }

    // Modify the handleDateOfBirthChange function to include better validation
    const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const formatted = formatDateOfBirth(value)

      // Update the input value
      setDateOfBirthInput(formatted)

      // Try to parse the date if we have a complete format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
        const parsedDate = parseDateString(formatted)

        // Check if the date is valid
        if (parsedDate && isValidDate(parsedDate)) {
          setDateOfBirth(parsedDate)
          setFormErrors((prev) => ({ ...prev, dateOfBirth: false }))

          // Check age restrictions
          const restrictions = validateAgeRestrictions(parsedDate)
          setAgeRestriction(restrictions)
        } else {
          setDateOfBirth(null)
          setAgeRestriction(null)
          setFormErrors((prev) => ({ ...prev, dateOfBirth: true }))
        }
      } else {
        // Clear the date if incomplete
        setDateOfBirth(null)
        setAgeRestriction(null)
        if (formatted && dateFieldTouched) {
          setFormErrors((prev) => ({ ...prev, dateOfBirth: true }))
        }
      }
    }

    // Add a function to check if a date is valid
    const isValidDate = (date: Date): boolean => {
      // Check if the date is valid (not NaN)
      if (isNaN(date.getTime())) return false

      // Additional check to ensure the date is real
      // For example, February 30 would be converted to March 2 by JavaScript
      // So we need to check if the month is the same as what was input
      const month = date.getMonth() + 1 // JavaScript months are 0-indexed
      const day = date.getDate()
      const year = date.getFullYear()

      // Extract the month from the input string
      const inputMonth = Number.parseInt(dateOfBirthInput.split("/")[0], 10)
      const inputDay = Number.parseInt(dateOfBirthInput.split("/")[1], 10)

      // Check if the parsed date matches the input date
      return month === inputMonth && day === inputDay
    }

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

    const handleSave = () => {
      if (validateForm() && onSave) {
        const formData = getFormData()
        if (formData) {
          onSave(formData)
        }
      }
    }

    const isOutsideAgeRange = (): boolean => {
      // Only consider age restrictions if the person is included in coverage
      // and we haven't explicitly skipped age validation
      return (
        includedInCoverage &&
        !skipAgeValidationRef.current &&
        !!ageRestriction &&
        (ageRestriction.isUnder19 || ageRestriction.isOver65)
      )
    }

    const isUnder19 = (): boolean => {
      return !!ageRestriction && ageRestriction.isUnder19
    }

    const isOver65 = (): boolean => {
      return !!ageRestriction && ageRestriction.isOver65
    }

    // Add this function to ensure data consistency
    const ensureDataConsistency = useCallback(() => {
      try {
        // Make sure the form data is consistent with the current state
        const formData = getFormData()
        if (formData && onFormChange) {
          onFormChange(formIsValid, formData)
        }

        // If there are age restrictions and this is not a primary applicant,
        // make sure the includedInCoverage state is properly reflected
        if (!isPrimaryApplicant && ageRestriction) {
          if (ageRestriction.isUnder19 && includedInCoverage && !skipAgeValidationRef.current) {
            // Log for debugging
            console.log(`Family member under 19: ${type}, age: ${ageRestriction.age}, included: ${includedInCoverage}`)
          } else if (ageRestriction.isOver65 && includedInCoverage && !skipAgeValidationRef.current) {
            // Log for debugging
            console.log(`Family member over 65: ${type}, age: ${ageRestriction.age}, included: ${includedInCoverage}`)
          }
        }
      } catch (error) {
        console.error("Error ensuring data consistency:", error)
        // Attempt recovery by resetting to default state if necessary
        if (
          existingMember?.includedInCoverage !== undefined &&
          includedInCoverage !== existingMember.includedInCoverage
        ) {
          console.log("Attempting recovery by resetting to existing member state")
          setIncludedInCoverage(existingMember.includedInCoverage)
        }
      }
    }, [ageRestriction, includedInCoverage, isPrimaryApplicant, type, formIsValid, onFormChange, existingMember])

    // Call this function whenever relevant state changes
    useEffect(() => {
      ensureDataConsistency()
    }, [includedInCoverage, ensureDataConsistency])

    // Handle checkbox changes
    const handleIncludedInCoverageChange = () => {
      const newValue = !includedInCoverage
      setIncludedInCoverage(newValue)

      // Get the member ID
      const memberId = existingMember?.id || formId || `family-member-${Date.now()}`

      if (!newValue) {
        // If unchecking the box, mark to skip age validation
        skipAgeValidationRef.current = true

        // Store this information in sessionStorage to persist across page navigation
        try {
          // Get existing skipped validations or initialize empty array
          const existingSkipped = sessionStorage.getItem("skippedAgeValidations")
          const skippedArray = existingSkipped ? JSON.parse(existingSkipped) : []

          // Add this member's ID if not already present
          if (!skippedArray.includes(memberId)) {
            skippedArray.push(memberId)
            sessionStorage.setItem("skippedAgeValidations", JSON.stringify(skippedArray))
          }

          console.log(`Added ${memberId} to skipped age validations`)
        } catch (error) {
          console.error("Error updating skipped validations in sessionStorage:", error)
        }

        // Dispatch cancellation event
        try {
          const cancelEvent = new CustomEvent("cancelAgeValidation", {
            detail: {
              formId,
              type,
              includedInCoverage: false,
              permanent: true, // Mark this as a permanent cancellation
            },
          })
          document.dispatchEvent(cancelEvent)
          console.log(`Permanently cancelling age validation for ${type}`)
        } catch (error) {
          console.error("Error in cancellation event handling:", error)
        }
      } else {
        // If checking the box, re-enable age validation
        skipAgeValidationRef.current = false

        // Remove from skipped validations in sessionStorage
        try {
          const existingSkipped = sessionStorage.getItem("skippedAgeValidations")
          if (existingSkipped) {
            const skippedArray = JSON.parse(existingSkipped)
            const updatedArray = skippedArray.filter((id: string) => id !== memberId)
            sessionStorage.setItem("skippedAgeValidations", JSON.stringify(updatedArray))
            console.log(`Removed ${memberId} from skipped age validations`)
          }
        } catch (error) {
          console.error("Error updating skipped validations in sessionStorage:", error)
        }

        // Dispatch re-enable event
        try {
          const enableEvent = new CustomEvent("enableAgeValidation", {
            detail: {
              formId,
              type,
              includedInCoverage: true,
            },
          })
          document.dispatchEvent(enableEvent)
          console.log(`Re-enabling age validation for ${type}`)
        } catch (error) {
          console.error("Error in enable event handling:", error)
        }
      }
    }

    // Check sessionStorage on mount to see if this member should skip validation
    useEffect(() => {
      try {
        const existingSkipped = sessionStorage.getItem("skippedAgeValidations")
        if (existingSkipped) {
          const skippedArray = JSON.parse(existingSkipped)
          const memberId = existingMember?.id || formId

          if (memberId && skippedArray.includes(memberId)) {
            console.log(`Found ${memberId} in skipped validations, will skip age validation`)
            skipAgeValidationRef.current = true

            // If this member is in the skipped list but is somehow marked as included in coverage,
            // we should correct that inconsistency
            if (includedInCoverage) {
              console.log(`Correcting inconsistency: ${memberId} was skipped but marked as included`)
              setIncludedInCoverage(false)
            }
          }
        }
      } catch (error) {
        console.error("Error checking skipped validations in sessionStorage:", error)
      }
    }, [existingMember?.id, formId, includedInCoverage])

    // Determine if this is a primary applicant (for error message display)
    const shouldShowErrorMessages = isPrimaryApplicant || type === "primary"

    return (
      <div className="space-y-4">
        {/* Date of Birth */}
        <div className="space-y-2">
          <label htmlFor={`dob-${formId}`} className="block text-sm font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id={`dob-${formId}`}
              placeholder="MM/DD/YYYY"
              value={dateOfBirthInput}
              onChange={handleDateOfBirthChange}
              onFocus={handleDateFieldFocus}
              onBlur={handleDateFieldBlur}
              className={cn(
                "w-full h-12 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                formErrors.dateOfBirth && dateFieldTouched
                  ? "border-red-500"
                  : isOver65()
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

          {/* Age Warning - Only show for primary applicant or if dependent/spouse is included in coverage */}
          {(type === "primary" || (includedInCoverage && !isPrimaryApplicant && !skipAgeValidationRef.current)) &&
            ageRestriction && (
              <>
                {/* Under 19 message */}
                {ageRestriction.isUnder19 && (
                  <div className="mt-2 p-2 rounded-md text-xs bg-amber-50 text-amber-700 border border-amber-200">
                    {type === "dependent" || type === "spouse" ? (
                      <p>This {type} is under 19 and may be eligible for CHIP or Medicaid.</p>
                    ) : (
                      <p>This person must be at least 19 years old.</p>
                    )}
                  </div>
                )}

                {/* Over 65 message */}
                {ageRestriction.isOver65 && (
                  <div className="mt-2 p-2 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    <p>This person is over 65 and may be eligible for Medicare.</p>
                  </div>
                )}
              </>
            )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">Gender</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                "hover:border-pink-300 hover:shadow-sm",
                gender === "male"
                  ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                  : "border-gray-200 bg-white",
                formErrors.gender && shouldShowErrorMessages ? "border-red-300" : "",
              )}
              onClick={() => {
                setGender("male")
                setFormErrors((prev) => ({ ...prev, gender: false }))
              }}
            >
              <input
                type="radio"
                id={`male-${formId}`}
                name={`gender-${formId}`}
                value="male"
                checked={gender === "male"}
                onChange={() => {
                  setGender("male")
                  setFormErrors((prev) => ({ ...prev, gender: false }))
                }}
                className="sr-only"
              />
              <Label
                htmlFor={`male-${formId}`}
                className="flex items-center justify-center cursor-pointer w-full h-full"
              >
                <Male className={cn("h-4 w-4 mr-2", gender === "male" ? "text-white" : "text-gray-700")} />
                <span className="font-medium">Male</span>
              </Label>
            </div>

            <div
              className={cn(
                "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                "hover:border-pink-300 hover:shadow-sm",
                gender === "female"
                  ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                  : "border-gray-200 bg-white",
                formErrors.gender && shouldShowErrorMessages ? "border-red-300" : "",
              )}
              onClick={() => {
                setGender("female")
                setFormErrors((prev) => ({ ...prev, gender: false }))
              }}
            >
              <input
                type="radio"
                id={`female-${formId}`}
                name={`gender-${formId}`}
                value="female"
                checked={gender === "female"}
                onChange={() => {
                  setGender("female")
                  setFormErrors((prev) => ({ ...prev, gender: false }))
                }}
                className="sr-only"
              />
              <Label
                htmlFor={`female-${formId}`}
                className="flex items-center justify-center cursor-pointer w-full h-full"
              >
                <Female className={cn("h-4 w-4 mr-2", gender === "female" ? "text-white" : "text-gray-700")} />
                <span className="font-medium">Female</span>
              </Label>
            </div>
          </div>
          {/* Only show error message for primary applicant */}
          {formErrors.gender && shouldShowErrorMessages && (
            <p className="text-red-500 text-sm mt-1">Please select a gender</p>
          )}
        </div>

        {/* Tobacco Usage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">Tobacco Usage</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                "relative rounded-full border p-2 cursor-pointer transition-all duration-200",
                "hover:border-pink-300 hover:shadow-sm",
                tobaccoUsage === "non-smoker"
                  ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                  : "border-gray-200 bg-white",
                formErrors.tobaccoUsage && shouldShowErrorMessages ? "border-red-300" : "",
              )}
              onClick={() => {
                setTobaccoUsage("non-smoker")
                setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
              }}
            >
              <input
                type="radio"
                id={`non-smoker-${formId}`}
                name={`tobacco-${formId}`}
                value="non-smoker"
                checked={tobaccoUsage === "non-smoker"}
                onChange={() => {
                  setTobaccoUsage("non-smoker")
                  setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
                }}
                className="sr-only"
              />
              <Label
                htmlFor={`non-smoker-${formId}`}
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
                formErrors.tobaccoUsage && shouldShowErrorMessages ? "border-red-300" : "",
              )}
              onClick={() => {
                setTobaccoUsage("smoker")
                setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
              }}
            >
              <input
                type="radio"
                id={`smoker-${formId}`}
                name={`tobacco-${formId}`}
                value="smoker"
                checked={tobaccoUsage === "smoker"}
                onChange={() => {
                  setTobaccoUsage("smoker")
                  setFormErrors((prev) => ({ ...prev, tobaccoUsage: false }))
                }}
                className="sr-only"
              />
              <Label
                htmlFor={`smoker-${formId}`}
                className="flex items-center justify-center cursor-pointer w-full h-full"
              >
                <Cigarette className={cn("h-4 w-4 mr-2", tobaccoUsage === "smoker" ? "text-white" : "text-gray-500")} />
                <span className="font-medium">Smoker</span>
              </Label>
            </div>
          </div>
          {/* Only show error message for primary applicant */}
          {formErrors.tobaccoUsage && shouldShowErrorMessages && (
            <p className="text-red-500 text-sm mt-1">Please select tobacco usage</p>
          )}
        </div>

        {/* Include in coverage - only shown for non-primary applicants */}
        {!isPrimaryApplicant && (
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer",
                  includedInCoverage ? "bg-purple-600 border-purple-600" : "border-gray-300",
                )}
                onClick={handleIncludedInCoverageChange}
              >
                {includedInCoverage && <Check className="h-3 w-3 text-white" />}
              </div>
              <label
                className="text-sm font-medium leading-none cursor-pointer text-gray-700"
                onClick={handleIncludedInCoverageChange}
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
            {includedInCoverage && !skipAgeValidationRef.current && (
              <>
                {isUnder19() && (
                  <div className="mt-2 text-xs text-amber-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    <span>This {type} is under 19 and may be eligible for CHIP or Medicaid.</span>
                  </div>
                )}
                {isOver65() && (
                  <div className="mt-2 text-xs text-blue-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    <span>This person is over 65 and may be eligible for Medicare.</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Action Buttons - Only show if not auto-saving */}
        {!autoSave && (
          <div className="flex justify-end space-x-3 mt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={!formIsValid}
                className={cn(
                  "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
                  formIsValid
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    : "bg-gray-300 cursor-not-allowed",
                )}
              >
                Save
              </button>
            )}
          </div>
        )}
      </div>
    )
  },
)

FamilyMemberForm.displayName = "FamilyMemberForm"

export default FamilyMemberForm
