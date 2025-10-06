"use client"

import type React from "react"
import { useState } from "react"
import { Edit, MapPin, User, DollarSign, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/planCardUtils"
import EditQuoteDialog from "@/components/EditQuoteDialog"

interface QuoteSummaryProps {
  zipCode: string
  householdSize: number
  income: number
  subsidy: number
  onEdit: () => void
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ zipCode, householdSize, income, subsidy, onEdit }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Quote</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <MapPin size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">ZIP Code</p>
            <p className="font-medium text-gray-900">{zipCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <User size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Household</p>
            <p className="font-medium text-gray-900">{householdSize} person</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <DollarSign size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Income</p>
            <p className="font-medium text-gray-900">{formatCurrency(income)}/year</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Wallet size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Subsidy</p>
            <p className="font-medium text-purple-600">${subsidy}/mo</p>
          </div>
        </div>
      </div>

      <EditQuoteDialog isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} />
    </div>
  )
}

export default QuoteSummary
