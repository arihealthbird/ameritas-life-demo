"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, Users, Check, AlertCircle, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { parseDateString, formatDateOfBirth, validateAgeRestrictions, calculateAge } from "@/utils/dateUtils"

export interface FamilyMember {
  id: string
  type: "spouse" | "dependent"
  dateOfBirth: string
  gender: "male" | "female"
  tobaccoUsage: "non-smoker" | "smoker"
  includedInCoverage: boolean
}

interface AddFamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (member: FamilyMember) => void
  type: "spouse" | "dependent"
  existingMember?: FamilyMember
}

const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
  existingMember,
}) => {
  const [dateOfBirth, setDateOfBirth] = useState<string>("")
  const [gender, setGender] = useState<"male" | "female" | undefined>(undefined)
  const [tobaccoUsage, setTobaccoUsage] = useState<"non-smoker" | "smoker" | undefined>(undefined)
  const [includedInCoverage, setIncludedInCoverage] = useState<boolean>(true)
  const [errors, setErrors] = useState({
    dateOfBirth: false,
    gender: false,
    tobaccoUsage: false,
  })

  // Reset form when modal opens or type changes
  useEffect(() => {
    if (existingMember) {
      setDateOfBirth(existingMember.dateOfBirth)
      setGender(existingMember.gender)
      setTobaccoUsage(existingMember.tobaccoUsage)
      setIncludedInCoverage(existingMember.includedInCoverage)
    } else {
      setDateOfBirth("")
      setGender(undefined)
      setTobaccoUsage(undefined)
      setIncludedInCoverage(true)
    }
    setErrors({
      dateOfBirth: false,
      gender: false,
      tobaccoUsage: false,
    })
  }, [isOpen, type, existingMember])

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatDateOfBirth(value)
    setDateOfBirth(formatted)
    setErrors({ ...errors, dateOfBirth: false })

    // Check age restrictions if date is complete
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
      const parsedDate = parseDateString(formatted)

      if (parsedDate) {
        const { isUnder19, isOver65 } = validateAgeRestrictions(parsedDate)

        if (isUnder19 || isOver65) {
          // Automatically uncheck "Include in coverage"
          setIncludedInCoverage(false)
        } else {
          // Reset to default if age is valid
          setIncludedInCoverage(true)
        }
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      dateOfBirth: !dateOfBirth || dateOfBirth.length < 10,
      gender: !gender,
      tobaccoUsage: !tobaccoUsage,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const member: FamilyMember = {
      id: existingMember?.id || Date.now().toString(),
      type,
      dateOfBirth,
      gender: gender!,
      tobaccoUsage: tobaccoUsage!,
      includedInCoverage,
    }

    onSave(member)
    onClose()
  }

  // Check if the family member is outside the age range
  const isOutsideAgeRange = (): boolean => {
    if (!dateOfBirth) return false

    const parsedDate = parseDateString(dateOfBirth)
    if (!parsedDate) return false

    const age = calculateAge(parsedDate)
    return age < 19 || age > 65
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {type === "spouse" ? (
              <>
                <Heart className="h-5 w-5 text-pink-500 mr-2" />
                Spouse
              </>
            ) : (
              <>
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                Dependent
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date of Birth */}
          <div className="space-y-2">
            <label htmlFor="familyMemberDob" className="block text-sm font-medium text-gray-800">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="text"
                id="familyMemberDob"
                placeholder="MM/DD/YYYY"
                value={dateOfBirth}
                onChange={handleDateOfBirthChange}
                className={cn(
                  "w-full h-12 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300",
                )}
              />
            </div>
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">Please enter a valid date of birth</p>}

            {dateOfBirth && parseDateString(dateOfBirth) && calculateAge(parseDateString(dateOfBirth)!) < 19 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-2 sm:p-3 mt-2 overflow-hidden">
                <p className="text-amber-700 text-xs sm:text-sm flex items-start">
                  <AlertCircle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span className="break-words">
                    This {type} is under 19 years old. They may be eligible for Medicaid or CHIP coverage. They will not
                    be included in your marketplace plan quote.
                  </span>
                </p>
              </div>
            )}

            {dateOfBirth && parseDateString(dateOfBirth) && calculateAge(parseDateString(dateOfBirth)!) > 65 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 sm:p-3 mt-2 overflow-hidden">
                <p className="text-blue-700 text-xs sm:text-sm flex items-start">
                  <Info size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span className="break-words">
                    This {type} is over 65 years old. They may be eligible for Medicare coverage. They will not be
                    included in your marketplace plan quote.
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Gender</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "relative rounded-lg border p-4 cursor-pointer transition-all duration-200",
                  "hover:border-pink-300 hover:shadow-sm",
                  gender === "male"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "border-gray-200 bg-white",
                  errors.gender ? "border-red-300" : "",
                )}
                onClick={() => {
                  setGender("male")
                  setErrors({ ...errors, gender: false })
                }}
              >
                <input
                  type="radio"
                  id="familyMemberMale"
                  name="familyMemberGender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => {
                    setGender("male")
                    setErrors({ ...errors, gender: false })
                  }}
                  className="sr-only"
                />
                <Label
                  htmlFor="familyMemberMale"
                  className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a81b895a-c071-4965-be1a-9f02f2295070-cehNlxciVN1Ift8SVtYmFZafVvU064.png"
                      alt="Male"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="font-medium">Male</span>
                </Label>
              </div>

              <div
                className={cn(
                  "relative rounded-lg border p-4 cursor-pointer transition-all duration-200",
                  "hover:border-pink-300 hover:shadow-sm",
                  gender === "female"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "border-gray-200 bg-white",
                  errors.gender ? "border-red-300" : "",
                )}
                onClick={() => {
                  setGender("female")
                  setErrors({ ...errors, gender: false })
                }}
              >
                <input
                  type="radio"
                  id="familyMemberFemale"
                  name="familyMemberGender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => {
                    setGender("female")
                    setErrors({ ...errors, gender: false })
                  }}
                  className="sr-only"
                />
                <Label
                  htmlFor="familyMemberFemale"
                  className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f8160343-cc9c-4439-b714-9b6e079a2869-7O6do1Fr7xrqMRD8ZvRXxN60sO2v1b.png"
                      alt="Female"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="font-medium">Female</span>
                </Label>
              </div>
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">Please select a gender</p>}
          </div>

          {/* Tobacco Usage */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Tobacco Usage</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "relative rounded-lg border p-4 cursor-pointer transition-all duration-200",
                  "hover:border-pink-300 hover:shadow-sm",
                  tobaccoUsage === "non-smoker"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "border-gray-200 bg-white",
                  errors.tobaccoUsage ? "border-red-300" : "",
                )}
                onClick={() => {
                  setTobaccoUsage("non-smoker")
                  setErrors({ ...errors, tobaccoUsage: false })
                }}
              >
                <input
                  type="radio"
                  id="familyMemberNonSmoker"
                  name="familyMemberTobaccoUsage"
                  value="non-smoker"
                  checked={tobaccoUsage === "non-smoker"}
                  onChange={() => {
                    setTobaccoUsage("non-smoker")
                    setErrors({ ...errors, tobaccoUsage: false })
                  }}
                  className="sr-only"
                />
                <Label htmlFor="familyMemberNonSmoker" className="flex items-center cursor-pointer w-full h-full">
                  <span className="text-lg mr-2">🚭</span>
                  <span className="font-medium">Non-smoker</span>
                </Label>
              </div>

              <div
                className={cn(
                  "relative rounded-lg border p-4 cursor-pointer transition-all duration-200",
                  "hover:border-pink-300 hover:shadow-sm",
                  tobaccoUsage === "smoker"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400 border-transparent text-white shadow-sm"
                    : "border-gray-200 bg-white",
                  errors.tobaccoUsage ? "border-red-300" : "",
                )}
                onClick={() => {
                  setTobaccoUsage("smoker")
                  setErrors({ ...errors, tobaccoUsage: false })
                }}
              >
                <input
                  type="radio"
                  id="familyMemberSmoker"
                  name="familyMemberTobaccoUsage"
                  value="smoker"
                  checked={tobaccoUsage === "smoker"}
                  onChange={() => {
                    setTobaccoUsage("smoker")
                    setErrors({ ...errors, tobaccoUsage: false })
                  }}
                  className="sr-only"
                />
                <Label htmlFor="familyMemberSmoker" className="flex items-center cursor-pointer w-full h-full">
                  <span className="text-lg mr-2">🚬</span>
                  <span className="font-medium">Smoker</span>
                </Label>
              </div>
            </div>
            {errors.tobaccoUsage && <p className="text-red-500 text-sm mt-1">Please select tobacco usage</p>}
          </div>

          {/* Include in coverage */}
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCoverage"
                checked={includedInCoverage}
                onCheckedChange={(checked) => setIncludedInCoverage(checked as boolean)}
                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                disabled={isOutsideAgeRange()}
              />
              <label
                htmlFor="includeCoverage"
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
                  isOutsideAgeRange() ? "text-gray-400" : "text-gray-700",
                )}
              >
                Include in coverage
              </label>
              {includedInCoverage && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" /> Covered
                </span>
              )}
              {!includedInCoverage && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Not covered
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddFamilyMemberModal
