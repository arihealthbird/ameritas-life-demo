"use client"

import type React from "react"
import HouseholdIncomeInput from "./HouseholdIncomeInput"
import { HelpCircle } from "lucide-react"

interface HouseholdIncomeSectionProps {
  incomeAmount: string
  incomeFrequency: string
  dropdownOpen: boolean
  setIncomeAmount: (value: string) => void
  setIncomeFrequency: (value: string) => void
  setDropdownOpen: (open: boolean) => void
  formatIncome: (value: string) => string
  validationError?: string
  hideInternalLabel?: boolean // New prop
  // className prop is implicitly available for React.FC
}

const HouseholdIncomeSection: React.FC<HouseholdIncomeSectionProps> = (props) => {
  const { hideInternalLabel } = props

  return (
    <div>
      {!hideInternalLabel && (
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <label htmlFor="income" className="block text-sm font-medium text-gray-800">
              What is your estimated household income for 2025?
            </label>
            <div className="relative ml-2 group">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-help"
                aria-label="Help for household income"
              >
                <HelpCircle size={16} />
              </button>
              <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-lg py-2 px-3 w-64 bottom-full left-1/2 -translate-x-1/2 -translate-y-1 pointer-events-none">
                Include the income of all the members in your household. Your best estimate is okay for a quick quote
                (self-employment income, salary, tips, social security, retirement income, pension, and alimony all
                apply). Ask Birdy AI for more information.
                <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <HouseholdIncomeInput {...props} />
    </div>
  )
}

export default HouseholdIncomeSection
