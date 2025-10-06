"use client"

import type React from "react"
import { ChevronDown, AlertCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IncomeFrequencyOption {
  value: string
  label: string
}

interface HouseholdIncomeInputProps {
  incomeAmount: string
  incomeFrequency: string
  dropdownOpen: boolean
  setIncomeAmount: (value: string) => void
  setIncomeFrequency: (value: string) => void
  setDropdownOpen: (open: boolean) => void
  formatIncome: (value: string) => string
  validationError?: string
}

const HouseholdIncomeInput: React.FC<HouseholdIncomeInputProps> = ({
  incomeAmount,
  incomeFrequency,
  dropdownOpen,
  setIncomeAmount,
  setIncomeFrequency,
  setDropdownOpen,
  formatIncome,
  validationError,
}) => {
  const frequencyOptions: IncomeFrequencyOption[] = [
    { value: "annually", label: "Annually" },
    { value: "monthly", label: "Monthly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "weekly", label: "Weekly" },
  ]

  const calculateAnnualIncome = (): string | null => {
    if (!incomeAmount || incomeFrequency === "annually") return null

    // Parse the numeric value from the income amount
    const numericAmount = Number.parseFloat(incomeAmount.replace(/[^0-9.]/g, ""))
    if (isNaN(numericAmount)) return null

    let annualAmount = 0
    switch (incomeFrequency) {
      case "monthly":
        annualAmount = numericAmount * 12
        break
      case "biweekly":
        annualAmount = numericAmount * 26
        break
      case "weekly":
        annualAmount = numericAmount * 52
        break
      default:
        return null
    }

    // Format the annual amount as currency
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(annualAmount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-gray-600 mb-1">
          Frequency
        </label>
        <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={dropdownOpen}
              className="w-full justify-between bg-white border-gray-300 text-gray-800 shadow-sm hover:bg-gray-50 h-12"
            >
              {incomeFrequency
                ? frequencyOptions.find((option) => option.value === incomeFrequency)?.label
                : "Select frequency"}
              <ChevronDown size={16} className="ml-2 shrink-0 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white shadow-lg rounded-lg border border-gray-200 mt-1">
            <div className="overflow-hidden">
              {frequencyOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm cursor-pointer",
                    "hover:bg-gray-50 hover:text-purple-600 transition-colors",
                    incomeFrequency === option.value && "bg-gray-50 text-purple-600 font-medium",
                  )}
                  onClick={() => {
                    setIncomeFrequency(option.value)
                    setDropdownOpen(false)
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {incomeFrequency !== "annually" && (
          <p className="text-gray-500 text-sm mt-1 whitespace-nowrap">Annual Income: {calculateAnnualIncome()}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">
          Amount
        </label>
        <div className="relative h-12">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
          <input
            type="text"
            id="amount"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(formatIncome(e.target.value))}
            className={`w-full h-full px-4 py-2 pl-8 border ${
              validationError ? "border-red-400 focus:border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="35,000"
            aria-invalid={!!validationError}
          />
        </div>
        {validationError && (
          <div className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
            <AlertCircle size={12} />
            <span>{validationError}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default HouseholdIncomeInput
