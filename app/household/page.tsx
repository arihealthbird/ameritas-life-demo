"use client"

import { ShieldAlert, ArrowRight, HelpCircle } from "lucide-react"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import HouseholdIncomeSection from "@/components/HouseholdIncomeSection"
import ChildrenInput from "@/components/ChildrenInput"
import DebtInput from "@/components/DebtInput"
import LifeInsuranceCoverageDisplay from "@/components/LifeInsuranceCoverageDisplay"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import BackButton from "@/components/BackButton"
import { Particles } from "@/components/ui/particles-interactive"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { parseDateString, calculateAge } from "@/utils/dateUtils"
import { useLifeInsuranceCalculator } from "@/hooks/useLifeInsuranceCalculator"

type AgeValidationIssue = {
  type: "primary" | "spouse" | "dependent"
  name?: string
  index?: number
  age: number
}

export default function HouseholdPageRevised() {
  const router = useRouter()

  const [numberOfChildren, setNumberOfChildren] = useState(0)
  const [debtAmount, setDebtAmount] = useState(0)
  const [incomeAmount, setIncomeAmount] = useState("")
  const [incomeFrequency, setIncomeFrequency] = useState("annually")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isIncomeValid, setIsIncomeValid] = useState(false)
  const [incomeValidationError, setIncomeValidationError] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { calculateNeeds } = useLifeInsuranceCalculator()
  const [recommendedCoverage, setRecommendedCoverage] = useState(0)
  const [isCalculatingCoverage, setIsCalculatingCoverage] = useState(true)
  const [showAgeValidationDialog, setShowAgeValidationDialog] = useState(false)
  const [ageValidationIssues, setAgeValidationIssues] = useState<AgeValidationIssue[]>([])
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const [primaryApplicantAge, setPrimaryApplicantAge] = useState<number | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [calculationBreakdown, setCalculationBreakdown] = useState<Record<string, number> | undefined>()

  // Load data from session storage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const familyMembersJson = sessionStorage.getItem("familyMembers")
        if (familyMembersJson) setFamilyMembers(JSON.parse(familyMembersJson))

        const ageString = sessionStorage.getItem("primaryApplicantAge")
        if (ageString) setPrimaryApplicantAge(Number.parseInt(ageString, 10))

        const storedIncome = sessionStorage.getItem("incomeAmountLife") || ""
        setIncomeAmount(storedIncome)
        setIsIncomeValid(validateIncome(storedIncome, false))

        setIncomeFrequency(sessionStorage.getItem("incomeFrequencyLife") || "annually")
        setNumberOfChildren(Number.parseInt(sessionStorage.getItem("numberOfChildrenLife") || "0", 10))
        setDebtAmount(Number.parseInt(sessionStorage.getItem("debtAmountLife") || "0", 10))
      } catch (error) {
        console.error("Error loading data from session storage:", error)
      } finally {
        setIsInitialLoad(false)
      }
    }
  }, [])

  // This useEffect handles the calculation logic whenever an input changes.
  useEffect(() => {
    // Don't run the calculation if we are still on the initial load from session storage.
    if (isInitialLoad) return

    setIsCalculatingCoverage(true)

    const incomeNum = Number.parseInt(String(incomeAmount).replace(/[^0-9]/g, "")) || 0
    let annualIncome = incomeNum
    if (incomeFrequency === "monthly") annualIncome = incomeNum * 12
    else if (incomeFrequency === "biweekly") annualIncome = incomeNum * 26
    else if (incomeFrequency === "weekly") annualIncome = incomeNum * 52

    const ageForCalc = primaryApplicantAge ?? 30

    const needs = calculateNeeds({
      annualIncome: annualIncome,
      debtAmount: debtAmount,
      numberOfChildren: numberOfChildren,
      primaryApplicantAge: ageForCalc,
    })

    setRecommendedCoverage(needs.recommendedCoverage)
    setCalculationBreakdown(needs.calculationBreakdown)

    const timer = setTimeout(() => setIsCalculatingCoverage(false), 500)
    return () => clearTimeout(timer)
  }, [isInitialLoad, incomeAmount, incomeFrequency, debtAmount, numberOfChildren, primaryApplicantAge])

  const formatIncome = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits) return new Intl.NumberFormat("en-US").format(Number.parseInt(digits))
    return ""
  }

  const validateIncome = (value: string, showError = true): boolean => {
    const trimmedValue = String(value).trim()
    if (!trimmedValue) {
      if (showError) setIncomeValidationError("Income is required.")
      return false
    }
    const numericValue = Number.parseInt(trimmedValue.replace(/,/g, ""))
    if (isNaN(numericValue) || numericValue <= 0) {
      if (showError) setIncomeValidationError("Please enter a valid income amount greater than $0.")
      return false
    }
    setIncomeValidationError(undefined)
    return true
  }

  const handleIncomeChange = useCallback((value: string) => {
    const formatted = formatIncome(value)
    setIncomeAmount(formatted)
    setIsIncomeValid(validateIncome(formatted))
  }, [])

  const checkAgeValidationIssues = () => {
    const issues: AgeValidationIssue[] = []
    if (primaryApplicantAge !== null && primaryApplicantAge < 18) {
      issues.push({ type: "primary", age: primaryApplicantAge })
    }
    familyMembers.forEach((member) => {
      if (member.dateOfBirth && member.includedInCoverage !== false) {
        const parsedDate = parseDateString(member.dateOfBirth)
        if (parsedDate) {
          const age = calculateAge(parsedDate)
          if (member.type === "spouse" && age < 18) {
            issues.push({ type: "spouse", age, name: `Spouse` })
          }
        }
      }
    })
    return issues
  }

  const proceedToNextStep = () => {
    setIsSubmitting(false)
    router.push("/qualification")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isCurrentIncomeValidOnSubmit = validateIncome(incomeAmount)
    setIsIncomeValid(isCurrentIncomeValidOnSubmit)

    if (!isCurrentIncomeValidOnSubmit) {
      return
    }

    setIsSubmitting(true)

    sessionStorage.setItem("numberOfChildrenLife", numberOfChildren.toString())
    sessionStorage.setItem("debtAmountLife", debtAmount.toString())
    sessionStorage.setItem("incomeAmountLife", incomeAmount)
    sessionStorage.setItem("incomeFrequencyLife", incomeFrequency)
    sessionStorage.setItem("recommendedCoverageLife", recommendedCoverage.toString())

    const ageIssues = checkAgeValidationIssues()
    if (ageIssues.length > 0) {
      setAgeValidationIssues(ageIssues)
      setShowAgeValidationDialog(true)
      setIsSubmitting(false)
    } else {
      proceedToNextStep()
    }
  }

  const handleCloseAgeValidationDialog = () => {
    setShowAgeValidationDialog(false)
    proceedToNextStep()
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={30}
          staticity={20}
          ease={80}
          color="#e9d5ff"
          size={0.5}
          vx={0.05}
          vy={0.05}
        />
        <div className="max-w-xl mx-auto px-4 py-10 sm:py-16">
          <div className="max-w-md mx-auto mb-2 h-10">
            <BackButton />
          </div>
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl border border-gray-200/70 relative z-10 max-w-md mx-auto">
            <div className="absolute -top-4 -right-4 z-20">
              <BirdyAIFloatingButton
                title="Coverage Needs Help"
                explanation="Understand how these factors influence your life insurance needs."
                tips={[
                  "Why is number of children important?",
                  "How does income affect coverage?",
                  "What types of debt should I include?",
                  "How is my coverage estimate calculated?",
                ]}
              />
            </div>

            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
                Estimate Your Coverage
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                A few details help us tailor your life insurance estimate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <ChildrenInput
                count={numberOfChildren}
                onIncrement={() => setNumberOfChildren((prev) => Math.min(prev + 1, 10))}
                onDecrement={() => setNumberOfChildren((prev) => Math.max(prev - 1, 0))}
                label="How many children do you have under 18?"
                tooltipText="This helps us estimate their future needs."
              />

              <div>
                <div className="flex items-center mb-2">
                  <label htmlFor="incomeAmountField" className="block text-sm font-medium text-gray-800">
                    What is your estimated income for 2025?
                  </label>
                  <div className="relative group flex items-center ml-1.5">
                    <HelpCircle size={16} className="text-gray-500 cursor-help" />
                    <div
                      className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
                                 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-64 
                                 bottom-full left-0 mb-2 pointer-events-none shadow-lg"
                    >
                      Your income helps determine the coverage needed to maintain your family's lifestyle.
                      <div className="absolute w-2.5 h-2.5 bg-gray-900 transform rotate-45 left-3 -bottom-1"></div>
                    </div>
                  </div>
                </div>
                <HouseholdIncomeSection
                  incomeAmount={incomeAmount}
                  incomeFrequency={incomeFrequency}
                  dropdownOpen={dropdownOpen}
                  setIncomeAmount={handleIncomeChange}
                  setIncomeFrequency={setIncomeFrequency}
                  setDropdownOpen={setDropdownOpen}
                  formatIncome={formatIncome}
                  validationError={incomeValidationError}
                  hideInternalLabel={true}
                />
              </div>

              <DebtInput
                value={debtAmount}
                onChange={setDebtAmount}
                label="How much debt do you have?"
                tooltipText="Include mortgages, student loans, credit card debt, etc. This helps ensure debts are covered."
              />

              <div className="pt-2">
                <LifeInsuranceCoverageDisplay
                  recommendedCoverage={recommendedCoverage}
                  isLoading={isCalculatingCoverage}
                  calculationBreakdown={calculationBreakdown}
                />
              </div>

              <div className="mt-10 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isIncomeValid}
                  className="w-full max-w-xs mx-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3.5 px-6 rounded-full text-base font-semibold flex items-center justify-center gap-2.5 hover:shadow-xl hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:from-purple-600 disabled:hover:to-pink-500"
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showAgeValidationDialog && (
        <Dialog
          open={showAgeValidationDialog}
          onOpenChange={(isOpen) => {
            setShowAgeValidationDialog(isOpen)
            if (!isOpen) setIsSubmitting(false)
          }}
        >
          <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white flex items-center">
                  <ShieldAlert className="h-7 w-7 mr-2.5 flex-shrink-0" /> Age Restriction Notice
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">We've detected the following age-related considerations:</p>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {ageValidationIssues.map((issue, index) => (
                  <div key={index} className="p-3.5 rounded-lg border border-amber-300 bg-amber-50 shadow-sm">
                    <div className="flex items-start">
                      <ShieldAlert className="h-5 w-5 text-amber-600 mr-2.5 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {issue.type === "primary" && "Primary Applicant"}
                          {issue.type === "spouse" && (issue.name || "Spouse")}
                          {issue.type === "dependent" && (issue.name || `Dependent ${issue.index}`)}
                          {" - Age Consideration"}
                        </h3>
                        <p className="mt-1 text-sm text-amber-700">
                          This person is {issue.age} years old. Minimum age requirements may apply for certain policies
                          or roles.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 pt-2">
                You can still proceed, but eligibility or coverage options might be affected. We recommend discussing
                this with an agent.
              </p>
            </div>
            <DialogFooter className="p-6 bg-gray-50 border-t">
              <Button
                onClick={handleCloseAgeValidationDialog}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg text-white font-semibold py-2.5"
              >
                Continue Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
