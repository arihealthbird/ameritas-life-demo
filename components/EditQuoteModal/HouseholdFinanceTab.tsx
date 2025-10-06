"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { DollarSign, Users, Info, Plus, Home, Scale, UserMinus, UserPlus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { FamilyMember } from "@/components/FamilyMemberCard"
import FamilyMemberCard from "@/components/FamilyMemberCard"
import FamilyMemberForm from "@/components/FamilyMemberForm"
import type { FamilyMemberFormRef } from "@/components/FamilyMemberForm"
import { cn } from "@/lib/utils"
import { calculateAge } from "@/utils/dateUtils" // Ensure this is available

interface HouseholdFinanceTabProps {
  income: string
  setIncome: (income: string) => void
  incomeFrequency: string
  setIncomeFrequency: (freq: string) => void
  formatNumericString: (value: string) => string

  numberOfChildren: number
  setNumberOfChildren: (count: number) => void

  debtAmount: string
  setDebtAmount: (amount: string) => void

  familyMembers: FamilyMember[]
  onAddMember: (member: FamilyMember) => void
  onEditMember: (member: FamilyMember) => void
  onRemoveMember: (memberId: string) => void
  onUnsavedChangesChange: (hasUnsavedChanges: boolean) => void

  errors: {
    income?: boolean
  }
  currentHouseholdSize: number // Added to display current household size

  // Main applicant info needed for FamilyMemberForm context (e.g., age checks)
  mainApplicant: {
    dateOfBirth: string
    gender: string
    tobaccoUsage: string
  }
}

const HouseholdFinanceTab: React.FC<HouseholdFinanceTabProps> = ({
  income,
  setIncome,
  incomeFrequency,
  setIncomeFrequency,
  formatNumericString,
  numberOfChildren,
  setNumberOfChildren,
  debtAmount,
  setDebtAmount,
  familyMembers,
  onAddMember,
  onEditMember,
  onRemoveMember,
  onUnsavedChangesChange,
  errors,
  currentHouseholdSize,
  mainApplicant,
}) => {
  const [showSpouseForm, setShowSpouseForm] = useState(false)
  const [showDependentForm, setShowDependentForm] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)

  const hasSpouse = familyMembers.some((member) => member.type === "spouse")
  const spouseMembers = familyMembers.filter((member) => member.type === "spouse")
  const dependentMembers = familyMembers.filter((member) => member.type === "dependent")

  const spouseFormRef = useRef<FamilyMemberFormRef>(null)
  const dependentFormRef = useRef<FamilyMemberFormRef>(null)

  useEffect(() => {
    onUnsavedChangesChange(showSpouseForm || showDependentForm)
  }, [showSpouseForm, showDependentForm, onUnsavedChangesChange])

  const handleAddSpouse = () => {
    setShowSpouseForm(true)
    setShowDependentForm(false)
    setEditingMember(null)
  }

  const handleAddDependent = () => {
    setShowDependentForm(true)
    setShowSpouseForm(false)
    setEditingMember(null)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setShowSpouseForm(member.type === "spouse")
    setShowDependentForm(member.type === "dependent")
  }

  const handleSaveMember = (memberData: FamilyMember) => {
    if (editingMember && memberData.id) {
      // Ensure memberData has an ID for editing
      onEditMember(memberData)
    } else {
      // For new members, ensure an ID is generated if not provided by form
      const newMember = { ...memberData, id: memberData.id || `member-${Date.now()}` }
      onAddMember(newMember)
    }
    setShowSpouseForm(false)
    setShowDependentForm(false)
    setEditingMember(null)
  }

  const handleCancelForm = () => {
    setShowSpouseForm(false)
    setShowDependentForm(false)
    setEditingMember(null)
  }

  const handleFormChange = (isComplete: boolean, formData?: FamilyMember) => {
    // This function is for FamilyMemberForm's autoSave or completeness tracking
    // We mainly rely on the explicit Save Spouse/Dependent buttons here
  }

  return (
    <div className="space-y-8">
      {/* Household Size Summary - adapted from FamilyMembersTab */}
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Home className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="font-medium text-purple-900">Household Size: {currentHouseholdSize}</h3>
        </div>
        <div className="text-sm text-purple-700 space-y-1">
          <p>• 1 Primary Applicant</p>
          {spouseMembers.length > 0 && <p>• {spouseMembers.length} Spouse</p>}
          {dependentMembers.length > 0 && (
            <p>
              • {dependentMembers.length} {dependentMembers.length === 1 ? "Dependent" : "Dependents"}
            </p>
          )}
        </div>
        <div className="mt-3 flex items-center text-xs text-purple-600 bg-purple-100 p-2 rounded">
          <Info size={14} className="mr-1" />
          <span>Family members added below contribute to this household size.</span>
        </div>
      </div>

      {/* Financial Information Section - adapted from BasicInfoTab */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="income" className="text-base font-medium text-gray-800">
              Household Income
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Select value={incomeFrequency} onValueChange={setIncomeFrequency}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annually">Yearly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative col-span-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <DollarSign size={20} />
                </div>
                <Input
                  id="income"
                  placeholder="Enter income"
                  value={income}
                  onChange={(e) => setIncome(formatNumericString(e.target.value))}
                  className={cn(
                    "pl-10 h-14 text-base rounded-lg",
                    errors.income ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                  )}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Estimated household income before taxes.</p>
            {errors.income && <p className="text-red-500 text-xs mt-1">Please enter a valid income.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="debtAmount" className="text-base font-medium text-gray-800">
              Total Debt
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Scale size={20} />
              </div>
              <Input
                id="debtAmount"
                placeholder="Enter total debt"
                value={debtAmount}
                onChange={(e) => setDebtAmount(formatNumericString(e.target.value))}
                className="pl-10 h-14 text-base rounded-lg border-gray-300"
              />
            </div>
            <p className="text-sm text-gray-500">Approximate total household debt (optional).</p>
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Children</h3>
        <div className="space-y-2">
          <Label htmlFor="numberOfChildren" className="text-base font-medium text-gray-800">
            Number of Children (under 18)
          </Label>
          <div className="flex items-center space-x-3 max-w-xs">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumberOfChildren(Math.max(0, numberOfChildren - 1))}
              className="rounded-full"
            >
              <UserMinus size={18} />
            </Button>
            <Input
              id="numberOfChildren"
              type="text"
              value={numberOfChildren}
              readOnly
              className="h-14 text-center text-xl font-medium rounded-lg w-20"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumberOfChildren(numberOfChildren + 1)}
              className="rounded-full"
            >
              <UserPlus size={18} />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Number of children under 18 in your household for life insurance planning. Add dependents requiring health
            coverage below.
          </p>
        </div>
      </div>

      {/* Family Members Section - adapted from FamilyMembersTab */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Family Members for Health Coverage</h3>
          </div>
          <div className="flex space-x-2">
            {!hasSpouse && !showSpouseForm && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={handleAddSpouse}
                disabled={showDependentForm}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Spouse
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
              onClick={handleAddDependent}
              disabled={showSpouseForm || showDependentForm}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Dependent
            </Button>
          </div>
        </div>

        {/* Spouse Form */}
        {showSpouseForm && (
          <div className="p-4 border rounded-lg mt-4 bg-gray-50">
            <h4 className="text-md font-semibold mb-3 text-pink-700">
              {editingMember && editingMember.type === "spouse" ? "Edit Spouse" : "Add Spouse"}
            </h4>
            <FamilyMemberForm
              type="spouse"
              onSave={(data) => {
                /* AutoSave is false, handled by button */
              }}
              onCancel={handleCancelForm}
              existingMember={editingMember?.type === "spouse" ? editingMember : undefined}
              autoSave={false}
              ref={spouseFormRef}
              formId={editingMember?.id || "new-spouse-form"}
              onFormChange={handleFormChange}
              mainApplicantAge={mainApplicant.dateOfBirth ? calculateAge(new Date(mainApplicant.dateOfBirth)) : null}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button variant="outline" onClick={handleCancelForm}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (spouseFormRef.current && spouseFormRef.current.validateAndGetData()) {
                    const memberData = spouseFormRef.current.validateAndGetData()
                    if (memberData) handleSaveMember(memberData)
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                Save Spouse
              </Button>
            </div>
          </div>
        )}

        {/* Dependent Form */}
        {showDependentForm && (
          <div className="p-4 border rounded-lg mt-4 bg-gray-50">
            <h4 className="text-md font-semibold mb-3 text-purple-700">
              {editingMember && editingMember.type === "dependent" ? "Edit Dependent" : "Add Dependent"}
            </h4>
            <FamilyMemberForm
              type="dependent"
              onSave={(data) => {
                /* AutoSave is false, handled by button */
              }}
              onCancel={handleCancelForm}
              existingMember={editingMember?.type === "dependent" ? editingMember : undefined}
              autoSave={false}
              ref={dependentFormRef}
              formId={editingMember?.id || "new-dependent-form"}
              onFormChange={handleFormChange}
              mainApplicantAge={mainApplicant.dateOfBirth ? calculateAge(new Date(mainApplicant.dateOfBirth)) : null}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button variant="outline" onClick={handleCancelForm}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (dependentFormRef.current && dependentFormRef.current.validateAndGetData()) {
                    const memberData = dependentFormRef.current.validateAndGetData()
                    if (memberData) handleSaveMember(memberData)
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                Save Dependent
              </Button>
            </div>
          </div>
        )}

        {/* Family Member Cards */}
        {familyMembers.length > 0 && !showSpouseForm && !showDependentForm && (
          <div className="space-y-4 mt-6">
            {familyMembers.map((member) => (
              <FamilyMemberCard key={member.id} member={member} onEdit={handleEditMember} onDelete={onRemoveMember} />
            ))}
          </div>
        )}

        {/* Empty state for family members */}
        {familyMembers.length === 0 && !showSpouseForm && !showDependentForm && (
          <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 mt-4">
            <p className="text-gray-600 mb-1">No family members added for health coverage.</p>
            <p className="text-gray-500 text-sm">
              Use the buttons above to add a spouse or dependents if they need coverage.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HouseholdFinanceTab
