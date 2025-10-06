"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  User,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Users,
  Mail,
  Home,
  Shield,
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  Building,
  Phone,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { useToast } from "@/hooks/use-toast"
import { Stepper, type Step } from "@/components/Stepper"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { formatCurrency } from "@/utils/formatters"
import { cn } from "@/lib/utils"
import type { IncomeSource, IncomeSourceType, FrequencyType } from "@/types/income"
import type { FamilyMember } from "@/components/FamilyMemberCard"
import type { InsurancePlan } from "@/types/plans"
import { mockPlans } from "@/data/mockPlans"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Age validation utility functions
const parseDateString = (dateString: string): Date | null => {
  if (!dateString) return null

  // Handle MM/DD/YYYY format
  if (dateString.includes("/")) {
    const [month, day, year] = dateString.split("/").map(Number)
    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month - 1, day)
    }
  }

  // Try standard date parsing
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

const validateAgeRestrictions = (birthDate: Date) => {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  // Adjust age if birthday hasn't occurred yet this year
  const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age

  return {
    isUnder19: adjustedAge < 19,
    isOver65: adjustedAge > 65,
    age: adjustedAge,
  }
}

// Define the enrollment steps for primary applicant
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "incarceration", name: "Incarceration" },
  { id: "demographics", name: "Demographics" },
  { id: "income", name: "Income" },
  { id: "tobacco", name: "Tobacco Usage" },
  { id: "review", name: "Review" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

// Define enrollment steps for dependents and spouses
const familyMemberSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "incarceration", name: "Incarceration" },
  { id: "demographics", name: "Demographics" },
  { id: "income", name: "Income" },
  { id: "tobacco", name: "Tobacco Usage" },
]

// Income source types
const incomeSourceTypes = [
  { id: "job", name: "Full-time Job", description: "Regular employment with a single employer" },
  { id: "self-employed", name: "Self-employed", description: "Income from your own business" },
  { id: "unemployment", name: "Unemployment", description: "Unemployment benefits" },
  { id: "unemployed", name: "Unemployed", description: "No current income" },
  { id: "other", name: "Other", description: "Any other income source" },
]

// Frequency options
const frequencyOptions = [
  { id: "yearly", label: "Yearly" },
  { id: "monthly", label: "Monthly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "weekly", label: "Weekly" },
]

interface AccordionSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  isEnrolled?: boolean
  onContinue?: () => void
  continueText?: string
  defaultOpen?: boolean
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  children,
  className,
  isEnrolled = false,
  onContinue,
  continueText = "Continue",
  defaultOpen = false,
}) => {
  const [expanded, setExpanded] = useState(defaultOpen)

  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden mb-4", className)}>
      <div
        className="bg-white px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">{icon}</div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          {isEnrolled && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Done</span>
            </span>
          )}
        </div>
        <div className="flex items-center">
          {onContinue && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onContinue()
              }}
              className="mr-2 text-xs"
            >
              {continueText}
            </Button>
          )}
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && <div className="border-t border-gray-200 p-4 bg-gray-50">{children}</div>}
    </div>
  )
}

interface EditableSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  onEdit?: () => void
  className?: string
  showEdit?: boolean
  isEditing?: boolean
  onSave?: () => void
  onCancel?: () => void
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  icon,
  children,
  onEdit,
  className,
  showEdit = true,
  isEditing = false,
  onSave,
  onCancel,
}) => {
  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden mb-4", className)}>
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">{icon}</div>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center">
          {isEditing ? (
            <>
              <Button size="sm" onClick={onSave} className="mr-2 bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel} className="mr-2 border-gray-300">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            showEdit &&
            onEdit && (
              <button
                onClick={onEdit}
                className="text-gray-500 hover:text-purple-600 mr-2"
                aria-label={`Edit ${title}`}
              >
                <Edit className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">{children}</div>
    </div>
  )
}

// Editable field component
const EditableField: React.FC<{
  label: string
  value: string | React.ReactNode
  isEditing: boolean
  onChange?: (value: string) => void
  onChangeImmediate?: (value: string) => void // Add this prop
  type?: string
  options?: { value: string; label: string }[]
  question?: string
  className?: string
  error?: string
  placeholder?: string
  required?: boolean
}> = ({
  label,
  value,
  isEditing,
  onChange = () => {},
  onChangeImmediate, // Add this prop
  type = "text",
  options = [],
  question,
  className,
  error,
  placeholder = "Enter information",
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSelectChange = (val: string) => {
    onChange(val)
    // Call immediate change handler if provided
    if (onChangeImmediate) {
      onChangeImmediate(val)
    }
  }

  // Display value with fallback for empty values
  const displayValue = value === "" || value === undefined || value === null ? "—" : value

  return (
    <div className={cn("mb-3", className)}>
      {question && <p className="text-sm text-gray-700 mb-1">{question}</p>}
      <p className="text-xs text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </p>

      {isEditing ? (
        <>
          {type === "select" ? (
            <Select defaultValue={value as string} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === "radio" ? (
            <RadioGroup
              defaultValue={value as string}
              onValueChange={(val) => {
                onChange(val)
                if (onChangeImmediate) onChangeImmediate(val)
              }}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : type === "checkbox" ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`checkbox-${label}`}
                checked={value === "true" || value === true}
                onCheckedChange={(checked) => {
                  const val = checked ? "true" : "false"
                  onChange(val)
                  if (onChangeImmediate) onChangeImmediate(val)
                }}
              />
              <Label htmlFor={`checkbox-${label}`}>{label}</Label>
            </div>
          ) : (
            <Input
              type={type}
              value={value as string}
              onChange={handleChange}
              className="w-full"
              placeholder={placeholder}
            />
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      ) : (
        <p className="text-sm text-gray-800 font-medium">{displayValue}</p>
      )}
    </div>
  )
}

// Field display component
const Field: React.FC<{ label: string; value: string | React.ReactNode; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <div className={cn("mb-3", className)}>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value}</p>
  </div>
)

export default function ReviewPage() {
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId") || ""

  // Application data states
  const [plan, setPlan] = useState<InsurancePlan | null>(null)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [primaryApplicant, setPrimaryApplicant] = useState<{
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    tobaccoUsage: string
    tobaccoLastUsed?: string
    email: string
    phoneNumber: string
    address: string
    city: string
    state: string
    zipCode: string
    ssn: string
    isUSCitizen: string
    immigrationDocumentType: string | null
    isIncarcerated: string
    isPendingDisposition: string | null
    hispanicOrigin: string
    race: string
    incomeSources: IncomeSource[]
  } | null>(null)

  // Add state for tracking which sections are being edited
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})

  // Add state for editable fields
  const [editedValues, setEditedValues] = useState<Record<string, any>>({})

  // Add state for field validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Add state for income source editing
  const [showIncomeSourceForm, setShowIncomeSourceForm] = useState(false)
  const [editingIncomeSource, setEditingIncomeSource] = useState<IncomeSource | null>(null)
  const [incomeSourceIndex, setIncomeSourceIndex] = useState<number | null>(null)

  // Track enrollment progress for dependents/spouse
  const [enrolledFamilyMembers, setEnrolledFamilyMembers] = useState<Record<string, boolean>>({})
  const [showContinueDialog, setShowContinueDialog] = useState(false)
  const [nextFamilyMember, setNextFamilyMember] = useState<{
    id: string
    type: "spouse" | "dependent"
    name?: string
  } | null>(null)

  const [inlineEditingIncomeSource, setInlineEditingIncomeSource] = useState<{
    index: number | null
    source: IncomeSource | null
    memberId?: string | null
  }>({
    index: null,
    source: null,
    memberId: null,
  })

  // State for eligibility notice
  const [showEligibilityNotice, setShowEligibilityNotice] = useState(false)
  const [eligibilityType, setEligibilityType] = useState<"medicare" | "medicaid" | null>(null)
  const [familyMembersWithAgeRestrictions, setFamilyMembersWithAgeRestrictions] = useState<
    Array<{ type: "primary" | "spouse" | "dependent"; name?: string; age: number }>
  >([])

  // State for pending family members
  const [pendingFamilyMembers, setPendingFamilyMembers] = useState<Record<string, FamilyMember>>({})

  // State for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load data from session storage
  useEffect(() => {
    const loadPlanData = () => {
      // Find the plan based on planId
      const foundPlan = mockPlans.find((p) => p.id === planId)

      if (foundPlan) {
        setPlan(foundPlan)
      } else {
        // Use a fallback plan if not found
        setPlan(mockPlans[0])
      }
    }

    const loadUserData = () => {
      try {
        // Load primary applicant data
        const firstName = sessionStorage.getItem("firstName") || ""
        const lastName = sessionStorage.getItem("lastName") || ""

        // Ensure date of birth is properly formatted (MM/DD/YYYY)
        let dateOfBirth = sessionStorage.getItem("dateOfBirth") || ""
        if (dateOfBirth && !dateOfBirth.includes("/")) {
          // If stored in a different format, convert to MM/DD/YYYY
          try {
            const date = new Date(dateOfBirth)
            if (!isNaN(date.getTime())) {
              const month = (date.getMonth() + 1).toString().padStart(2, "0")
              const day = date.getDate().toString().padStart(2, "0")
              const year = date.getFullYear()
              dateOfBirth = `${month}/${day}/${year}`
            }
          } catch (e) {
            console.error("Error formatting date:", e)
          }
        }

        const gender = sessionStorage.getItem("gender") || ""

        // Load tobacco usage data from multiple possible sources
        let tobaccoUsage = ""
        let tobaccoLastUsed = undefined

        // First check tobaccoUsageData
        const tobaccoUsageData = sessionStorage.getItem("tobaccoUsageData")
        if (tobaccoUsageData) {
          try {
            const parsedData = JSON.parse(tobaccoUsageData)
            tobaccoUsage = parsedData.isTobaccoUser || ""
            if (parsedData.isTobaccoUser === "yes" && parsedData.lastUsageDate) {
              tobaccoLastUsed = parsedData.lastUsageDate
            }
          } catch (e) {
            console.error("Error parsing tobacco usage data:", e)
          }
        }

        // If not found, check personalInfo
        if (!tobaccoUsage) {
          const personalInfoJson = sessionStorage.getItem("personalInfo")
          if (personalInfoJson) {
            try {
              const personalInfo = JSON.parse(personalInfoJson)
              tobaccoUsage = personalInfo.tobaccoUser || personalInfo.tobaccoUsage || ""
              tobaccoLastUsed = personalInfo.tobaccoLastUsed
            } catch (e) {
              console.error("Error parsing personal info for tobacco data:", e)
            }
          }
        }

        // If still not found, check basicInfo
        if (!tobaccoUsage) {
          const basicInfoJson = sessionStorage.getItem("basicInfo")
          if (basicInfoJson) {
            try {
              const basicInfo = JSON.parse(basicInfoJson)
              tobaccoUsage = basicInfo.tobaccoUser || basicInfo.tobaccoUsage || ""
              tobaccoLastUsed = basicInfo.tobaccoLastUsed
            } catch (e) {
              console.error("Error parsing basic info for tobacco data:", e)
            }
          }
        }

        const email = sessionStorage.getItem("email") || sessionStorage.getItem("userEmail") || ""
        const phoneNumber = sessionStorage.getItem("phoneNumber") || ""
        const address = sessionStorage.getItem("address") || sessionStorage.getItem("addressLine1") || ""
        const city = sessionStorage.getItem("city") || ""
        const state = sessionStorage.getItem("state") || ""
        const zipCode = sessionStorage.getItem("zipCode") || ""
        const ssn = sessionStorage.getItem("ssn") || "•••-••-••••"
        const isUSCitizen = sessionStorage.getItem("isUSCitizen") || ""
        const immigrationDocumentType = sessionStorage.getItem("immigrationDocumentType")
        const isIncarcerated = sessionStorage.getItem("isIncarcerated") || ""
        const isPendingDisposition = sessionStorage.getItem("isPendingDisposition")
        const hispanicOrigin = sessionStorage.getItem("hispanicOrigin") || ""
        const race = sessionStorage.getItem("race") || ""

        // Load income sources
        let incomeSources: IncomeSource[] = []
        const incomeSourcesJson = sessionStorage.getItem("incomeSources")
        if (incomeSourcesJson) {
          incomeSources = JSON.parse(incomeSourcesJson)
        }

        // Set primary applicant data
        setPrimaryApplicant({
          firstName,
          lastName,
          dateOfBirth,
          gender,
          tobaccoUsage,
          tobaccoLastUsed,
          email,
          phoneNumber,
          address,
          city,
          state,
          zipCode,
          ssn,
          isUSCitizen,
          immigrationDocumentType,
          isIncarcerated,
          isPendingDisposition,
          hispanicOrigin,
          race,
          incomeSources,
        })

        // Load family members
        const familyMembersJson = sessionStorage.getItem("familyMembers")
        if (familyMembersJson) {
          const parsedFamilyMembers = JSON.parse(familyMembersJson)

          // Ensure each family member has an incomeSources array
          parsedFamilyMembers.forEach((member) => {
            // Check if we have income sources saved for this family member
            const memberIncomeSourcesJson = sessionStorage.getItem(`incomeSources_${member.id}`)
            if (memberIncomeSourcesJson) {
              try {
                member.incomeSources = JSON.parse(memberIncomeSourcesJson)
              } catch (e) {
                console.error(`Error parsing income sources for family member ${member.id}:`, e)
                member.incomeSources = []
              }
            } else {
              member.incomeSources = []
            }

            // Load tobacco usage data for family member
            const memberTobaccoDataJson = sessionStorage.getItem(`tobaccoUsageData_${member.id}`)
            if (memberTobaccoDataJson) {
              try {
                const tobaccoData = JSON.parse(memberTobaccoDataJson)
                member.tobaccoUsage = tobaccoData.isTobaccoUser
                member.tobaccoUser = tobaccoData.isTobaccoUser
                member.tobaccoLastUsed = tobaccoData.lastUsageDate
              } catch (e) {
                console.error(`Error parsing tobacco data for family member ${member.id}:`, e)
              }
            }
          })

          setFamilyMembers(parsedFamilyMembers)

          // Initialize enrollment tracking for family members
          const enrollmentStatus: Record<string, boolean> = {}
          parsedFamilyMembers.forEach((member: FamilyMember) => {
            enrollmentStatus[member.id] = false
          })

          // Load enrollment status if available
          const enrolledMembersJson = sessionStorage.getItem("enrolledFamilyMembers")
          if (enrolledMembersJson) {
            try {
              const enrolledMembers = JSON.parse(enrolledMembersJson)
              setEnrolledFamilyMembers(enrolledMembers)
            } catch (e) {
              console.error("Error parsing enrolled members:", e)
              setEnrolledFamilyMembers(enrollmentStatus)
            }
          } else {
            setEnrolledFamilyMembers(enrollmentStatus)
          }
        }

        // Load pending family members
        const pendingFamilyMembersJson = sessionStorage.getItem("pendingFamilyMembers")
        if (pendingFamilyMembersJson) {
          try {
            const parsedPendingFamilyMembers = JSON.parse(pendingFamilyMembersJson)
            setPendingFamilyMembers(parsedPendingFamilyMembers)
          } catch (e) {
            console.error("Error parsing pending family members:", e)
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Data loading error",
          description: "There was an error loading your application data. Some information may be missing.",
          variant: "destructive",
        })
      }
    }

    loadPlanData()
    loadUserData()
    setLoading(false)
  }, [planId, toast])

  // Handle edit action for a section
  const handleEditSection = (section: string, applicant = "primary", index: number | null = null) => {
    const sectionKey = `${applicant}-${section}-${index !== null ? index : "main"}`

    // Initialize edited values if entering edit mode
    if (!editingSections[sectionKey]) {
      // Clone the current values for this section
      let initialValues: Record<string, any> = {}
      let existingData = null

      if (applicant === "primary") {
        existingData = primaryApplicant
        if (section === "personal") {
          initialValues = {
            firstName: primaryApplicant?.firstName || "",
            lastName: primaryApplicant?.lastName || "",
            dateOfBirth: primaryApplicant?.dateOfBirth || "",
            gender: primaryApplicant?.gender || "",
            tobaccoUsage: primaryApplicant?.tobaccoUsage || "",
          }
        } else if (section === "contact") {
          initialValues = {
            email: primaryApplicant?.email || "",
            phoneNumber: primaryApplicant?.phoneNumber || "",
          }
        } else if (section === "address") {
          initialValues = {
            address: primaryApplicant?.address || "",
            city: primaryApplicant?.city || "",
            state: primaryApplicant?.state || "",
            zipCode: primaryApplicant?.zipCode || "",
          }
        } else if (section === "identity") {
          initialValues = {
            ssn: primaryApplicant?.ssn || "",
            isUSCitizen: primaryApplicant?.isUSCitizen || "",
            immigrationDocumentType: primaryApplicant?.immigrationDocumentType || "",
            isIncarcerated: primaryApplicant?.isIncarcerated || "",
            isPendingDisposition: primaryApplicant?.isPendingDisposition || "",
            hispanicOrigin: primaryApplicant?.hispanicOrigin || "",
            race: primaryApplicant?.race || "",
            tobaccoUsage: primaryApplicant?.tobaccoUsage || "",
          }
        }
      } else if (applicant.startsWith("spouse") || applicant.startsWith("dependent")) {
        const parts = applicant.split("-")
        const type = parts[0]
        const memberId = parts[1]

        const member = familyMembers.find((m) => m.id === memberId)

        if (member) {
          existingData = member
          if (section === "personal") {
            initialValues = {
              firstName: member.firstName || "",
              lastName: member.lastName || "",
              dateOfBirth: member.dateOfBirth || "",
              gender: member.gender || "",
              tobaccoUsage: member.tobaccoUsage || "",
              includedInCoverage: member.includedInCoverage ? "true" : "false",
            }
          } else if (section === "contact") {
            initialValues = {
              email: member.email || "",
              phoneNumber: member.phoneNumber || "",
            }
          } else if (section === "identity") {
            initialValues = {
              ssn: member.ssn || "",
              isUSCitizen: member.isUSCitizen || "",
              immigrationDocumentType: member.immigrationDocumentType || "",
              isIncarcerated: member.isIncarcerated || "",
              isPendingDisposition: member.isPendingDisposition || "",
              hispanicOrigin: member.hispanicOrigin || "",
              race: member.race || "",
              tobaccoUsage: member.tobaccoUsage || member.tobaccoUser || "",
            }
          }
        }
      }

      initialValues = initializeEditedValues(section, applicant, initialValues, existingData)

      setEditedValues((prev) => ({
        ...prev,
        [sectionKey]: initialValues,
      }))
    }

    // Toggle edit mode for this section
    setEditingSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  // Validate fields
  const validateFields = (section: string, values: Record<string, any>): boolean => {
    const errors: Record<string, string> = {}

    if (section === "personal") {
      if (!values.firstName?.trim()) {
        errors["firstName"] = "First name is required"
      }
      if (!values.lastName?.trim()) {
        errors["lastName"] = "Last name is required"
      }
      if (!values.dateOfBirth) {
        errors["dateOfBirth"] = "Date of birth is required"
      }
      if (!values.gender) {
        errors["gender"] = "Gender is required"
      }
      if (!values.tobaccoUsage) {
        errors["tobaccoUsage"] = "Tobacco usage information is required"
      }
    } else if (section === "contact") {
      if (!values.email?.trim()) {
        errors["email"] = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors["email"] = "Please enter a valid email address"
      }
      if (!values.phoneNumber?.trim()) {
        errors["phoneNumber"] = "Phone number is required"
      }
    } else if (section === "address") {
      if (!values.address?.trim()) {
        errors["address"] = "Address is required"
      }
      if (!values.city?.trim()) {
        errors["city"] = "City is required"
      }
      if (!values.state?.trim()) {
        errors["state"] = "State is required"
      }
      if (!values.zipCode?.trim()) {
        errors["zipCode"] = "ZIP code is required"
      } else if (!/^\d{5}(-\d{4})?$/.test(values.zipCode)) {
        errors["zipCode"] = "Please enter a valid ZIP code"
      }
    } else if (section === "identity") {
      if (values.isUSCitizen === "no" && !values.immigrationDocumentType) {
        errors["immigrationDocumentType"] = "Immigration document type is required"
      }
      if (values.isIncarcerated === "yes" && !values.isPendingDisposition) {
        errors["isPendingDisposition"] = "Pending disposition status is required"
      }
      if (!values.tobaccoUsage) {
        errors["tobaccoUsage"] = "Tobacco usage information is required"
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Ensure edited values are properly initialized from existing data
  const initializeEditedValues = (section: any, applicant: any, values: any, existingData: any) => {
    // Make sure we're not initializing with empty values when real data exists
    const result = { ...values }

    // For each field, use the existing data if the edited value is empty
    Object.keys(result).forEach((key) => {
      if (
        (result[key] === "" || result[key] === undefined || result[key] === null) &&
        existingData &&
        existingData[key] !== undefined &&
        existingData[key] !== null
      ) {
        result[key] = existingData[key]
      }
    })

    // Special handling for Hispanic/Latino origin and race/ethnicity
    if (section === "identity" && existingData) {
      if (!result.hispanicOrigin && existingData.hispanicOrigin) {
        result.hispanicOrigin = existingData.hispanicOrigin
      }
      if (!result.race && existingData.race) {
        result.race = existingData.race
      }
      if (!result.tobaccoUsage && (existingData.tobaccoUsage || existingData.tobaccoUser)) {
        result.tobaccoUsage = existingData.tobaccoUsage || existingData.tobaccoUser
      }
    }

    return result
  }

  // Save edited values for a section
  const handleSaveSection = (section: string, applicant = "primary", index: number | null = null) => {
    const sectionKey = `${applicant}-${section}-${index !== null ? index : "main"}`
    const sectionValues = editedValues[sectionKey] || {}

    // Validate fields before saving
    if (!validateFields(section, sectionValues)) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors before saving.",
        variant: "destructive",
      })
      return
    }

    try {
      // Update the appropriate data based on section and applicant type
      if (applicant === "primary") {
        if (section === "personal") {
          setPrimaryApplicant((prev) => ({
            ...prev!,
            firstName: sectionValues.firstName || prev!.firstName,
            lastName: sectionValues.lastName || prev!.lastName,
            dateOfBirth: sectionValues.dateOfBirth || prev!.dateOfBirth,
            gender: sectionValues.gender || prev!.gender,
            tobaccoUsage: sectionValues.tobaccoUsage || prev!.tobaccoUsage,
          }))

          // Update session storage
          sessionStorage.setItem("firstName", sectionValues.firstName)
          sessionStorage.setItem("lastName", sectionValues.lastName)
          sessionStorage.setItem("dateOfBirth", sectionValues.dateOfBirth)
          sessionStorage.setItem("gender", sectionValues.gender)
          sessionStorage.setItem("tobaccoUsage", sectionValues.tobaccoUsage)
        } else if (section === "contact") {
          setPrimaryApplicant((prev) => ({
            ...prev!,
            email: sectionValues.email || prev!.email,
            phoneNumber: sectionValues.phoneNumber || prev!.phoneNumber,
          }))

          sessionStorage.setItem("email", sectionValues.email)
          sessionStorage.setItem("phoneNumber", sectionValues.phoneNumber)
        } else if (section === "address") {
          setPrimaryApplicant((prev) => ({
            ...prev!,
            address: sectionValues.address || prev!.address,
            city: sectionValues.city || prev!.city,
            state: sectionValues.state || prev!.state,
            zipCode: sectionValues.zipCode || prev!.zipCode,
          }))

          sessionStorage.setItem("address", sectionValues.address)
          sessionStorage.setItem("city", sectionValues.city)
          sessionStorage.setItem("state", sectionValues.state)
          sessionStorage.setItem("zipCode", sectionValues.zipCode)
        } else if (section === "identity") {
          setPrimaryApplicant((prev) => ({
            ...prev!,
            ssn: sectionValues.ssn || prev!.ssn,
            isUSCitizen: sectionValues.isUSCitizen || prev!.isUSCitizen,
            immigrationDocumentType: sectionValues.immigrationDocumentType || prev!.immigrationDocumentType,
            isIncarcerated: sectionValues.isIncarcerated || prev!.isIncarcerated,
            isPendingDisposition: sectionValues.isPendingDisposition || prev!.isPendingDisposition,
            hispanicOrigin: sectionValues.hispanicOrigin || prev!.hispanicOrigin,
            race: sectionValues.race || prev!.race,
            tobaccoUsage: sectionValues.tobaccoUsage || prev!.tobaccoUsage,
          }))

          // Update session storage
          if (sectionValues.ssn !== "•••-••-••••") {
            sessionStorage.setItem("ssn", sectionValues.ssn)
          }
          sessionStorage.setItem("isUSCitizen", sectionValues.isUSCitizen)
          if (sectionValues.immigrationDocumentType) {
            sessionStorage.setItem("immigrationDocumentType", sectionValues.immigrationDocumentType)
          }
          sessionStorage.setItem("isIncarcerated", sectionValues.isIncarcerated)
          if (sectionValues.isPendingDisposition) {
            sessionStorage.setItem("isPendingDisposition", sectionValues.isPendingDisposition)
          }
          sessionStorage.setItem("hispanicOrigin", sectionValues.hispanicOrigin)
          sessionStorage.setItem("race", sectionValues.race)
          sessionStorage.setItem("tobaccoUsage", sectionValues.tobaccoUsage)

          // Update tobacco usage data if it exists
          const tobaccoUsageDataJson = sessionStorage.getItem("tobaccoUsageData")
          if (tobaccoUsageDataJson) {
            try {
              const tobaccoData = JSON.parse(tobaccoUsageDataJson)
              tobaccoData.isTobaccoUser = sectionValues.tobaccoUsage
              sessionStorage.setItem("tobaccoUsageData", JSON.stringify(tobaccoData))
            } catch (e) {
              console.error("Error updating tobacco usage data:", e)
            }
          }
        }
      } else if (applicant.startsWith("spouse") || applicant.startsWith("dependent")) {
        const parts = applicant.split("-")
        const type = parts[0]
        const memberId = parts[1]

        const updatedFamilyMembers = [...familyMembers]
        const memberIndex = updatedFamilyMembers.findIndex((m) => m.id === memberId)

        if (memberIndex !== -1) {
          if (section === "personal") {
            updatedFamilyMembers[memberIndex] = {
              ...updatedFamilyMembers[memberIndex],
              firstName: sectionValues.firstName || updatedFamilyMembers[memberIndex].firstName || "",
              lastName: sectionValues.lastName || updatedFamilyMembers[memberIndex].lastName || "",
              dateOfBirth: sectionValues.dateOfBirth || updatedFamilyMembers[memberIndex].dateOfBirth || "",
              gender: sectionValues.gender || updatedFamilyMembers[memberIndex].gender || "",
              tobaccoUsage: sectionValues.tobaccoUsage || updatedFamilyMembers[memberIndex].tobaccoUsage || "",
              includedInCoverage: sectionValues.includedInCoverage === "true",
            }
          } else if (section === "contact") {
            updatedFamilyMembers[memberIndex] = {
              ...updatedFamilyMembers[memberIndex],
              email: sectionValues.email || updatedFamilyMembers[memberIndex].email || "",
              phoneNumber: sectionValues.phoneNumber || updatedFamilyMembers[memberIndex].phoneNumber || "",
            }
          } else if (section === "identity") {
            updatedFamilyMembers[memberIndex] = {
              ...updatedFamilyMembers[memberIndex],
              ssn: sectionValues.ssn || updatedFamilyMembers[memberIndex].ssn || "",
              isUSCitizen: sectionValues.isUSCitizen || updatedFamilyMembers[memberIndex].isUSCitizen || "",
              immigrationDocumentType:
                sectionValues.immigrationDocumentType ||
                updatedFamilyMembers[memberIndex].immigrationDocumentType ||
                "",
              isIncarcerated: sectionValues.isIncarcerated || updatedFamilyMembers[memberIndex].isIncarcerated || "",
              isPendingDisposition:
                sectionValues.isPendingDisposition || updatedFamilyMembers[memberIndex].isPendingDisposition || "",
              hispanicOrigin: sectionValues.hispanicOrigin || updatedFamilyMembers[memberIndex].hispanicOrigin || "",
              race: sectionValues.race || updatedFamilyMembers[memberIndex].race || "",
              tobaccoUsage: sectionValues.tobaccoUsage || updatedFamilyMembers[memberIndex].tobaccoUsage || "",
              tobaccoUser: sectionValues.tobaccoUsage || updatedFamilyMembers[memberIndex].tobaccoUser || "",
            }

            // Update tobacco usage data for this family member if it exists
            const tobaccoDataJson = sessionStorage.getItem(`tobaccoUsageData_${memberId}`)
            if (tobaccoDataJson) {
              try {
                const tobaccoData = JSON.parse(tobaccoDataJson)
                tobaccoData.isTobaccoUser = sectionValues.tobaccoUsage
                sessionStorage.setItem(`tobaccoUsageData_${memberId}`, JSON.stringify(tobaccoData))
              } catch (e) {
                console.error(`Error updating tobacco data for family member ${memberId}:`, e)
              }
            }
          }

          setFamilyMembers(updatedFamilyMembers)
          sessionStorage.setItem("familyMembers", JSON.stringify(updatedFamilyMembers))
        }
      }

      // Exit edit mode for this section
      setEditingSections((prev) => ({
        ...prev,
        [sectionKey]: false,
      }))

      // Show success toast
      toast({
        title: "Changes saved",
        description: "Your information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your information. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Cancel editing of a section
  const handleCancelEditing = (section: string, applicant = "primary", index: number | null = null) => {
    const sectionKey = `${applicant}-${section}-${index !== null ? index : "main"}`

    // Exit edit mode without saving changes
    setEditingSections((prev) => ({
      ...prev,
      [sectionKey]: false,
    }))

    // Remove edited values for this section
    setEditedValues((prev) => {
      const newValues = { ...prev }
      delete newValues[sectionKey]
      return newValues
    })

    // Clear any validation errors
    setFieldErrors({})
  }

  // Handle adding a new income source
  const handleAddIncomeSource = () => {
    // Create a new empty income source
    const newSource: IncomeSource = {
      type: "job",
      frequency: "yearly",
      amount: 0,
    } as IncomeSource

    // Add it to the list
    if (!primaryApplicant) return

    const updatedSources = [...primaryApplicant.incomeSources, newSource]

    // Update primary applicant
    setPrimaryApplicant({
      ...primaryApplicant,
      incomeSources: updatedSources,
    })

    // Update session storage
    sessionStorage.setItem("incomeSources", JSON.stringify(updatedSources))

    // Set this new source as the one being edited inline
    setInlineEditingIncomeSource({
      index: updatedSources.length - 1,
      source: newSource,
    })

    // Make sure we're in edit mode for the income section
    setEditingSections((prev) => ({
      ...prev,
      [`primary-income-main`]: true,
    }))
  }

  // Handle editing an existing income source
  const handleEditIncomeSource = (source: IncomeSource, index: number) => {
    setInlineEditingIncomeSource({
      index,
      source: { ...source },
    })
  }

  // Add a new function for editing family member income sources around line 600:
  const handleEditFamilyMemberIncomeSource = (memberId: any, source: any, index: any) => {
    // Set up inline editing for this family member's income source
    setInlineEditingIncomeSource({
      index,
      source: { ...source },
      memberId, // Add memberId to track which family member we're editing
    })

    // Make sure we're in edit mode for this family member's income section
    setEditingSections((prev) => ({
      ...prev,
      [`${memberId.startsWith("spouse") ? "spouse" : "dependent"}-${memberId}-income-main`]: true,
    }))
  }

  // Let's add a function to save the inline edited income source:
  const handleSaveInlineIncomeSource = () => {
    if (inlineEditingIncomeSource.source === null || inlineEditingIncomeSource.index === null) return

    // Validate the income source
    const source = inlineEditingIncomeSource.source
    let isValid = true
    let errorMessage = ""

    if (source.type !== "unemployed" && !source.amount) {
      isValid = false
      errorMessage = "Please enter an amount"
    }

    if (source.type === "self-employed" && !source.jobType) {
      isValid = false
      errorMessage = "Please enter a job type"
    }

    if (source.type === "unemployment" && !source.expirationDate) {
      isValid = false
      errorMessage = "Please enter an expiration date"
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    // Check if we're editing a family member's income source
    if (inlineEditingIncomeSource.memberId) {
      // Find the family member
      const member = familyMembers.find((m) => m.id === inlineEditingIncomeSource.memberId)
      if (!member) return

      // Update the income source
      const updatedSources = [...(member.incomeSources || [])]
      updatedSources[inlineEditingIncomeSource.index] = source

      // Update the family member's income sources
      const updatedFamilyMembers = familyMembers.map((m) =>
        m.id === inlineEditingIncomeSource.memberId ? { ...m, incomeSources: updatedSources } : m,
      )

      // Update state and session storage
      setFamilyMembers(updatedFamilyMembers)
      sessionStorage.setItem("familyMembers", JSON.stringify(updatedFamilyMembers))

      // Also update the specific income sources storage if it exists
      sessionStorage.setItem(`incomeSources_${inlineEditingIncomeSource.memberId}`, JSON.stringify(updatedSources))
    } else {
      // We're editing the primary applicant's income source
      if (!primaryApplicant) return

      // Update the income source
      const updatedSources = [...primaryApplicant.incomeSources]
      updatedSources[inlineEditingIncomeSource.index] = source

      // Update primary applicant
      setPrimaryApplicant({
        ...primaryApplicant,
        incomeSources: updatedSources,
      })

      // Update session storage
      sessionStorage.setItem("incomeSources", JSON.stringify(updatedSources))
    }

    // Reset inline editing state
    setInlineEditingIncomeSource({
      index: null,
      source: null,
      memberId: null,
    })

    // Show success toast
    toast({
      title: "Income source updated",
      description: "Income information has been updated successfully.",
    })
  }

  // Let's add a function to cancel inline editing:
  const handleCancelInlineIncomeSource = () => {
    // Reset inline editing state
    setInlineEditingIncomeSource({
      index: null,
      source: null,
      memberId: null,
    })
  }

  // Handle removing an income source
  const handleRemoveIncomeSource = (index: number) => {
    if (!primaryApplicant) return

    const updatedSources = [...primaryApplicant.incomeSources]
    updatedSources.splice(index, 1)

    // Update primary applicant
    setPrimaryApplicant({
      ...primaryApplicant,
      incomeSources: updatedSources,
    })

    // Update session storage
    sessionStorage.setItem("incomeSources", JSON.stringify(updatedSources))

    // Show success toast
    toast({
      title: "Income source removed",
      description: "The income source has been removed successfully.",
    })
  }

  // Start enrollment for a specific family member
  const startFamilyMemberEnrollment = (member: FamilyMember) => {
    if (!member || !member.id) return

    // Navigate to personal information page with family member context
    router.push(
      `/enroll/family-member/personal-information?planId=${planId}&familyMemberId=${member.id}&type=${member.type}`,
    )
  }

  // Handle back button click
  const handleBack = () => {
    // Check if the user is a tobacco user to determine the previous page
    const isTobaccoUser = primaryApplicant?.tobaccoUsage === "smoker" || primaryApplicant?.tobaccoUsage === "yes"
    if (isTobaccoUser) {
      router.push(`/enroll/tobacco-usage?planId=${planId}`)
    } else {
      router.push(`/enroll/income?planId=${planId}`)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Check age restrictions before submitting
    const hasAgeRestriction = checkFamilyAgeRestrictions()

    if (!hasAgeRestriction) {
      // Navigate to agreements flow instead of directly saving
      router.push(`/enroll/agreements/renewal?planId=${planId}`)
    } else {
      setIsSubmitting(false)
    }
  }

  const handleSaveChanges = () => {
    // In a real application, this would submit the data to a backend
    toast({
      title: "Enrollment submitted",
      description: "Your enrollment has been successfully submitted.",
    })

    // For demo purposes, we'll just redirect to a success page
    // In a real app, you might want to clear the localStorage data here
    router.push("/")
  }

  const handleCloseEligibilityNotice = () => {
    setShowEligibilityNotice(false)

    // If this was triggered during form submission, check if there's a blocking restriction before continuing
    if (isSubmitting) {
      const hasBlockingRestriction = familyMembersWithAgeRestrictions.some((member) => member.age > 65)

      if (!hasBlockingRestriction) {
        handleSaveChanges()
      } else {
        setIsSubmitting(false)
        toast({
          title: "Age Restriction",
          description: "Users over 65 years old are not eligible for this marketplace plan.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (section: string, memberId?: string) => {
    switch (section) {
      case "personal":
        router.push(
          memberId ? `/enroll/family-member/personal-information?memberId=${memberId}` : "/enroll/personal-information",
        )
        break
      case "contact":
        router.push(
          memberId ? `/enroll/family-member/contact-information?memberId=${memberId}` : "/enroll/contact-information",
        )
        break
      case "address":
        router.push("/enroll/address-information")
        break
      case "ssn":
        router.push(memberId ? `/enroll/family-member/ssn-information?memberId=${memberId}` : "/enroll/ssn-information")
        break
      case "citizenship":
        router.push(
          memberId
            ? `/enroll/family-member/citizenship-information?memberId=${memberId}`
            : "/enroll/citizenship-information",
        )
        break
      case "incarceration":
        router.push(
          memberId ? `/enroll/family-member/incarceration-status?memberId=${memberId}` : "/enroll/incarceration-status",
        )
        break
      case "demographics":
        router.push(memberId ? `/enroll/family-member/demographics?memberId=${memberId}` : "/enroll/demographics")
        break
      case "tobacco":
        router.push(memberId ? `/enroll/family-member/tobacco-usage?memberId=${memberId}` : "/enroll/tobacco-usage")
        break
      case "income":
        router.push(memberId ? `/enroll/family-member/income?memberId=${memberId}` : "/enroll/income")
        break
      default:
        break
    }
  }

  const checkFamilyAgeRestrictions = useCallback((): boolean => {
    const restrictedMembers: Array<{ type: "primary" | "spouse" | "dependent"; name?: string; age: number }> = []
    let hasBlockingAgeRestriction = false

    // Check primary applicant
    if (primaryApplicant?.dateOfBirth) {
      const parsedDate = parseDateString(primaryApplicant?.dateOfBirth)
      if (parsedDate) {
        const { isUnder19, isOver65, age } = validateAgeRestrictions(parsedDate)
        if (isUnder19 || isOver65) {
          restrictedMembers.push({
            type: "primary",
            age: age || 0,
          })
          // Only over 65 is a blocking restriction
          if (isOver65) {
            hasBlockingAgeRestriction = true
          }
        }
      }
    }

    // Check family members (both existing and pending)
    const allFamilyMembers = [...familyMembers, ...Object.values(pendingFamilyMembers)]

    allFamilyMembers.forEach((member, index) => {
      const parsedDate = parseDateString(member.dateOfBirth)
      if (parsedDate) {
        const { isUnder19, isOver65, age } = validateAgeRestrictions(parsedDate)
        if (isUnder19 || isOver65) {
          restrictedMembers.push({
            type: member.type,
            name: member.type === "dependent" ? `Dependent ${index + 1}` : undefined,
            age: age || 0,
          })
          // Only over 65 is a blocking restriction
          if (isOver65) {
            hasBlockingAgeRestriction = true
          }
        }
      }
    })

    // If we have restricted members, show the notice
    if (restrictedMembers.length > 0) {
      setFamilyMembersWithAgeRestrictions(restrictedMembers)

      // Determine the type of notice to show
      const hasMedicare = restrictedMembers.some((m) => (m.age || 0) > 65)
      const hasMedicaid = restrictedMembers.some((m) => (m.age || 0) < 19)

      if (restrictedMembers.length === 1 && restrictedMembers[0].type === "primary") {
        // Primary applicant only
        setEligibilityType(hasMedicare ? "medicare" : "medicaid")
      } else {
        // Mixed family members
        setEligibilityType(hasMedicare ? "medicare" : "medicaid")
      }

      setShowEligibilityNotice(true)
      return hasBlockingAgeRestriction
    }

    return false
  }, [primaryApplicant?.dateOfBirth, familyMembers, pendingFamilyMembers])

  // Check if all family members are enrolled
  const areAllFamilyMembersEnrolled = () => {
    // If there are no family members, return true
    if (familyMembers.length === 0) return true

    // Check if all family members that need to be enrolled are enrolled
    return familyMembers.every(
      (member) =>
        // Skip dependents not included in coverage
        (!member.includedInCoverage && member.type === "dependent") ||
        // Check if enrolled
        enrolledFamilyMembers[member.id],
    )
  }

  const handleContinue = () => {
    if (areAllFamilyMembersEnrolled()) {
      // All family members are enrolled, proceed to payment
      router.push(`/enroll/payment?planId=${planId}`)
    } else {
      toast({
        title: "Incomplete Enrollment",
        description: "Please complete enrollment for all family members before proceeding to payment.",
        variant: "destructive",
      })
    }
  }

  // Calculate total annual income
  const totalAnnualIncome =
    primaryApplicant?.incomeSources.reduce((sum, source) => {
      let annualAmount = source.amount

      if (source.frequency === "monthly") {
        annualAmount *= 12
      } else if (source.frequency === "biweekly") {
        annualAmount *= 26
      } else if (source.frequency === "weekly") {
        annualAmount *= 52
      }

      return sum + annualAmount
    }, 0) || 0

  // Format currency for display
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

  // Add a new function for adding family member income sources
  const handleAddFamilyMemberIncomeSource = (memberId: string) => {
    // Find the family member
    const member = familyMembers.find((m) => m.id === memberId)
    if (!member) return

    // Create a new empty income source
    const newSource: IncomeSource = {
      type: "job",
      frequency: "monthly",
      amount: 0,
    } as IncomeSource

    // Add it to the list
    const updatedSources = [...member.incomeSources, newSource]

    // Update the family member's income sources
    const updatedFamilyMembers = familyMembers.map((m) =>
      m.id === memberId ? { ...m, incomeSources: updatedSources } : m,
    )

    // Update state and session storage
    setFamilyMembers(updatedFamilyMembers)
    sessionStorage.setItem("familyMembers", JSON.stringify(updatedFamilyMembers))

    // Also update the specific income sources storage if it exists
    sessionStorage.setItem(`incomeSources_${memberId}`, JSON.stringify(updatedSources))

    // Show success toast
    toast({
      title: "Income source added",
      description: "New income source has been added successfully.",
    })
  }

  // Helper function to format tobacco usage display
  const formatTobaccoUsage = (usage: any) => {
    if (usage === "yes" || usage === "smoker" || usage === true) {
      return "Yes"
    } else if (usage === "no" || usage === "non-smoker" || usage === false) {
      return "No"
    } else {
      return "—"
    }
  }

  // Helper function to format tobacco last used date
  const formatTobaccoLastUsed = (date: any) => {
    if (!date) return "—"
    try {
      return new Date(date).toLocaleDateString()
    } catch (e) {
      return date
    }
  }

  // Early return for loading state
  if (loading || !primaryApplicant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const householdSize = familyMembers.length + 1

  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="review" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton
                  title="Review Your Application"
                  explanation="Review all your information before finalizing your insurance application."
                  tips={[
                    "Make sure all information is accurate",
                    "Check your family members' information",
                    "Verify your income details",
                    "Confirm your selected insurance plan",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Review Your Application</h1>
                <p className="text-gray-500">Please review your information before continuing</p>
              </div>
            </div>

            {/* Plan Information */}
            {plan && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Selected Plan</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                    onClick={() => router.push(`/plan-details/${planId}`)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Change Plan
                  </Button>
                </div>

                <div className="bg-white rounded-lg border border-purple-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="md:w-1/4">
                        <div className="h-14 w-full max-w-[120px] bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
                          <span className="font-bold text-purple-800">{plan.carrier}</span>
                        </div>
                      </div>
                      <div className="md:w-1/2">
                        <h3 className="font-medium text-purple-800 text-lg">{plan.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              plan.tier === "Gold"
                                ? "bg-yellow-100 text-yellow-800"
                                : plan.tier === "Silver"
                                  ? "bg-gray-200 text-gray-800"
                                  : plan.tier === "Bronze"
                                    ? "bg-amber-100 text-amber-800"
                                    : plan.tier === "Platinum"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {plan.tier}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">{plan.planType}</span>
                        </div>
                      </div>
                      <div className="md:w-1/4 text-right">
                        <div className="text-2xl font-bold text-purple-700">
                          ${plan.premium}
                          <span className="text-sm font-normal text-gray-500">/mo</span>
                        </div>
                        <p className="text-xs text-gray-500">After subsidy</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Deductible</p>
                        <p className="font-medium text-gray-800">${plan.deductible}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Out-of-Pocket Max</p>
                        <p className="font-medium text-gray-800">${plan.maxOOP}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Coverage Level</p>
                        <p className="font-medium text-gray-800">{plan.coverageLevel || "Standard"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Household Information */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Household Information</h2>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Household Size</p>
                        <p className="text-xl font-semibold text-gray-800">{householdSize}</p>
                      </div>
                      <button
                        onClick={() => router.push("/household")}
                        className="text-purple-600 hover:text-purple-700"
                        aria-label="Edit household size"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Annual Income</p>
                        <p className="text-xl font-semibold text-gray-800">{formatCurrency(totalAnnualIncome)}</p>
                      </div>
                      <button
                        onClick={() => handleEditSection("income")}
                        className="text-purple-600 hover:text-purple-700"
                        aria-label="Edit income"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-xl font-semibold text-gray-800">{primaryApplicant.zipCode}</p>
                      </div>
                      <button
                        onClick={() => handleEditSection("address")}
                        className="text-purple-600 hover:text-purple-700"
                        aria-label="Edit location"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicants Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Applicants</h2>

              {/* Primary Applicant */}
              <AccordionSection
                title={`${primaryApplicant.firstName} ${primaryApplicant.lastName} (Primary Applicant)`}
                icon={<User className="h-4 w-4 text-purple-600" />}
                className="border-purple-200"
                isEnrolled={true} // Primary applicant is always enrolled
              >
                <div className="space-y-4">
                  {/* Personal Information */}
                  <EditableSection
                    title="Personal Information"
                    icon={<User className="h-4 w-4 text-purple-600" />}
                    onEdit={() => handleEditSection("personal")}
                    isEditing={editingSections[`primary-personal-main`] || false}
                    onSave={() => handleSaveSection("personal")}
                    onCancel={() => handleCancelEditing("personal")}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <EditableField
                        label="First Name"
                        value={
                          editingSections[`primary-personal-main`]
                            ? editedValues[`primary-personal-main`]?.firstName || ""
                            : primaryApplicant.firstName
                        }
                        isEditing={editingSections[`primary-personal-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-personal-main`]: {
                              ...prev[`primary-personal-main`],
                              firstName: value,
                            },
                          }))
                        }
                        question="What is your first name?"
                        error={fieldErrors["firstName"]}
                      />
                      <EditableField
                        label="Last Name"
                        value={
                          editingSections[`primary-personal-main`]
                            ? editedValues[`primary-personal-main`]?.lastName || ""
                            : primaryApplicant.lastName
                        }
                        isEditing={editingSections[`primary-personal-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-personal-main`]: {
                              ...prev[`primary-personal-main`],
                              lastName: value,
                            },
                          }))
                        }
                        question="What is your last name?"
                        error={fieldErrors["lastName"]}
                      />
                      <EditableField
                        label="Date of Birth"
                        value={
                          editingSections[`primary-personal-main`]
                            ? editedValues[`primary-personal-main`]?.dateOfBirth || ""
                            : primaryApplicant.dateOfBirth
                        }
                        isEditing={editingSections[`primary-personal-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-personal-main`]: {
                              ...prev[`primary-personal-main`],
                              dateOfBirth: value,
                            },
                          }))
                        }
                        type="text"
                        question="What is your date of birth? (MM/DD/YYYY)"
                        error={fieldErrors["dateOfBirth"]}
                      />
                      <EditableField
                        label="Gender"
                        value={
                          editingSections[`primary-personal-main`]
                            ? editedValues[`primary-personal-main`]?.gender || ""
                            : primaryApplicant.gender === "male"
                              ? "Male"
                              : "Female"
                        }
                        isEditing={editingSections[`primary-personal-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-personal-main`]: {
                              ...prev[`primary-personal-main`],
                              gender: value,
                            },
                          }))
                        }
                        type="select"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                        ]}
                        question="What is your gender?"
                        error={fieldErrors["gender"]}
                      />
                    </div>
                  </EditableSection>

                  {/* Contact Information */}
                  <EditableSection
                    title="Contact Information"
                    icon={<Mail className="h-4 w-4 text-purple-600" />}
                    onEdit={() => handleEditSection("contact")}
                    isEditing={editingSections[`primary-contact-main`] || false}
                    onSave={() => handleSaveSection("contact")}
                    onCancel={() => handleCancelEditing("contact")}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <EditableField
                        label="Email Address"
                        value={
                          editingSections[`primary-contact-main`]
                            ? editedValues[`primary-contact-main`]?.email || ""
                            : primaryApplicant.email
                        }
                        isEditing={editingSections[`primary-contact-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-contact-main`]: {
                              ...prev[`primary-contact-main`],
                              email: value,
                            },
                          }))
                        }
                        question="What is your email address?"
                        error={fieldErrors["email"]}
                      />
                      <EditableField
                        label="Phone Number"
                        value={
                          editingSections[`primary-contact-main`]
                            ? editedValues[`primary-contact-main`]?.phoneNumber || ""
                            : primaryApplicant.phoneNumber
                        }
                        isEditing={editingSections[`primary-contact-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-contact-main`]: {
                              ...prev[`primary-contact-main`],
                              phoneNumber: value,
                            },
                          }))
                        }
                        question="What is your phone number?"
                        error={fieldErrors["phoneNumber"]}
                      />
                    </div>
                  </EditableSection>

                  {/* Address Information */}
                  <EditableSection
                    title="Address Information"
                    icon={<Home className="h-4 w-4 text-purple-600" />}
                    onEdit={() => handleEditSection("address")}
                    isEditing={editingSections[`primary-address-main`] || false}
                    onSave={() => handleSaveSection("address")}
                    onCancel={() => handleCancelEditing("address")}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <EditableField
                        label="Street Address"
                        value={
                          editingSections[`primary-address-main`]
                            ? editedValues[`primary-address-main`]?.address || ""
                            : primaryApplicant.address
                        }
                        isEditing={editingSections[`primary-address-main`] || false}
                        onChange={(value) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [`primary-address-main`]: {
                              ...prev[`primary-address-main`],
                              address: value,
                            },
                          }))
                        }
                        question="What is your street address?"
                        error={fieldErrors["address"]}
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <EditableField
                          label="City"
                          value={
                            editingSections[`primary-address-main`]
                              ? editedValues[`primary-address-main`]?.city || ""
                              : primaryApplicant.city
                          }
                          isEditing={editingSections[`primary-address-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-address-main`]: {
                                ...prev[`primary-address-main`],
                                city: value,
                              },
                            }))
                          }
                          question="What is your city?"
                          error={fieldErrors["city"]}
                        />
                        <EditableField
                          label="State"
                          value={
                            editingSections[`primary-address-main`]
                              ? editedValues[`primary-address-main`]?.state || ""
                              : primaryApplicant.state
                          }
                          isEditing={editingSections[`primary-address-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-address-main`]: {
                                ...prev[`primary-address-main`],
                                state: value,
                              },
                            }))
                          }
                          question="What is your state?"
                          error={fieldErrors["state"]}
                        />
                        <EditableField
                          label="ZIP Code"
                          value={
                            editingSections[`primary-address-main`]
                              ? editedValues[`primary-address-main`]?.zipCode || ""
                              : primaryApplicant.zipCode
                          }
                          isEditing={editingSections[`primary-address-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-address-main`]: {
                                ...prev[`primary-address-main`],
                                zipCode: value,
                              },
                            }))
                          }
                          question="What is your zip code?"
                          error={fieldErrors["zipCode"]}
                        />
                      </div>
                    </div>
                  </EditableSection>

                  {/* Consolidated Identity Information */}
                  <EditableSection
                    title="Identity & Legal Information"
                    icon={<Shield className="h-4 w-4 text-purple-600" />}
                    onEdit={() => handleEditSection("identity")}
                    isEditing={editingSections[`primary-identity-main`] || false}
                    onSave={() => handleSaveSection("identity")}
                    onCancel={() => handleCancelEditing("identity")}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Social Security Number" value="•••-••-••••" />
                        <EditableField
                          label="U.S. Citizen"
                          value={
                            editingSections[`primary-identity-main`]
                              ? editedValues[`primary-identity-main`]?.isUSCitizen || ""
                              : primaryApplicant.isUSCitizen === "yes"
                                ? "Yes"
                                : "No"
                          }
                          isEditing={editingSections[`primary-identity-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                isUSCitizen: value,
                              },
                            }))
                          }
                          onChangeImmediate={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                isUSCitizen: value,
                              },
                            }))
                          }
                          type="select"
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ]}
                        />

                        {/* Immigration Document - Only show if not a US citizen */}
                        {(editingSections[`primary-identity-main`]
                          ? editedValues[`primary-identity-main`]?.isUSCitizen === "no"
                          : primaryApplicant.isUSCitizen === "no") && (
                          <EditableField
                            label="Immigration Document"
                            value={
                              editingSections[`primary-identity-main`]
                                ? editedValues[`primary-identity-main`]?.immigrationDocumentType || ""
                                : primaryApplicant.immigrationDocumentType || "—"
                            }
                            isEditing={editingSections[`primary-identity-main`] || false}
                            onChange={(value) =>
                              setEditedValues((prev) => ({
                                ...prev,
                                [`primary-identity-main`]: {
                                  ...prev[`primary-identity-main`],
                                  immigrationDocumentType: value,
                                },
                              }))
                            }
                            type="select"
                            options={[
                              { value: "permanent-resident-card", label: "Permanent Resident Card" },
                              { value: "employment-authorization", label: "Employment Authorization" },
                              { value: "visa", label: "Visa" },
                              { value: "other", label: "Other" },
                            ]}
                            placeholder="Select document type"
                            required={primaryApplicant.isUSCitizen === "no"}
                          />
                        )}

                        <EditableField
                          label="Currently Incarcerated"
                          value={
                            editingSections[`primary-identity-main`]
                              ? editedValues[`primary-identity-main`]?.isIncarcerated || ""
                              : primaryApplicant.isIncarcerated === "yes"
                                ? "Yes"
                                : "No"
                          }
                          isEditing={editingSections[`primary-identity-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                isIncarcerated: value,
                              },
                            }))
                          }
                          onChangeImmediate={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                isIncarcerated: value,
                              },
                            }))
                          }
                          type="select"
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ]}
                        />

                        {/* Pending Disposition - Only show if incarcerated */}
                        {(editingSections[`primary-identity-main`]
                          ? editedValues[`primary-identity-main`]?.isIncarcerated === "yes"
                          : primaryApplicant.isIncarcerated === "yes") && (
                          <EditableField
                            label="Pending Disposition of Charges"
                            value={
                              editingSections[`primary-identity-main`]
                                ? editedValues[`primary-identity-main`]?.isPendingDisposition || ""
                                : primaryApplicant.isPendingDisposition === "yes"
                                  ? "Yes"
                                  : "No"
                            }
                            isEditing={editingSections[`primary-identity-main`] || false}
                            onChange={(value) =>
                              setEditedValues((prev) => ({
                                ...prev,
                                [`primary-identity-main`]: {
                                  ...prev[`primary-identity-main`],
                                  isPendingDisposition: value,
                                },
                              }))
                            }
                            type="select"
                            options={[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ]}
                            required={primaryApplicant.isIncarcerated === "yes"}
                          />
                        )}

                        <EditableField
                          label="Hispanic, Latino, or Spanish Origin"
                          value={
                            editingSections[`primary-identity-main`]
                              ? editedValues[`primary-identity-main`]?.hispanicOrigin || ""
                              : primaryApplicant.hispanicOrigin === "yes"
                                ? "Yes"
                                : primaryApplicant.hispanicOrigin === "no"
                                  ? "No"
                                  : primaryApplicant.hispanicOrigin === "decline"
                                    ? "Declined to answer"
                                    : "—"
                          }
                          isEditing={editingSections[`primary-identity-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                hispanicOrigin: value,
                              },
                            }))
                          }
                          type="select"
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                            { value: "decline", label: "Declined to answer" },
                          ]}
                        />

                        <EditableField
                          label="Race/Ethnicity"
                          value={
                            editingSections[`primary-identity-main`]
                              ? editedValues[`primary-identity-main`]?.race || ""
                              : primaryApplicant.race === "american-indian"
                                ? "American Indian/Alaskan Native"
                                : primaryApplicant.race === "asian-indian"
                                  ? "Asian Indian"
                                  : primaryApplicant.race === "black"
                                    ? "Black or African American"
                                    : primaryApplicant.race === "chinese"
                                      ? "Chinese"
                                      : primaryApplicant.race === "filipino"
                                        ? "Filipino"
                                        : primaryApplicant.race === "guamanian"
                                          ? "Guamanian or Chamorro"
                                          : primaryApplicant.race === "japanese"
                                            ? "Japanese"
                                            : primaryApplicant.race === "korean"
                                              ? "Korean"
                                              : primaryApplicant.race === "native-hawaiian"
                                                ? "Native Hawaiian"
                                                : primaryApplicant.race === "samoan"
                                                  ? "Samoan"
                                                  : primaryApplicant.race === "vietnamese"
                                                    ? "Vietnamese"
                                                    : primaryApplicant.race === "white"
                                                      ? "White"
                                                      : primaryApplicant.race === "asian-other"
                                                        ? "Asian Race not listed above"
                                                        : primaryApplicant.race === "pacific-islander-other"
                                                          ? "Pacific Islander Race not listed above"
                                                          : primaryApplicant.race === "other"
                                                            ? "Race not listed above"
                                                            : primaryApplicant.race === "decline"
                                                              ? "Declined to answer"
                                                              : "—"
                          }
                          isEditing={editingSections[`primary-identity-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                race: value,
                              },
                            }))
                          }
                          type="select"
                          options={[
                            { value: "decline", label: "Decline to answer" },
                            { value: "american-indian", label: "American Indian/Alaskan Native" },
                            { value: "asian-indian", label: "Asian Indian" },
                            { value: "black", label: "Black or African American" },
                            { value: "chinese", label: "Chinese" },
                            { value: "filipino", label: "Filipino" },
                            { value: "guamanian", label: "Guamanian or Chamorro" },
                            { value: "japanese", label: "Japanese" },
                            { value: "korean", label: "Korean" },
                            { value: "native-hawaiian", label: "Native Hawaiian" },
                            { value: "samoan", label: "Samoan" },
                            { value: "vietnamese", label: "Vietnamese" },
                            { value: "white", label: "White" },
                            { value: "asian-other", label: "Asian Race not listed above" },
                            { value: "pacific-islander-other", label: "Pacific Islander Race not listed above" },
                            { value: "other", label: "Race not listed above" },
                            { value: "decline", label: "Declined to answer" },
                          ]}
                        />
                        
                        {/* Tobacco Usage Field */}
                        <EditableField
                          label="Tobacco User"
                          value={
                            editingSections[`primary-identity-main`]
                              ? editedValues[`primary-identity-main`]?.tobaccoUsage || ""
                              : formatTobaccoUsage(primaryApplicant.tobaccoUsage)
                          }
                          isEditing={editingSections[`primary-identity-main`] || false}
                          onChange={(value) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [`primary-identity-main`]: {
                                ...prev[`primary-identity-main`],
                                tobaccoUsage: value,
                              },
                            }))
                          }
                          type="select"
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ]}
                        />
                        
                        {/* Last Tobacco Usage Date - Only show if user is a tobacco user */}
                        {(primaryApplicant.tobaccoUsage === "yes" || 
                           primaryApplicant.tobaccoUsage === "smoker" || 
                           primaryApplicant.tobaccoUser === "yes" || 
                           primaryApplicant.tobaccoUser === true) && 
                           primaryApplicant.tobaccoLastUsed && (
                          <Field
                            label="Last Tobacco Use"
                            value={formatTobaccoLastUsed(primaryApplicant.tobaccoLastUsed)}
                          />
                        )}
                      </div>

                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">
                            This information is protected and only used for verification purposes. It is not shared with
                            insurance providers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </EditableSection>

                  {/* Income Information */}
                  <EditableSection
                    title="Income Information"
                    icon={<DollarSign className="h-4 w-4 text-purple-600" />}
                    onEdit={() => handleEditSection("income")}
                    isEditing={editingSections[`primary-income-main`] || false}
                    onSave={() => handleSaveSection("income")}
                    onCancel={() => handleCancelEditing("income")}
                  >
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-purple-800">Total Annual Income</h4>
                            <p className="text-xs text-purple-600 mt-1">Based on all income sources</p>
                          </div>
                          <div className="text-xl font-bold text-purple-700">{formatCurrency(totalAnnualIncome)}</div>
                        </div>
                      </div>

                      {primaryApplicant.incomeSources.length > 0 ? (
                        <div className="space-y-3">
                          {primaryApplicant.incomeSources.map((source, index) => (
                            <div key={index} className="bg-gray-100 p-3 rounded-lg">
                              {inlineEditingIncomeSource.index === index ? (
                                // Inline editing form
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`source-type-${index}`}>Source Type</Label>
                                      <Select
                                        value={inlineEditingIncomeSource.source?.type || source.type}
                                        onValueChange={(value) => {
                                          setInlineEditingIncomeSource((prev) => {
                                            // If changing to unemployed, set amount to 0
                                            if (value === "unemployed") {
                                              return {
                                                ...prev,
                                                source: {
                                                  ...prev.source!,
                                                  type: value as IncomeSourceType,
                                                  amount: 0,
                                                  frequency: "yearly",
                                                },
                                              }
                                            }
                                            return {
                                              ...prev,
                                              source: {
                                                ...prev.source!,
                                                type: value as IncomeSourceType,
                                              },
                                            }
                                          })
                                        }}
                                      >
                                        <SelectTrigger id={`source-type-${index}`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {incomeSourceTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                              {type.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {inlineEditingIncomeSource.source?.type !== "unemployed" && (
                                      <div>
                                        <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                                        <Select
                                          value={inlineEditingIncomeSource.source?.frequency || source.frequency}
                                          onValueChange={(value) => {
                                            setInlineEditingIncomeSource((prev) => ({
                                              ...prev,
                                              source: {
                                                ...prev.source!,
                                                frequency: value as FrequencyType,
                                              },
                                            }))
                                          }}
                                        >
                                          <SelectTrigger id={`frequency-${index}`}>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {frequencyOptions.map((option) => (
                                              <SelectItem key={option.id} value={option.id}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>

                                  {inlineEditingIncomeSource.source?.type !== "unemployed" && (
                                    <div>
                                      <Label htmlFor={`amount-${index}`}>Amount</Label>
                                      <div className="relative">
                                        <Input
                                          id={`amount-${index}`}
                                          type="text"
                                          value={inlineEditingIncomeSource.source?.amount?.toString() || ""}
                                          onChange={(e) => {
                                            const formattedValue = formatCurrencyInput(e.target.value)
                                            setInlineEditingIncomeSource((prev) => ({
                                              ...prev,
                                              source: {
                                                ...prev.source!,
                                                amount: Number(formattedValue) || 0,
                                              },
                                            }))
                                          }}
                                          placeholder="0.00"
                                          className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <DollarSign className="h-4 w-4 text-gray-400" />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Job-specific fields */}
                                  {inlineEditingIncomeSource.source?.type === "job" ||
                                  inlineEditingIncomeSource.source?.type === "part-time" ? (
                                    <div className="space-y-3">
                                      <h4 className="font-medium text-gray-700">Employer Information</h4>
                                      <div>
                                        <Label htmlFor={`employer-name-${index}`}>Employer Name</Label>
                                        <div className="relative">
                                          <Input
                                            id={`employer-name-${index}`}
                                            value={inlineEditingIncomeSource.source?.employerName || ""}
                                            onChange={(e) => {
                                              setInlineEditingIncomeSource((prev) => ({
                                                ...prev,
                                                source: {
                                                  ...prev.source!,
                                                  employerName: e.target.value,
                                                },
                                              }))
                                            }}
                                            placeholder="Search or enter employer name"
                                            className="pl-10"
                                          />
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building className="h-4 w-4 text-gray-400" />
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label htmlFor={`employer-phone-${index}`}>Employer Phone</Label>
                                        <div className="relative">
                                          <Input
                                            id={`employer-phone-${index}`}
                                            type="text"
                                            value={inlineEditingIncomeSource.source?.employerPhone || ""}
                                            onChange={(e) => {
                                              // Format phone number as (XXX) XXX-XXXX
                                              const value = e.target.value.replace(/[^\d]/g, "")
                                              let formattedPhone = value
                                              if (value.length <= 3) {
                                                formattedPhone = value
                                              } else if (value.length <= 6) {
                                                formattedPhone = `(${value.slice(0, 3)}) ${value.slice(3)}`
                                              } else {
                                                formattedPhone = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
                                              }

                                              setInlineEditingIncomeSource((prev) => ({
                                                ...prev,
                                                source: {
                                                  ...prev.source!,
                                                  employerPhone: formattedPhone,
                                                },
                                              }))
                                            }}
                                            placeholder="(555) 555-5555"
                                            className="pl-10"
                                          />
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}

                                  {/* Self-employed specific fields */}
                                  {inlineEditingIncomeSource.source?.type === "self-employed" && (
                                    <div>
                                      <Label htmlFor={`job-type-${index}`}>Type of Job</Label>
                                      <Input
                                        id={`job-type-${index}`}
                                        value={inlineEditingIncomeSource.source?.jobType || ""}
                                        onChange={(e) => {
                                          setInlineEditingIncomeSource((prev) => ({
                                            ...prev,
                                            source: {
                                              ...prev.source!,
                                              jobType: e.target.value,
                                            },
                                          }))
                                        }}
                                        placeholder="E.g., Consultant, Freelancer, Business Owner"
                                      />
                                    </div>
                                  )}

                                  {/* Unemployment specific fields */}
                                  {inlineEditingIncomeSource.source?.type === "unemployment" && (
                                    <div>
                                      <Label htmlFor={`expiration-date-${index}`}>Benefit Expiration Date</Label>
                                      <Input
                                        id={`expiration-date-${index}`}
                                        type="date"
                                        value={inlineEditingIncomeSource.source?.expirationDate || ""}
                                        onChange={(e) => {
                                          setInlineEditingIncomeSource((prev) => ({
                                            ...prev,
                                            source: {
                                              ...prev.source!,
                                              expirationDate: e.target.value,
                                            },
                                          }))
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Other income specific fields */}
                                  {inlineEditingIncomeSource.source?.type === "other" && (
                                    <div>
                                      <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
                                      <Input
                                        id={`description-${index}`}
                                        value={inlineEditingIncomeSource.source?.description || ""}
                                        onChange={(e) => {
                                          setInlineEditingIncomeSource((prev) => ({
                                            ...prev,
                                            source: {
                                              ...prev.source!,
                                              description: e.target.value,
                                            },
                                          }))
                                        }}
                                        placeholder="Describe this income source"
                                      />
                                    </div>
                                  )}

                                  <div className="flex justify-end gap-2 mt-3">
                                    <Button size="sm" variant="outline" onClick={handleCancelInlineIncomeSource}>
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-purple-600 hover:bg-purple-700 text-white"
                                      onClick={handleSaveInlineIncomeSource}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                // Normal display
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {source.type === "job"
                                        ? "Full-time Job"
                                        : source.type === "self-employed"
                                          ? "Self-employed"
                                          : source.type === "unemployment"
                                            ? "Unemployment"
                                            : source.type === "unemployed"
                                              ? "Unemployed"
                                              : "Other Income"}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">{source.frequency}</p>
                                    {source.employerName && (
                                      <p className="text-xs text-gray-500">Employer: {source.employerName}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium text-purple-700">{formatCurrency(source.amount)}</div>
                                    {editingSections[`primary-income-main`] && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleEditIncomeSource(source, index)}
                                          className="text-gray-500 hover:text-purple-600"
                                          aria-label="Edit income source"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleRemoveIncomeSource(index)}
                                          className="text-gray-500 hover:text-red-600"
                                          aria-label="Remove income source"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                          No income sources added
                          {editingSections[`primary-income-main`] && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                onClick={handleAddIncomeSource}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Income Source
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {primaryApplicant.incomeSources.length > 0 && editingSections[`primary-income-main`] && (
                        <div className="flex justify-center mt-4">
                          <Button
                            size="sm"
                            onClick={handleAddIncomeSource}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Income Source
                          </Button>
                        </div>
                      )}
                    </div>
                  </EditableSection>

                  {/* Tobacco Usage Information - Only show if user is a tobacco user */}
                  {(primaryApplicant.tobaccoUsage === "smoker" || primaryApplicant.tobaccoUsage === "yes") && (
                    <EditableSection
                      title="Tobacco Usage Information"
                      icon={<AlertCircle className="h-4 w-4 text-purple-600" />}
                      onEdit={() => handleEditSection("tobacco")}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Tobacco User" value="Yes" />
                          {primaryApplicant.tobaccoLastUsed && (
                            <Field
                              label="Last Used Tobacco"
                              value={new Date(primaryApplicant.tobaccoLastUsed).toLocaleDateString()}
                            />
                          )}
                        </div>

                        <div className="bg-amber-50 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700">
                              Tobacco use may affect your insurance premiums. Many insurance plans offer tobacco
                              cessation programs to help you quit.
                            </p>
                          </div>
                        </div>
                      </div>
                    </EditableSection>
                  </div>
                </AccordionSection>

              {/* Family Members */}
              {familyMembers.length > 0 && (
                <>
                  {/* Spouse Information */}
                  {familyMembers
                    .filter((member) => member.type === "spouse")
                    .map((spouse, index) => (
                      <AccordionSection
                        key={spouse.id}
                        title={`${spouse.firstName || "Spouse"} ${spouse.lastName || ""} (Spouse)`}
                        icon={<Users className="h-4 w-4 text-purple-600" />}
                        className="border-purple-200"
                        isEnrolled={enrolledFamilyMembers[spouse.id]}
                        onContinue={
                          !enrolledFamilyMembers[spouse.id] ? () => startFamilyMemberEnrollment(spouse) : undefined
                        }
                        continueText="Begin Enrollment"
                      >
                        <div className="space-y-4">
                          <EditableSection
                            title="Personal Information"
                            icon={<User className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("personal", `spouse-${spouse.id}`)}
                            isEditing={editingSections[`spouse-${spouse.id}-personal-main`] || false}
                            onSave={() => handleSaveSection("personal", `spouse-${spouse.id}`)}
                            onCancel={() => handleCancelEditing("personal", `spouse-${spouse.id}`)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <EditableField
                                label="Date of Birth"
                                value={
                                  editingSections[`spouse-${spouse.id}-personal-main`]
                                    ? editedValues[`spouse-${spouse.id}-personal-main`]?.dateOfBirth ||
                                      spouse.dateOfBirth ||
                                      ""
                                    : spouse.dateOfBirth || "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-personal-main`]: {
                                      ...prev[`spouse-${spouse.id}-personal-main`],
                                      dateOfBirth: value,
                                    },
                                  }))
                                }
                                question="What is your spouse's date of birth? (MM/DD/YYYY)"
                              />
                              <EditableField
                                label="Gender"
                                value={
                                  editingSections[`spouse-${spouse.id}-personal-main`]
                                    ? editedValues[`spouse-${spouse.id}-personal-main`]?.gender || ""
                                    : spouse.gender
                                      ? spouse.gender === "male"
                                        ? "Male"
                                        : "Female"
                                      : "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-personal-main`]: {
                                      ...prev[`spouse-${spouse.id}-personal-main`],
                                      gender: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "male", label: "Male" },
                                  { value: "female", label: "Female" },
                                ]}
                                question="What is your spouse's gender?"
                              />
                              <EditableField
                                label="Tobacco Use"
                                value={
                                  editingSections[`spouse-${spouse.id}-personal-main`]
                                    ? editedValues[`spouse-${spouse.id}-personal-main`]?.tobaccoUsage || ""
                                    : spouse.tobaccoUsage
                                      ? spouse.tobaccoUsage === "smoker"
                                        ? "Smoker"
                                        : "Non-smoker"
                                      : "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-personal-main`]: {
                                      ...prev[`spouse-${spouse.id}-personal-main`],
                                      tobaccoUsage: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "smoker", label: "Smoker" },
                                  { value: "non-smoker", label: "Non-smoker" },
                                ]}
                                question="Has your spouse used tobacco products in the last 6 months?"
                              />
                              <EditableField
                                label="Included in Coverage"
                                value={
                                  editingSections[`spouse-${spouse.id}-personal-main`]
                                    ? editedValues[`spouse-${spouse.id}-personal-main`]?.includedInCoverage || ""
                                    : spouse.includedInCoverage
                                      ? "Yes"
                                      : "No"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-personal-main`]: {
                                      ...prev[`spouse-${spouse.id}-personal-main`],
                                      includedInCoverage: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "true", label: "Yes" },
                                  { value: "false", label: "No" },
                                ]}
                                question="Should your spouse be included in coverage?"
                              />
                            </div>
                          </EditableSection>

                          {/* Contact Information - Always show, blank if not provided */}
                          <EditableSection
                            title="Contact Information"
                            icon={<Mail className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("contact", `spouse-${spouse.id}`)}
                            isEditing={editingSections[`spouse-${spouse.id}-contact-main`] || false}
                            onSave={() => handleSaveSection("contact", `spouse-${spouse.id}`)}
                            onCancel={() => handleCancelEditing("contact", `spouse-${spouse.id}`)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Email Address" value={spouse.email || "—"} />
                              <Field label="Phone Number" value={spouse.phoneNumber || "—"} />
                            </div>
                            {!spouse.includedInCoverage && !spouse.email && !spouse.phoneNumber && (
                              <div className="text-sm text-gray-500 italic mt-2">Contact information not provided</div>
                            )}
                          </EditableSection>

                          {/* Identity Information - Always show, blank if not provided */}
                          <EditableSection
                            title="Identity & Legal Information"
                            icon={<Shield className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("identity", `spouse-${spouse.id}`)}
                            isEditing={editingSections[`spouse-${spouse.id}-identity-main`] || false}
                            onSave={() => handleSaveSection("identity", `spouse-${spouse.id}`)}
                            onCancel={() => handleCancelEditing("identity", `spouse-${spouse.id}`)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Social Security Number" value={spouse.ssn ? "•••-••-••••" : "—"} />
                              <EditableField
                                label="U.S. Citizen"
                                value={
                                  editingSections[`spouse-${spouse.id}-identity-main`]
                                    ? editedValues[`spouse-${spouse.id}-identity-main`]?.isUSCitizen || ""
                                    : spouse.isUSCitizen === "yes"
                                      ? "Yes"
                                      : spouse.isUSCitizen === "no"
                                        ? "No"
                                        : "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-identity-main`]: {
                                      ...prev[`spouse-${spouse.id}-identity-main`],
                                      isUSCitizen: value,
                                    },
                                  }))
                                }
                                onChangeImmediate={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-identity-main`]: {
                                      ...prev[`spouse-${spouse.id}-identity-main`],
                                      isUSCitizen: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                ]}
                                question="Is your spouse a U.S. citizen?"
                              />

                              {/* Immigration Document - Only show if not a US citizen */}
                              {(editingSections[`spouse-${spouse.id}-identity-main`]
                                ? editedValues[`spouse-${spouse.id}-identity-main`]?.isUSCitizen === "no"
                                : spouse.isUSCitizen === "no") && (
                                <EditableField
                                  label="Immigration Document"
                                  value={
                                    editingSections[`spouse-${spouse.id}-identity-main`]
                                      ? editedValues[`spouse-${spouse.id}-identity-main`]?.immigrationDocumentType || ""
                                      : spouse.immigrationDocumentType || "—"
                                  }
                                  isEditing={
                                    editingSections[`spouse-${spouse.id}-identity-main`] || false
                                  }
                                  onChange={(value) =>
                                    setEditedValues((prev) => ({
                                      ...prev,
                                      [`spouse-${spouse.id}-identity-main`]: {
                                        ...prev[`spouse-${spouse.id}-identity-main`],
                                        immigrationDocumentType: value,
                                      },
                                    }))
                                  }
                                  type="select"
                                  options={[
                                    { value: "permanent-resident-card", label: "Permanent Resident Card" },
                                    { value: "employment-authorization", label: "Employment Authorization" },
                                    { value: "visa", label: "Visa" },
                                    { value: "other", label: "Other" },
                                  ]}
                                  placeholder="Select document type"
                                  required={spouse.isUSCitizen === "no"}
                                />
                              )}

                              <EditableField
                                label="Currently Incarcerated"
                                value={
                                  editingSections[`spouse-${spouse.id}-identity-main`]
                                    ? editedValues[`spouse-${spouse.id}-identity-main`]?.isIncarcerated || ""
                                    : spouse.isIncarcerated === "yes"
                                      ? "Yes"
                                      : spouse.isIncarcerated === "no"
                                        ? "No"
                                        : "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-identity-main`]: {
                                      ...prev[`spouse-${spouse.id}-identity-main`],
                                      isIncarcerated: value,
                                    },
                                  }))
                                }
                                onChangeImmediate={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-identity-main`]: {
                                      ...prev[`spouse-${spouse.id}-identity-main`],
                                      isIncarcerated: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                ]}
                                question="Is your spouse currently incarcerated?"
                              />

                              {/* Pending Disposition - Only show if incarcerated */}
                              {(editingSections[`spouse-${spouse.id}-identity-main`]
                                ? editedValues[`spouse-${spouse.id}-identity-main`]?.isIncarcerated === "yes"
                                : spouse.isIncarcerated === "yes") && (
                                <EditableField
                                  label="Pending Disposition"
                                  value={
                                    editingSections[`spouse-${spouse.id}-identity-main`]
                                      ? editedValues[`spouse-${spouse.id}-identity-main`]?.isPendingDisposition || ""
                                      : spouse.isPendingDisposition === "yes"
                                        ? "Yes"
                                        : spouse.isPendingDisposition === "no"
                                          ? "No"
                                          : "—"
                                  }
                                  isEditing={
                                    editingSections[`spouse-${spouse.id}-identity-main`] || false
                                  }
                                  onChange={(value) =>
                                    setEditedValues((prev) => ({
                                      ...prev,
                                      [`spouse-${spouse.id}-identity-main`]: {
                                        ...prev[`spouse-${spouse.id}-identity-main`],
                                        isPendingDisposition: value,
                                      },
                                    }))
                                  }
                                  type="select"
                                  options={[
                                    { value: "yes", label: "Yes" },
                                    { value: "no", label: "No" },
                                  ]}
                                  placeholder="Select disposition status"
                                  question="Is your spouse incarcerated pending disposition of charges?"
                                  required={spouse.isIncarcerated === "yes"}
                                />
                              )}

                              <EditableField
                                label="Hispanic, Latino, or Spanish Origin"
                                value={
                                  editingSections[`spouse-${spouse.id}-identity-main`]
                                    ? editedValues[`spouse-${spouse.id}-identity-main`]?.hispanicOrigin || ""
                                    : spouse.hispanicOrigin === "yes"
                                      ? "Yes"
                                      : spouse.hispanicOrigin === "no"
                                        ? "No"
                                        : spouse.hispanicOrigin === "decline"
                                          ? "Declined to answer"
                                          : "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-identity-main`]: {
                                      ...prev[`spouse-${spouse.id}-identity-main`],
                                      hispanicOrigin: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                  { value: "decline", label: "Declined to answer" },
                                ]}
                                question="Does your spouse identify as Hispanic, Latino, or Spanish origin?"
                              />

                              <EditableField
                                label="Race/Ethnicity"
                                value={
                                  editingSections[`spouse-${spouse.id}-identity-main`]
                                    ? editedValues[`spouse-${spouse.id}-identity-main`]?.race || ""
                                    : spouse.race === "american-indian"
                                      ? "American Indian/Alaskan Native"
                                      : spouse.race === "asian-indian"
                                        ? "Asian Indian"
                                        : spouse.race === "black"
                                          ? "Black or African American"
                                          : spouse.race === "chinese"
                                            ? "Chinese"
                                            : spouse.race === "filipino"
                                              ? "Filipino"
                                              : spouse.race === "guamanian"
                                                ? "Guamanian or Chamorro"
                                                : spouse.race === "japanese"
                                                  ? "Japanese"
                                                  : spouse.race === "korean"
                                                    ? "Korean"
                                                    : spouse.race === "native-hawaiian"
                                                      ? "Native Hawaiian"
                                                      : spouse.race === "samoan"
                                                        ? "Samoan"
                                                        : spouse.race === "vietnamese"
                                                          ? "Vietnamese"
                                                          : spouse.race === "white"
                                                            ? "White"
                                                            : spouse.race === "asian-other"
                                                              ? "Asian Race not listed above"
                                                              : spouse.race === "pacific-islander-other"
                                                                ? "Pacific Islander Race not listed above"
                                                                : spouse.race === "other"
                                                                  ? "Race not listed above"
                                                                  : spouse.race === "decline"
                                                                    ? "Declined to answer"
                                                                    : "—"
                                }
                                isEditing={editingSections[`spouse-${spouse.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`spouse-${spouse.id}-identity-main`]: {
                                      ...prev[`spouse-${spouse.id}-identity-main`],
                                      race: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "decline", label: "Decline to answer" },
                                  { value: "american-indian", label: "American Indian/Alaskan Native" },
                                  { value: "asian-indian", label: "Asian Indian" },
                                  { value: "black", label: "Black or African American" },
                                  { value: "chinese", label: "Chinese" },
                                  { value: "filipino", label: "Filipino" },
                                  { value: "guamanian", label: "Guamanian or Chamorro" },
                                  { value: "japanese", label: "Japanese" },
                                  { value: "korean", label: "Korean" },
                                  { value: "native-hawaiian", label: "Native Hawaiian" },
                                  { value: "samoan", label: "Samoan" },
                                  { value: "vietnamese", label: "Vietnamese" },
                                  { value: "white", label: "White" },
                                  { value: "asian-other", label: "Asian Race not listed above" },
                                  { value: "pacific-islander-other", label: "Pacific Islander Race not listed above" },
                                  { value: "other", label: "Race not listed above" },
                                ]}
                                question="What is your spouse's race/ethnicity?"
                              />
                            </div>
                          </EditableSection>

                          {/* Income Information - Show for all spouses regardless of coverage status */}
                          <EditableSection
                            title="Income Information"
                            icon={<DollarSign className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("income", `spouse-${spouse.id}`)}
                            isEditing={editingSections[`spouse-${spouse.id}-income-main`] || false}
                            onSave={() => handleSaveSection("income", `spouse-${spouse.id}`)}
                            onCancel={() => handleCancelEditing("income", `spouse-${spouse.id}`)}
                          >
                            <div className="space-y-4">
                              {spouse.incomeSources && spouse.incomeSources.length > 0 ? (
                                <div className="space-y-3">
                                  {spouse.incomeSources.map((source, idx) => (
                                    <div key={idx} className="bg-gray-100 p-3 rounded-lg">
                                      {inlineEditingIncomeSource.memberId === spouse.id &&
                                      inlineEditingIncomeSource.index === idx ? (
                                        // Inline editing form for spouse income source
                                        <div className="space-y-3">
                                          {/* Income source editing form fields - similar to primary applicant */}
                                          <div className="grid grid-cols-2 gap-3">
                                            <div>
                                              <Label htmlFor={`spouse-source-type-${idx}`}>Source Type</Label>
                                              <Select
                                                value={inlineEditingIncomeSource.source?.type || source.type}
                                                onValueChange={(value) => {
                                                  setInlineEditingIncomeSource((prev) => {
                                                    // If changing to unemployed, set amount to 0
                                                    if (value === "unemployed") {
                                                      return {
                                                        ...prev,
                                                        source: {
                                                          ...prev.source!,
                                                          type: value as IncomeSourceType,
                                                          amount: 0,
                                                          frequency: "yearly",
                                                        },
                                                      }
                                                    }
                                                    return {
                                                      ...prev,
                                                      source: {
                                                        ...prev.source!,
                                                        type: value as IncomeSourceType,
                                                      },
                                                    }
                                                  })
                                                }}
                                              >
                                                <SelectTrigger id={`spouse-source-type-${idx}`}>
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {incomeSourceTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                      {type.name}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            {inlineEditingIncomeSource.source?.type !== "unemployed" && (
                                              <div>
                                                <Label htmlFor={`spouse-frequency-${idx}`}>Frequency</Label>
                                                <Select
                                                  value={
                                                    inlineEditingIncomeSource.source?.frequency || source.frequency
                                                  }
                                                  onValueChange={(value) => {
                                                    setInlineEditingIncomeSource((prev) => ({
                                                      ...prev,
                                                      source: {
                                                        ...prev.source!,
                                                        frequency: value as FrequencyType,
                                                      },
                                                    }))
                                                  }}
                                                >
                                                  <SelectTrigger id={`spouse-frequency-${idx}`}>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {frequencyOptions.map((option) => (
                                                      <SelectItem key={option.id} value={option.id}>
                                                        {option.label}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            )}
                                          </div>

                                          {inlineEditingIncomeSource.source?.type !== "unemployed" && (
                                            <div>
                                              <Label htmlFor={`spouse-amount-${idx}`}>Amount</Label>
                                              <div className="relative">
                                                <Input
                                                  id={`spouse-amount-${idx}`}
                                                  type="text"
                                                  value={inlineEditingIncomeSource.source?.amount?.toString() || ""}
                                                  onChange={(e) => {
                                                    const formattedValue = formatCurrencyInput(e.target.value)
                                                    setInlineEditingIncomeSource((prev) => ({
                                                      ...prev,
                                                      source: {
                                                        ...prev.source!,
                                                        amount: Number(formattedValue) || 0,
                                                      },
                                                    }))
                                                  }}
                                                  placeholder="0.00"
                                                  className="pl-10"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                  <DollarSign className="h-4 w-4 text-gray-400" />
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {/* Add other type-specific fields similar to primary applicant */}

                                          <div className="flex justify-end gap-2 mt-3">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={handleCancelInlineIncomeSource}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              size="sm"
                                              className="bg-purple-600 hover:bg-purple-700 text-white"
                                              onClick={handleSaveInlineIncomeSource}
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        // Normal display
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="text-sm font-medium text-gray-800">
                                              {source.type === "job"
                                                ? "Full-time Job"
                                                : source.type === "self-employed"
                                                  ? "Self-employed"
                                                  : source.type === "unemployment"
                                                    ? "Unemployment"
                                                    : source.type === "unemployed"
                                                      ? "Unemployed"
                                                      : "Other Income"}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">{source.frequency}</p>
                                            {source.employerName && (
                                              <p className="text-xs text-gray-500">Employer: {source.employerName}</p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="font-medium text-purple-700">
                                              {formatCurrency(source.amount)}
                                            </div>
                                            {editingSections[`spouse-${spouse.id}-income-main`] && (
                                              <div className="flex gap-1">
                                                <button
                                                  onClick={() =>
                                                    handleEditFamilyMemberIncomeSource(spouse.id, source, idx)
                                                  }
                                                  className="text-gray-500 hover:text-purple-600"
                                                  aria-label="Edit income source"
                                                >
                                                  <Edit className="h-4 w-4" />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                                  No income sources added
                                  {editingSections[`spouse-${spouse.id}-income-main`] && (
                                    <div className="mt-3">
                                      <Button
                                        size="sm"
                                        onClick={() => handleAddFamilyMemberIncomeSource(spouse.id)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Income Source
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </EditableSection>

                          {/* Display coverage status notice */}
                          {!spouse.includedInCoverage && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-700">
                                  This spouse is not included in your coverage. Information may be incomplete because
                                  some enrollment steps were skipped.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionSection>
                    ))}

                  {/* Dependents Information */}
                  {familyMembers
                    .filter((member) => member.type === "dependent")
                    .map((dependent, index) => (
                      <AccordionSection
                        key={dependent.id}
                        title={`${dependent.firstName || "Dependent"} ${dependent.lastName || ""} (Dependent ${index + 1})`}
                        icon={<User className="h-4 w-4 text-purple-600" />}
                        className="border-purple-200"
                        isEnrolled={enrolledFamilyMembers[dependent.id]}
                        onContinue={
                          !enrolledFamilyMembers[dependent.id]
                            ? () => startFamilyMemberEnrollment(dependent)
                            : undefined
                        }
                        continueText="Begin Enrollment"
                      >
                        <div className="space-y-4">
                          <EditableSection
                            title="Personal Information"
                            icon={<User className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("personal", `${dependent.type}-${dependent.id}`)}
                            isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                            onSave={() => handleSaveSection("personal", `${dependent.type}-${dependent.id}`)}
                            onCancel={() => handleCancelEditing("personal", `${dependent.type}-${dependent.id}`)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <EditableField
                                label="First Name"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-personal-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-personal-main`]?.firstName || ""
                                    : dependent.firstName || "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-personal-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-personal-main`],
                                      firstName: value,
                                    },
                                  }))
                                }
                                placeholder="Enter first name"
                                required={dependent.includedInCoverage}
                              />
                              <EditableField
                                label="Last Name"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-personal-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-personal-main`]?.lastName || ""
                                    : dependent.lastName || "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-personal-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-personal-main`],
                                      lastName: value,
                                    },
                                  }))
                                }
                                placeholder="Enter last name"
                                required={dependent.includedInCoverage}
                              />
                              <EditableField
                                label="Date of Birth"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-personal-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-personal-main`]?.dateOfBirth || ""
                                    : dependent.dateOfBirth || "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-personal-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-personal-main`],
                                      dateOfBirth: value,
                                    },
                                  }))
                                }
                                placeholder="MM/DD/YYYY"
                                required={dependent.includedInCoverage}
                              />
                              <EditableField
                                label="Gender"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-personal-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-personal-main`]?.gender || ""
                                    : dependent.gender
                                      ? dependent.gender === "male"
                                        ? "Male"
                                        : "Female"
                                      : "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-personal-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-personal-main`],
                                      gender: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "male", label: "Male" },
                                  { value: "female", label: "Female" },
                                ]}
                                placeholder="Select gender"
                                required={dependent.includedInCoverage}
                              />
                              <EditableField
                                label="Tobacco Use"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-personal-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-personal-main`]?.tobaccoUsage ||
                                      ""
                                    : dependent.tobaccoUsage
                                      ? dependent.tobaccoUsage === "smoker"
                                        ? "Smoker"
                                        : "Non-smoker"
                                      : "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-personal-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-personal-main`],
                                      tobaccoUsage: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "smoker", label: "Smoker" },
                                  { value: "non-smoker", label: "Non-smoker" },
                                ]}
                                placeholder="Select tobacco usage"
                                question="Has your dependent used tobacco products in the last 6 months?"
                                required={dependent.includedInCoverage}
                              />
                              <EditableField
                                label="Included in Coverage"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-personal-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-personal-main`]?.includedInCoverage || ""
                                    : dependent.includedInCoverage
                                      ? "Yes"
                                      : "No"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-personal-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-personal-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-personal-main`],
                                      includedInCoverage: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "true", label: "Yes" },
                                  { value: "false", label: "No" },
                                ]}
                                placeholder="Select coverage status"
                              />
                            </div>
                          </EditableSection>

                          {/* Contact Information - Always show, blank if not provided */}
                          <EditableSection
                            title="Contact Information"
                            icon={<Mail className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("contact", `${dependent.type}-${dependent.id}`)}
                            isEditing={editingSections[`${dependent.type}-${dependent.id}-contact-main`] || false}
                            onSave={() => handleSaveSection("contact", `${dependent.type}-${dependent.id}`)}
                            onCancel={() => handleCancelEditing("contact", `${dependent.type}-${dependent.id}`)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <EditableField
                                label="Email Address"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-contact-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-contact-main`]?.email || ""
                                    : dependent.email || "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-contact-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-contact-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-contact-main`],
                                      email: value,
                                    },
                                  }))
                                }
                                placeholder="Enter email address"
                                required={dependent.includedInCoverage}
                              />
                              <EditableField
                                label="Phone Number"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-contact-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-contact-main`]?.phoneNumber || ""
                                    : dependent.phoneNumber || "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-contact-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-contact-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-contact-main`],
                                      phoneNumber: value,
                                    },
                                  }))
                                }
                                placeholder="Enter phone number"
                                required={dependent.includedInCoverage}
                              />
                            </div>
                            {!dependent.includedInCoverage &&
                              !dependent.email &&
                              !dependent.phoneNumber &&
                              !editingSections[`${dependent.type}-${dependent.id}-contact-main`] && (
                                <div className="text-sm text-gray-500 italic mt-2">
                                  Contact information not provided
                                </div>
                              )}
                          </EditableSection>

                          {/* Identity Information - Always show, blank if not provided */}
                          <EditableSection
                            title="Identity & Legal Information"
                            icon={<Shield className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("identity", `${dependent.type}-${dependent.id}`)}
                            isEditing={editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false}
                            onSave={() => handleSaveSection("identity", `${dependent.type}-${dependent.id}`)}
                            onCancel={() => handleCancelEditing("identity", `${dependent.type}-${dependent.id}`)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Social Security Number" value={dependent.ssn ? "•••-••-••••" : "—"} />
                              <EditableField
                                label="U.S. Citizen"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]?.isUSCitizen || ""
                                    : dependent.isUSCitizen === "yes"
                                      ? "Yes"
                                      : dependent.isUSCitizen === "no"
                                        ? "No"
                                        : "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-identity-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                      isUSCitizen: value,
                                    },
                                  }))
                                }
                                onChangeImmediate={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-identity-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                      isUSCitizen: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                ]}
                                placeholder="Select citizenship status"
                                question="Is your dependent a U.S. citizen?"
                                required={dependent.includedInCoverage}
                              />

                              {/* Immigration Document - Only show if not a US citizen */}
                              {(editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]?.isUSCitizen === "no"
                                : dependent.isUSCitizen === "no") && (
                                <EditableField
                                  label="Immigration Document"
                                  value={
                                    editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                      ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]
                                          ?.immigrationDocumentType || ""
                                      : dependent.immigrationDocumentType || "—"
                                  }
                                  isEditing={
                                    editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false
                                  }
                                  onChange={(value) =>
                                    setEditedValues((prev) => ({
                                      ...prev,
                                      [`${dependent.type}-${dependent.id}-identity-main`]: {
                                        ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                        immigrationDocumentType: value,
                                      },
                                    }))
                                  }
                                  type="select"
                                  options={[
                                    { value: "permanent-resident-card", label: "Permanent Resident Card" },
                                    { value: "employment-authorization", label: "Employment Authorization" },
                                    { value: "visa", label: "Visa" },
                                    { value: "other", label: "Other" },
                                  ]}
                                  placeholder="Select document type"
                                  required={dependent.includedInCoverage && dependent.isUSCitizen === "no"}
                                />
                              )}

                              <EditableField
                                label="Currently Incarcerated"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]?.isIncarcerated ||
                                      ""
                                    : dependent.isIncarcerated === "yes"
                                      ? "Yes"
                                      : dependent.isIncarcerated === "no"
                                        ? "No"
                                        : "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-identity-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                      isIncarcerated: value,
                                    },
                                  }))
                                }
                                onChangeImmediate={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-identity-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                      isIncarcerated: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                ]}
                                placeholder="Select incarceration status"
                                question="Is your dependent currently incarcerated?"
                                required={dependent.includedInCoverage}
                              />

                              {/* Pending Disposition - Only show if incarcerated */}
                              {(editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]?.isIncarcerated ===
                                  "yes"
                                : dependent.isIncarcerated === "yes") && (
                                <EditableField
                                  label="Pending Disposition"
                                  value={
                                    editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                      ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]
                                          ?.isPendingDisposition || ""
                                      : dependent.isPendingDisposition === "yes"
                                        ? "Yes"
                                        : dependent.isPendingDisposition === "no"
                                          ? "No"
                                          : "—"
                                  }
                                  isEditing={
                                    editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false
                                  }
                                  onChange={(value) =>
                                    setEditedValues((prev) => ({
                                      ...prev,
                                      [`${dependent.type}-${dependent.id}-identity-main`]: {
                                        ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                        isPendingDisposition: value,
                                      },
                                    }))
                                  }
                                  type="select"
                                  options={[
                                    { value: "yes", label: "Yes" },
                                    { value: "no", label: "No" },
                                  ]}
                                  placeholder="Select disposition status"
                                  question="Is your dependent incarcerated pending disposition of charges?"
                                  required={dependent.includedInCoverage && dependent.isIncarcerated === "yes"}
                                />
                              )}

                              <EditableField
                                label="Hispanic, Latino, or Spanish Origin"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]?.hispanicOrigin ||
                                      ""
                                    : dependent.hispanicOrigin === "yes"
                                      ? "Yes"
                                      : dependent.hispanicOrigin === "no"
                                        ? "No"
                                        : dependent.hispanicOrigin === "decline"
                                          ? "Declined to answer"
                                          : "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-identity-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                      hispanicOrigin: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" },
                                  { value: "decline", label: "Declined to answer" },
                                ]}
                                placeholder="Select origin"
                                question="Does your dependent identify as Hispanic, Latino, or Spanish origin?"
                                required={dependent.includedInCoverage}
                              />

                              <EditableField
                                label="Race/Ethnicity"
                                value={
                                  editingSections[`${dependent.type}-${dependent.id}-identity-main`]
                                    ? editedValues[`${dependent.type}-${dependent.id}-identity-main`]?.race || ""
                                    : dependent.race === "american-indian"
                                      ? "American Indian/Alaskan Native"
                                      : dependent.race === "asian-indian"
                                        ? "Asian Indian"
                                        : dependent.race === "black"
                                          ? "Black or African American"
                                          : dependent.race === "chinese"
                                            ? "Chinese"
                                            : dependent.race === "filipino"
                                              ? "Filipino"
                                              : dependent.race === "guamanian"
                                                ? "Guamanian or Chamorro"
                                                : dependent.race === "japanese"
                                                  ? "Japanese"
                                                  : dependent.race === "korean"
                                                    ? "Korean"
                                                    : dependent.race === "native-hawaiian"
                                                      ? "Native Hawaiian"
                                                      : dependent.race === "samoan"
                                                        ? "Samoan"
                                                        : dependent.race === "vietnamese"
                                                          ? "Vietnamese"
                                                          : dependent.race === "white"
                                                            ? "White"
                                                            : dependent.race === "asian-other"
                                                              ? "Asian Race not listed above"
                                                              : dependent.race === "pacific-islander-other"
                                                                ? "Pacific Islander Race not listed above"
                                                                : dependent.race === "other"
                                                                  ? "Race not listed above"
                                                                  : dependent.race === "decline"
                                                                    ? "Declined to answer"
                                                                    : "—"
                                }
                                isEditing={editingSections[`${dependent.type}-${dependent.id}-identity-main`] || false}
                                onChange={(value) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    [`${dependent.type}-${dependent.id}-identity-main`]: {
                                      ...prev[`${dependent.type}-${dependent.id}-identity-main`],
                                      race: value,
                                    },
                                  }))
                                }
                                type="select"
                                options={[
                                  { value: "decline", label: "Decline to answer" },
                                  { value: "american-indian", label: "American Indian/Alaskan Native" },
                                  { value: "asian-indian", label: "Asian Indian" },
                                  { value: "black", label: "Black or African American" },
                                  { value: "chinese", label: "Chinese" },
                                  { value: "filipino", label: "Filipino" },
                                  { value: "guamanian", label: "Guamanian or Chamorro" },
                                  { value: "japanese", label: "Japanese" },
                                  { value: "korean", label: "Korean" },
                                  { value: "native-hawaiian", label: "Native Hawaiian" },
                                  { value: "samoan", label: "Samoan" },
                                  { value: "vietnamese", label: "Vietnamese" },
                                  { value: "white", label: "White" },
                                  { value: "asian-other", label: "Asian Race not listed above" },
                                  { value: "pacific-islander-other", label: "Pacific Islander Race not listed above" },
                                  { value: "other", label: "Race not listed above" },
                                ]}
                                placeholder="Select race/ethnicity"
                                question="What is your dependent's race/ethnicity?"
                                required={dependent.includedInCoverage}
                              />
                            </div>
                            {!dependent.includedInCoverage &&
                              !dependent.ssn &&
                              !dependent.isUSCitizen &&
                              !editingSections[`${dependent.type}-${dependent.id}-identity-main`] && (
                                <div className="text-sm text-gray-500 italic mt-2">
                                  Identity information not provided
                                </div>
                              )}
                          </EditableSection>

                          {/* Income Information - Show for all dependents regardless of coverage status */}
                          <EditableSection
                            title="Income Information"
                            icon={<DollarSign className="h-4 w-4 text-purple-600" />}
                            onEdit={() => handleEditSection("income", `${dependent.type}-${dependent.id}`)}
                            isEditing={editingSections[`${dependent.type}-${dependent.id}-income-main`] || false}
                            onSave={() => handleSaveSection("income", `${dependent.type}-${dependent.id}`)}
                            onCancel={() => handleCancelEditing("income", `${dependent.type}-${dependent.id}`)}
                          >
                            <div className="space-y-4">
                              {dependent.incomeSources && dependent.incomeSources.length > 0 ? (
                                <div className="space-y-3">
                                  {dependent.incomeSources.map((source, idx) => (
                                    <div key={idx} className="bg-gray-100 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">
                                            {source.type === "job"
                                              ? "Full-time Job"
                                              : source.type === "self-employed"
                                                ? "Self-employed"
                                                : source.type === "unemployment"
                                                  ? "Unemployment"
                                                  : source.type === "unemployed"
                                                    ? "Unemployed"
                                                    : "Other Income"}
                                          </p>
                                          <p className="text-xs text-gray-500 capitalize">{source.frequency}</p>
                                          {source.employerName && (
                                            <p className="text-xs text-gray-500">Employer: {source.employerName}</p>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="font-medium text-purple-700">
                                            {formatCurrency(source.amount)}
                                          </div>
                                          {editingSections[`${dependent.type}-${dependent.id}-income-main`] && (
                                            <div className="flex gap-1">
                                              <button
                                                onClick={() =>
                                                  handleEditFamilyMemberIncomeSource(dependent.id, source, idx)
                                                }
                                                className="text-gray-500 hover:text-purple-600"
                                                aria-label="Edit income source"
                                              >
                                                <Edit className="h-4 w-4" />
                                              </button>
                                              <button
                                                onClick={() => {
                                                  // Handle removing dependent's income source
                                                  const member = familyMembers.find(m => m.id === dependent.id);
                                                  if (member) {
                                                    const updatedSources = [...member.incomeSources];
                                                    updatedSources.splice(idx, 1);
                                                    
                                                    // Update the family members with the updated income sources
                                                    const updatedFamilyMembers = familyMembers.map(m => 
                                                      m.id === dependent.id ? {...m, incomeSources: updatedSources} : m
                                                    );
                                                    
                                                    setFamilyMembers(updatedFamilyMembers);
                                                    sessionStorage.setItem("familyMembers", JSON.stringify(updatedFamilyMembers));
                                                    
                                                    toast({
                                                      title: "Income source removed",
                                                      description: "The income source has been removed successfully.",
                                                    });
                                                  }
                                                }}
                                                className="text-gray-500 hover:text-red-600"
                                                aria-label="Remove income source"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                                  No income sources added
                                </div>
                              )}
                            </div>
                          </EditableSection>

                          {/* Display coverage status notice */}
                          {!dependent.includedInCoverage && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-700">
                                  This dependent is not included in your coverage. Information may be incomplete because
                                  some enrollment steps were skipped.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionSection>
                    ))}
                </>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-4 flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!areAllFamilyMembersEnrolled()}
                className={cn(
                  "w-full md:w-2/3 py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 transition-all",
                  areAllFamilyMembersEnrolled()
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed",
                )}
              >
                {areAllFamilyMembersEnrolled() ? (
                  <>
                    Continue to Agreements
                    <ArrowRight className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Complete All Enrollments
                    <AlertCircle className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Enrollment status message */}
            {!areAllFamilyMembersEnrolled() && (
              <div className="mt-3 text-center text-sm text-amber-600">
                Please complete enrollment for all family members before proceeding
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Eligibility Notice Dialog */}
      <Dialog open={showEligibilityNotice} onOpenChange={setShowEligibilityNotice}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eligibility Notice</DialogTitle>
            <DialogDescription>
              {eligibilityType === "medicare" ? (
                <>
                  Based on the information provided, you or a family member may be eligible for Medicare. Please
                  contact Medicare to confirm your eligibility.
                </>
              ) : eligibilityType === "medicaid" ? (
                <>
                  Based on the information provided, you or a family member may be eligible for Medicaid. Please
                  contact Medicaid to confirm your eligibility.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseEligibilityNotice}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
