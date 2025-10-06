"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Check, DollarSign, Calendar, Briefcase, Building, Phone } from "lucide-react"
import { DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { IncomeSource, IncomeSourceType, FrequencyType } from "@/types/income"

interface IncomeSourceFormProps {
  sourceType: IncomeSourceType
  initialData?: IncomeSource
  onSave: (source: IncomeSource) => void
  onCancel: () => void
}

const frequencyOptions: { id: FrequencyType; label: string }[] = [
  { id: "yearly", label: "Yearly" },
  { id: "monthly", label: "Monthly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "weekly", label: "Weekly" },
]

export default function IncomeSourceForm({ sourceType, initialData, onSave, onCancel }: IncomeSourceFormProps) {
  // Form state
  const [amount, setAmount] = useState<string>(initialData?.amount.toString() || "")
  const [frequency, setFrequency] = useState<FrequencyType>(initialData?.frequency || "yearly")
  const [employerName, setEmployerName] = useState<string>(initialData?.employerName || "")
  const [employerPhone, setEmployerPhone] = useState<string>(initialData?.employerPhone || "")
  const [jobType, setJobType] = useState<string>(initialData?.jobType || "")
  const [expirationDate, setExpirationDate] = useState<string>(initialData?.expirationDate || "")
  const [description, setDescription] = useState<string>(initialData?.description || "")

  // Initialize unemployed with zero amount
  const [phoneError, setPhoneError] = useState<string>("")

  useEffect(() => {
    if (sourceType === "unemployed" && !initialData) {
      setAmount("0")
      setFrequency("yearly")
    }
  }, [sourceType, initialData])

  const getSourceTypeName = () => {
    switch (sourceType) {
      case "job":
        return "Full-time Job"
      case "self-employed":
        return "Self-employed"
      case "unemployment":
        return "Unemployment"
      case "unemployed":
        return "Unemployed"
      case "other":
        return "Other Income"
      default:
        return "Income Source"
    }
  }

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "")

    // Handle decimal points
    const parts = numericValue.split(".")
    if (parts.length > 1) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`
    }

    return numericValue
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatCurrencyInput(e.target.value))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format phone number as (XXX) XXX-XXXX
    const value = e.target.value.replace(/[^\d]/g, "")

    // Clear error when user is typing
    setPhoneError("")

    if (value.length <= 3) {
      setEmployerPhone(value)
    } else if (value.length <= 6) {
      setEmployerPhone(`(${value.slice(0, 3)}) ${value.slice(3)}`)
    } else {
      setEmployerPhone(`(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`)
    }
  }

  const isFormValid = () => {
    if (sourceType === "unemployed") return true

    if (!amount) return false

    if (sourceType === "self-employed" && !jobType) return false

    if (sourceType === "unemployment" && !expirationDate) return false

    if (sourceType === "job") {
      if (!employerName) return false

      // Check phone number length - must have at least 9 digits
      const phoneDigits = employerPhone.replace(/[^\d]/g, "")
      if (!employerPhone || phoneDigits.length < 9) {
        // Only set error if the field has been touched and is invalid
        if (employerPhone) {
          setPhoneError("Phone number must have at least 9 digits")
        }
        return false
      }
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) return

    const parsedAmount = Number.parseFloat(amount) || 0

    const incomeSource: IncomeSource = {
      type: sourceType,
      amount: parsedAmount,
      frequency,
      // Only include type-specific fields if relevant
      ...(sourceType === "job"
        ? {
            employerName,
            employerPhone,
          }
        : {}),
      ...(sourceType === "self-employed"
        ? {
            jobType,
          }
        : {}),
      ...(sourceType === "unemployment"
        ? {
            expirationDate,
          }
        : {}),
      ...(sourceType === "other"
        ? {
            description,
          }
        : {}),
    }

    onSave(incomeSource)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <DialogHeader className="relative mb-6">
        <div className="absolute right-0 top-0 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Cancel"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="submit"
            className="p-1 text-green-500 hover:text-green-600"
            aria-label="Save"
            disabled={!isFormValid()}
          >
            <Check className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-purple-100 p-2 rounded-full">
            {sourceType === "job" || sourceType === "part-time" ? (
              <Briefcase className="h-5 w-5 text-purple-600" />
            ) : (
              <DollarSign className="h-5 w-5 text-purple-600" />
            )}
          </div>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? `Edit Income Source` : `Add ${getSourceTypeName()}`}
          </DialogTitle>
        </div>
      </DialogHeader>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
        {/* Source Type */}
        <div className="space-y-2">
          <Label htmlFor="source-type">Source Type</Label>
          <div className="relative">
            <Input id="source-type" value={getSourceTypeName()} disabled className="pl-10" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {sourceType === "job" || sourceType === "part-time" ? (
                <Briefcase className="h-4 w-4 text-gray-400" />
              ) : (
                <DollarSign className="h-4 w-4 text-gray-400" />
              )}
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
                onChange={(e) => setFrequency(e.target.value as FrequencyType)}
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
                  onBlur={() => {
                    if (employerPhone) {
                      const phoneDigits = employerPhone.replace(/[^\d]/g, "")
                      if (phoneDigits.length < 9) {
                        setPhoneError("Phone number must have at least 9 digits")
                      } else {
                        setPhoneError("")
                      }
                    }
                  }}
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
      </div>
    </form>
  )
}
