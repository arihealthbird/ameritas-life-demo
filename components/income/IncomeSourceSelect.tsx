"use client"

import { Briefcase, X, DollarSign } from "lucide-react"
import { DialogTitle, DialogHeader } from "@/components/ui/dialog"
import type { IncomeSourceType } from "@/types/income"

interface IncomeSourceSelectProps {
  onSelect: (type: IncomeSourceType) => void
  onCancel: () => void
}

const incomeSourceTypes = [
  {
    id: "job" as IncomeSourceType,
    name: "Full-time Job",
    description: "Regular employment with a single employer",
    icon: <Briefcase className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "part-time" as IncomeSourceType,
    name: "Part-time Job",
    description: "Employment with reduced hours",
    icon: <Briefcase className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "self-employed" as IncomeSourceType,
    name: "Self-employed",
    description: "Income from your own business",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "unemployment" as IncomeSourceType,
    name: "Unemployment",
    description: "Unemployment benefits",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "unemployed" as IncomeSourceType,
    name: "Unemployed",
    description: "No current income",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
  {
    id: "other" as IncomeSourceType,
    name: "Other",
    description: "Any other income source",
    icon: <DollarSign className="h-5 w-5 text-purple-600" />,
  },
]

export default function IncomeSourceSelect({ onSelect, onCancel }: IncomeSourceSelectProps) {
  return (
    <div className="w-full">
      <DialogHeader className="relative mb-4">
        <button
          onClick={onCancel}
          className="absolute right-0 top-0 p-1 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <DialogTitle className="text-xl font-semibold text-center">Add Income Source</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
        {incomeSourceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg p-4 text-left transition-colors flex items-start gap-3"
          >
            <div className="bg-purple-100 p-3 rounded-full flex-shrink-0 mt-1">{type.icon}</div>
            <div>
              <h3 className="font-medium text-gray-800">{type.name}</h3>
              <p className="text-sm text-gray-500">{type.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
