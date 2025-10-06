"use client"

import React from "react"

import { Calendar, Cigarette, CigaretteOff, HeartPulse, Flag, MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { formatDateOfBirth, parseDateString, calculateAge } from "@/utils/dateUtils"

export type CitizenshipStatus = "citizen" | "permanent_resident" | "none" | ""

interface PrimaryInfoLocationTabProps {
  zipCode: string
  setZipCode: (zipCode: string) => void
  dateOfBirth: string
  setDateOfBirth: (dob: string) => void
  gender: string
  setGender: (gender: string) => void
  tobaccoUsage: string
  setTobaccoUsage: (tobacco: string) => void
  healthStatus: string
  setHealthStatus: (status: string) => void
  citizenshipStatus: CitizenshipStatus
  setCitizenshipStatus: (status: CitizenshipStatus) => void
  errors: {
    zipCode?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    tobaccoUsage?: boolean
    healthStatus?: boolean
    citizenshipStatus?: boolean
  }
}

const PrimaryInfoLocationTab = ({
  zipCode,
  setZipCode,
  dateOfBirth: initialDateOfBirth,
  setDateOfBirth,
  gender,
  setGender,
  tobaccoUsage,
  setTobaccoUsage,
  healthStatus,
  setHealthStatus,
  citizenshipStatus,
  setCitizenshipStatus,
  errors,
}) => {
  const [dateOfBirthInput, setDateOfBirthInput] = React.useState(
    initialDateOfBirth ? formatDateOfBirth(initialDateOfBirth.split("T")[0].replace(/-/g, "/")) : "",
  )
  const [dateFieldError, setDateFieldError] = React.useState(errors.dateOfBirth)

  React.useEffect(() => {
    // Sync input field if prop changes externally (e.g. modal reopens)
    setDateOfBirthInput(
      initialDateOfBirth ? formatDateOfBirth(initialDateOfBirth.split("T")[0].replace(/-/g, "/")) : "",
    )
  }, [initialDateOfBirth])

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formatted = formatDateOfBirth(rawValue)
    setDateOfBirthInput(formatted)

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
      const parsed = parseDateString(formatted)
      if (parsed && !isNaN(parsed.getTime())) {
        // Check if year is reasonable, e.g., not too far in past or future
        const year = parsed.getFullYear()
        if (year > 1900 && year < new Date().getFullYear() + 1) {
          setDateOfBirth(parsed.toISOString().split("T")[0]) // Store as YYYY-MM-DD
          setDateFieldError(false)
          return
        }
      }
    }
    // If not fully valid or parseable, set parent state to empty or mark error
    setDateOfBirth("")
    setDateFieldError(true)
  }

  const currentAge = React.useMemo(() => {
    if (initialDateOfBirth) {
      const parsed = parseDateString(initialDateOfBirth.split("T")[0].replace(/-/g, "/"))
      if (parsed && !isNaN(parsed.getTime())) {
        return calculateAge(parsed)
      }
    }
    return null
  }, [initialDateOfBirth])

  const healthStatusOptions = [
    { value: "excellent", label: "Excellent" },
    { value: "great", label: "Great" },
    { value: "improving", label: "Improving" },
  ]

  const citizenshipOptions = [
    { value: "citizen", label: "U.S. Citizen", description: "Born in the U.S. or naturalized" },
    { value: "permanent_resident", label: "Permanent Resident", description: "Green Card holder" },
    { value: "none", label: "None of the above", description: "Other status" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-base font-medium text-gray-800">
              Date of Birth
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                <Calendar size={20} />
              </div>
              <Input
                id="dateOfBirth"
                type="text"
                placeholder="MM/DD/YYYY"
                value={dateOfBirthInput}
                onChange={handleDateOfBirthChange}
                className={cn(
                  "pl-10 h-14 text-base rounded-lg",
                  errors.dateOfBirth || dateFieldError ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                )}
              />
            </div>
            {currentAge !== null && <p className="text-xs text-gray-500">{currentAge} years old</p>}
            {(errors.dateOfBirth || dateFieldError) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid date (MM/DD/YYYY).</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="block text-base font-medium text-gray-800 mb-2">Gender</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
              {["male", "female"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`gender-${option}`} />
                  <Label htmlFor={`gender-${option}`} className="text-base capitalize cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.gender && <p className="text-red-500 text-xs mt-1">Please select your gender.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tobacco Usage */}
        <div className="space-y-2">
          <Label className="block text-base font-medium text-gray-800 mb-2">Tobacco Usage</Label>
          <RadioGroup value={tobaccoUsage} onValueChange={setTobaccoUsage} className="flex space-x-4">
            {["non-smoker", "smoker"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`tobacco-${option}`} />
                <Label htmlFor={`tobacco-${option}`} className="text-base capitalize cursor-pointer">
                  {option === "non-smoker" ? (
                    <CigaretteOff className="inline h-4 w-4 mr-1" />
                  ) : (
                    <Cigarette className="inline h-4 w-4 mr-1" />
                  )}
                  {option.replace("-", " ")}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.tobaccoUsage && <p className="text-red-500 text-xs mt-1">Please select tobacco usage.</p>}
        </div>

        {/* Health Status */}
        <div className="space-y-2">
          <Label className="block text-base font-medium text-gray-800 mb-2">Health Status</Label>
          <RadioGroup value={healthStatus} onValueChange={setHealthStatus} className="flex space-x-2 md:space-x-4">
            {healthStatusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`health-${option.value}`} />
                <Label htmlFor={`health-${option.value}`} className="text-base cursor-pointer">
                  <HeartPulse className="inline h-4 w-4 mr-1" />
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.healthStatus && <p className="text-red-500 text-xs mt-1">Please select health status.</p>}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Location & Qualification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ZIP Code */}
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-base font-medium text-gray-800">
              ZIP Code
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                <MapPin size={20} />
              </div>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className={cn(
                  "pl-10 h-14 text-base rounded-lg",
                  errors.zipCode ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                )}
                maxLength={5}
              />
            </div>
            <p className="text-sm text-gray-500">Your 5-digit ZIP code.</p>
            {errors.zipCode && <p className="text-red-500 text-xs mt-1">Valid 5-digit ZIP code is required.</p>}
          </div>

          {/* Citizenship Status */}
          <div className="space-y-2">
            <Label className="block text-base font-medium text-gray-800 mb-2">Citizenship Status</Label>
            <RadioGroup
              value={citizenshipStatus}
              onValueChange={(val) => setCitizenshipStatus(val as CitizenshipStatus)}
              className="space-y-2"
            >
              {citizenshipOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={`citizen-${option.value}`} />
                  <Label htmlFor={`citizen-${option.value}`} className="text-base cursor-pointer w-full">
                    <div className="flex items-center">
                      <Flag className="inline h-5 w-5 mr-2 text-purple-600" />
                      <div>
                        <span className="font-medium">{option.label}</span>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.citizenshipStatus && <p className="text-red-500 text-xs mt-1">Please select citizenship status.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryInfoLocationTab
