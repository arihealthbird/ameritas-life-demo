"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { parseDateString, validateAgeRestrictions } from "@/utils/dateUtils"
import type { EligibilityType } from "@/components/EligibilityNotice"
import type { FamilyMember } from "@/components/FamilyMemberCard" // Assuming this type definition is suitable
import { Particles } from "@/components/ui/particles" // Using non-interactive for potentially better performance in modal
import PrimaryInfoLocationTab from "./EditQuoteModal/PrimaryInfoLocationTab"
import HouseholdFinanceTab from "./EditQuoteModal/HouseholdFinanceTab"
import { useToast } from "@/hooks/use-toast"
import EligibilityNotice from "@/components/EligibilityNotice"
import { X } from "lucide-react"
import type { CitizenshipStatus } from "./EditQuoteModal/PrimaryInfoLocationTab" // Define this type in the tab or a shared types file

export interface EditQuoteModalInitialData {
  zipCode: string
  householdSize: number // This will be derived mostly
  income: string
  incomeFrequency: string
  dateOfBirth: string // Primary applicant's DOB
  gender: string // Primary applicant's gender
  tobaccoUsage: string // Primary applicant's tobacco usage
  healthStatus: string // Primary applicant's health status
  familyMembers: FamilyMember[]
  citizenshipStatus: CitizenshipStatus
  numberOfChildren: number // Children for life insurance calculation
  debtAmount: string // Formatted debt amount
}

interface EditQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: EditQuoteModalInitialData
}

const EditQuoteModal: React.FC<EditQuoteModalProps> = ({ isOpen, onClose, initialData }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("primary")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEligibilityNotice, setShowEligibilityNotice] = useState(false)
  const [eligibilityType, setEligibilityType] = useState<EligibilityType>("medicare")
  const [familyMembersWithAgeRestrictions, setFamilyMembersWithAgeRestrictions] = useState<
    Array<{ type: "primary" | "spouse" | "dependent"; name?: string; age: number }>
  >([])

  // Form state
  const [zipCode, setZipCode] = useState(initialData.zipCode)
  const [dateOfBirth, setDateOfBirth] = useState(initialData.dateOfBirth) // Primary Applicant DOB
  const [gender, setGender] = useState(initialData.gender) // Primary Applicant Gender
  const [tobaccoUsage, setTobaccoUsage] = useState(initialData.tobaccoUsage) // Primary Applicant Tobacco
  const [healthStatus, setHealthStatus] = useState(initialData.healthStatus)
  const [citizenshipStatus, setCitizenshipStatus] = useState<CitizenshipStatus>(initialData.citizenshipStatus)

  const [income, setIncome] = useState(initialData.income)
  const [incomeFrequency, setIncomeFrequency] = useState(initialData.incomeFrequency)
  const [numberOfChildren, setNumberOfChildren] = useState(initialData.numberOfChildren)
  const [debtAmount, setDebtAmount] = useState(initialData.debtAmount)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialData.familyMembers || [])

  const [householdSize, setHouseholdSize] = useState(1 + (initialData.familyMembers?.length || 0))

  // Form errors
  const [errors, setErrors] = useState({
    zipCode: false,
    dateOfBirth: false,
    gender: false,
    tobaccoUsage: false,
    healthStatus: false,
    citizenshipStatus: false,
    income: false,
    // Note: numberOfChildren and debtAmount might not need explicit error states if using controlled inputs like sliders/counters
  })

  // State to track unsaved changes in child forms (e.g., family member forms)
  const [hasUnsavedFamilyChanges, setHasUnsavedFamilyChanges] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setZipCode(initialData.zipCode)
      setDateOfBirth(initialData.dateOfBirth)
      setGender(initialData.gender)
      setTobaccoUsage(initialData.tobaccoUsage)
      setHealthStatus(initialData.healthStatus)
      setCitizenshipStatus(initialData.citizenshipStatus)

      setIncome(initialData.income)
      setIncomeFrequency(initialData.incomeFrequency)
      setNumberOfChildren(initialData.numberOfChildren)
      setDebtAmount(initialData.debtAmount)
      setFamilyMembers(initialData.familyMembers || [])
      setHouseholdSize(1 + (initialData.familyMembers?.length || 0))

      // Reset errors and unsaved changes flags
      setErrors({
        zipCode: false,
        dateOfBirth: false,
        gender: false,
        tobaccoUsage: false,
        healthStatus: false,
        citizenshipStatus: false,
        income: false,
      })
      setHasUnsavedFamilyChanges(false)
      setActiveTab("primary") // Reset to the first tab
    }
  }, [isOpen, initialData])

  const formatNumericString = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits) {
      return new Intl.NumberFormat("en-US").format(Number.parseInt(digits))
    }
    return ""
  }

  useEffect(() => {
    setHouseholdSize(1 + familyMembers.length)
  }, [familyMembers])

  const checkAgeRestrictions = (): boolean => {
    const restrictedMembers: Array<{ type: "primary" | "spouse" | "dependent"; name?: string; age: number }> = []
    if (dateOfBirth) {
      const parsedDate = parseDateString(dateOfBirth)
      if (parsedDate) {
        const { isUnder19, isOver65, age } = validateAgeRestrictions(parsedDate)
        if (isUnder19 || isOver65) {
          restrictedMembers.push({ type: "primary", age: age })
        }
      }
    }
    familyMembers.forEach((member, index) => {
      if (member.includedInCoverage === false) return
      const parsedDate = parseDateString(member.dateOfBirth)
      if (parsedDate) {
        const { isUnder19, isOver65, age } = validateAgeRestrictions(parsedDate)
        if (isUnder19 || isOver65) {
          restrictedMembers.push({
            type: member.type,
            name:
              member.type === "dependent" ? `Dependent ${index + 1}` : member.type === "spouse" ? "Spouse" : undefined,
            age: age,
          })
        }
      }
    })

    if (restrictedMembers.length > 0) {
      setFamilyMembersWithAgeRestrictions(restrictedMembers)
      const hasMedicare = restrictedMembers.some((m) => (m.age || 0) > 65)
      setEligibilityType(hasMedicare ? "medicare" : "medicaid")
      setShowEligibilityNotice(true)
      return true
    }
    return false
  }

  const validateForm = (): boolean => {
    const newErrors = {
      zipCode: !zipCode || zipCode.length !== 5,
      dateOfBirth: !dateOfBirth || dateOfBirth.length < 10, // Basic check, more robust validation in tab
      gender: !gender,
      tobaccoUsage: !tobaccoUsage,
      healthStatus: !healthStatus,
      citizenshipStatus: !citizenshipStatus,
      income: !income || Number.parseFloat(income.replace(/,/g, "")) <= 0,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const proceedWithSave = () => {
    setIsSubmitting(true)
    try {
      sessionStorage.setItem("zipCode", zipCode)
      sessionStorage.setItem("dateOfBirth", dateOfBirth)
      sessionStorage.setItem("gender", gender)
      sessionStorage.setItem("tobaccoUsage", tobaccoUsage)
      sessionStorage.setItem("healthStatus", healthStatus)
      sessionStorage.setItem("citizenshipStatus", citizenshipStatus)

      sessionStorage.setItem("income", income.replace(/,/g, "")) // Matches EditQuoteModal
      sessionStorage.setItem("incomeFrequency", incomeFrequency) // Matches EditQuoteModal
      sessionStorage.setItem("incomeAmountLife", income.replace(/,/g, "")) // For /household page
      sessionStorage.setItem("incomeFrequencyLife", incomeFrequency) // For /household page

      sessionStorage.setItem("numberOfChildrenLife", numberOfChildren.toString())
      sessionStorage.setItem("debtAmountLife", debtAmount.replace(/,/g, ""))

      sessionStorage.setItem("familyMembers", JSON.stringify(familyMembers))
      sessionStorage.setItem("householdSize", (1 + familyMembers.length).toString())

      toast({
        title: "Quote Updated",
        description: "Your quote information has been updated successfully.",
      })
      onClose()
      router.push("/finding-plans") // Or appropriate page
    } catch (error) {
      console.error("Error saving quote:", error)
      toast({
        title: "Error",
        description: "There was an error updating your quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
      // Find the first tab with an error and switch to it
      if (
        errors.zipCode ||
        errors.dateOfBirth ||
        errors.gender ||
        errors.tobaccoUsage ||
        errors.healthStatus ||
        errors.citizenshipStatus
      ) {
        setActiveTab("primary")
      } else if (errors.income) {
        setActiveTab("household")
      }
      return
    }

    if (checkAgeRestrictions()) {
      // Eligibility notice will be shown. Submission continues via handleCloseEligibilityNotice if user proceeds.
      // Set isSubmitting true here so proceedWithSave is called from handleCloseEligibilityNotice
      setIsSubmitting(true)
      return
    }

    proceedWithSave()
  }

  const handleCloseEligibilityNotice = () => {
    setShowEligibilityNotice(false)
    if (isSubmitting) {
      // Only proceed if submission was initiated
      proceedWithSave()
    }
  }

  const handleAddFamilyMember = (member: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, { ...member, id: member.id || `temp-${Date.now()}` }])
  }
  const handleEditFamilyMember = (updatedMember: FamilyMember) => {
    setFamilyMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)))
  }
  const handleRemoveFamilyMember = (memberId: string) => {
    setFamilyMembers((prev) => prev.filter((member) => member.id !== memberId))
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[650px] md:max-w-[750px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 rounded-xl border-0 shadow-xl">
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <Particles
              className="absolute inset-0"
              quantity={40}
              staticity={60}
              ease={90}
              size={0.8}
              color="#fc3893"
              vx={0.1}
              vy={0.1}
            />
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Edit Your Quote
              </DialogTitle>
              <button
                onClick={onClose}
                className="absolute right-6 top-6 rounded-full h-8 w-8 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="primary"
                  className="text-sm rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Primary Info & Location
                </TabsTrigger>
                <TabsTrigger
                  value="household"
                  className="text-sm rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Household & Finances {familyMembers.length > 0 && `(+${familyMembers.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="primary" className="space-y-6 mt-2">
                <PrimaryInfoLocationTab
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  errors={errors}
                  dateOfBirth={dateOfBirth}
                  setDateOfBirth={setDateOfBirth}
                  gender={gender}
                  setGender={setGender}
                  tobaccoUsage={tobaccoUsage}
                  setTobaccoUsage={setTobaccoUsage}
                  healthStatus={healthStatus}
                  setHealthStatus={setHealthStatus}
                  citizenshipStatus={citizenshipStatus}
                  setCitizenshipStatus={setCitizenshipStatus}
                />
              </TabsContent>

              <TabsContent value="household" className="mt-2">
                <HouseholdFinanceTab
                  income={income}
                  setIncome={setIncome}
                  errors={errors}
                  incomeFrequency={incomeFrequency}
                  setIncomeFrequency={setIncomeFrequency}
                  formatNumericString={formatNumericString}
                  numberOfChildren={numberOfChildren}
                  setNumberOfChildren={setNumberOfChildren}
                  debtAmount={debtAmount}
                  setDebtAmount={setDebtAmount}
                  familyMembers={familyMembers}
                  onAddMember={handleAddFamilyMember}
                  onEditMember={handleEditFamilyMember}
                  onRemoveMember={handleRemoveFamilyMember}
                  onUnsavedChangesChange={setHasUnsavedFamilyChanges}
                  currentHouseholdSize={householdSize} // Pass calculated household size
                  mainApplicant={{ dateOfBirth, gender, tobaccoUsage }} // For age calculation in family member forms
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-full border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSubmitting || (activeTab === "household" && hasUnsavedFamilyChanges)}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:shadow-md hover:shadow-pink-500/20"
              >
                {isSubmitting ? "Saving..." : "Save Changes & Get Quote"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {showEligibilityNotice && (
        <Dialog open={showEligibilityNotice} onOpenChange={setShowEligibilityNotice}>
          <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl p-0 overflow-hidden max-h-[90vh] rounded-xl">
            <div className="max-h-[90vh] overflow-y-auto">
              <EligibilityNotice
                type={eligibilityType}
                familyMembers={familyMembersWithAgeRestrictions}
                onClose={handleCloseEligibilityNotice}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default EditQuoteModal
