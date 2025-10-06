"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { DollarSign, Calendar, Briefcase, Building, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const frequencyOptions = [
  { id: "yearly", label: "Yearly" },
  { id: "monthly", label: "Monthly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "weekly", label: "Weekly" },
]

const incomeSourceTypes = [
  {
    id: "job",
    name: "Full-time Job",
    description: "Regular employment with a single employer",
    icon: <Briefcase className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "self-employed",
    name: "Self-employed",
    description: "Income from your own business",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "unemployment",
    name: "Unemployment",
    description: "Unemployment benefits",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "unemployed",
    name: "Unemployed",
    description: "No current income",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "other",
    name: "Other",
    description: "Any other income source",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
]

export default function InlineIncomeSourceForm({ sourceType: initialSourceType, initialData, onSave, onCancel }) {
  // Use ref to track initialization
  const hasSetUnemployedRef = useRef(false)

  // Form state
  const [sourceType, setSourceType] = useState(initialSourceType || (initialData ? initialData.type : null))
  const [amount, setAmount] = useState(initialData && initialData.amount ? initialData.amount.toString() : "")
  const [frequency, setFrequency] = useState(initialData && initialData.frequency ? initialData.frequency : "yearly")
  const [employerName, setEmployerName] = useState(
    initialData && initialData.employerName ? initialData.employerName : "",
  )
  const [employerPhone, setEmployerPhone] = useState(
    initialData && initialData.employerPhone ? initialData.employerPhone : "",
  )
  const [jobType, setJobType] = useState(initialData && initialData.jobType ? initialData.jobType : "")
  const [expirationDate, setExpirationDate] = useState(
    initialData && initialData.expirationDate ? initialData.expirationDate : "",
  )
  const [description, setDescription] = useState(initialData && initialData.description ? initialData.description : "")
  const [phoneError, setPhoneError] = useState("")

  // Initialize unemployed with zero amount - ONCE ONLY
  useEffect(() => {
    if (hasSetUnemployedRef.current) return

    if (sourceType === "unemployed" && !initialData) {
      hasSetUnemployedRef.current = true
      setAmount("0")
    }
  }, [sourceType, initialData])

  // Handle source type change
  const handleSourceTypeChange = useCallback((newType) => {
    setSourceType(newType)

    // Set amount to 0 for unemployed
    if (newType === "unemployed") {
      setAmount("0")
    }
  }, [])

  const formatCurrencyInput = useCallback((value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "")

    // Handle decimal points
    const parts = numericValue.split(".")
    if (parts.length > 1) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`
    }

    return numericValue
  }, [])

  const handleAmountChange = useCallback(
    (e) => {
      setAmount(formatCurrencyInput(e.target.value))
    },
    [formatCurrencyInput],
  )

  const handlePhoneChange = useCallback((e) => {
    // Get the raw input value and remove all non-digit characters
    const digitsOnly = e.target.value.replace(/\D/g, "")

    // Clear error when user is typing
    setPhoneError("")

    // Format the phone number based on length
    let formattedValue = digitsOnly
    if (digitsOnly.length > 3 && digitsOnly.length <= 6) {
      formattedValue = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
    } else if (digitsOnly.length > 6) {
      formattedValue = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
    }

    // Update state with the formatted value
    setEmployerPhone(formattedValue)
  }, [])

  const handlePhoneBlur = useCallback(() => {
    if (employerPhone) {
      const phoneDigits = employerPhone.replace(/\D/g, "")
      if (phoneDigits.length < 9) {
        setPhoneError("Phone number must have at least 9 digits")
      } else {
        setPhoneError("")
      }
    }
  }, [employerPhone])

  const isFormValid = useCallback(() => {
    if (sourceType === "unemployed") return true
    if (!amount) return false
    if (sourceType === "self-employed" && !jobType) return false
    if (sourceType === "unemployment" && !expirationDate) return false

    if (sourceType === "job") {
      if (!employerName) return false

      // Check phone number length - must have at least 9 digits
      const phoneDigits = employerPhone.replace(/\D/g, "")
      if (!employerPhone || phoneDigits.length < 9) {
        return false
      }
    }

    return true
  }, [sourceType, amount, jobType, expirationDate, employerName, employerPhone])

  const handleSubmit = useCallback(
    (e) => {
      if (e) {
        e.preventDefault()
      }

      if (!sourceType) {
        // If somehow we don't have a source type, don't proceed
        console.error("No source type selected")
        return
      }

      const parsedAmount = Number.parseFloat(amount) || 0

      const incomeSource = {
        type: sourceType,
        amount: parsedAmount,
        frequency,
      }

      // Only include type-specific fields if relevant
      if (sourceType === "job" || sourceType === "part-time") {
        incomeSource.employerName = employerName
        incomeSource.employerPhone = employerPhone
      } else if (sourceType === "self-employed") {
        incomeSource.jobType = jobType
      } else if (sourceType === "unemployment") {
        incomeSource.expirationDate = expirationDate
      } else if (sourceType === "other") {
        incomeSource.description = description
      }

      // Call the onSave prop with the new income source
      onSave(incomeSource)
    },
    [sourceType, amount, frequency, employerName, employerPhone, jobType, expirationDate, description, onSave],
  )

  // If no source type is selected yet, show the source type selection
  if (!sourceType) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {incomeSourceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSourceTypeChange(type.id)}
              className="bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg p-4 text-left transition-colors flex items-start gap-3"
              type="button"
            >
              <div className="bg-purple-100 p-3 rounded-full flex-shrink-0 mt-1">{type.icon}</div>
              <div>
                <h3 className="font-medium text-gray-800">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  // Otherwise, show the form for the selected source type
  return (
    <div className="space-y-6">
      {/* Source Type */}
      <div className="space-y-2">
        <Label htmlFor="source-type">Source Type</Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <select
              id="source-type"
              value={sourceType}
              onChange={(e) => handleSourceTypeChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            >
              {incomeSourceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {sourceType === "job" || sourceType === "part-time" ? (
                <Briefcase className="h-4 w-4 text-gray-400" />
              ) : (
                <DollarSign className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequency - not shown for unemployed */}
      {sourceType !== "unemployed" && (
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <div className="relative">
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            >
              {frequencyOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="pl-10"
            disabled={sourceType === "unemployed"}
            required={sourceType !== "unemployed"}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Job-specific fields */}
      {(sourceType === "job" || sourceType === "part-time") && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Employer Information</h3>

          {/* Employer Name */}
          <div className="space-y-2">
            <Label htmlFor="employer-name">Employer Name</Label>
            <div className="relative">
              <Input
                id="employer-name"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder="Search or enter employer name"
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Employer Phone */}
          <div className="space-y-2">
            <Label htmlFor="employer-phone">Employer Phone</Label>
            <div className="relative">
              <Input
                id="employer-phone"
                type="text"
                value={employerPhone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                placeholder="(555) 555-5555"
                className={`pl-10 ${phoneError ? "border-red-500" : ""}`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
          </div>
        </div>
      )}

      {/* Self-employed specific fields */}
      {sourceType === "self-employed" && (
        <div className="space-y-2">
          <Label htmlFor="job-type">Type of Job</Label>
          <Input
            id="job-type"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="E.g., Consultant, Freelancer, Business Owner"
            required
          />
        </div>
      )}

      {/* Unemployment specific fields */}
      {sourceType === "unemployment" && (
        <div className="space-y-2">
          <Label htmlFor="expiration-date">Benefit Expiration Date</Label>
          <Input
            id="expiration-date"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>
      )}

      {/* Other income specific fields */}
      {sourceType === "other" && (
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this income source"
          />
        </div>
      )}

      {/* Form actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          {initialData ? "Update" : "Add"} Income Source
        </Button>
      </div>
    </div>
  )
}
