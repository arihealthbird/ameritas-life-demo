"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Plus, Edit, Trash2, Info, DollarSign, Briefcase, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { useToast } from "@/hooks/use-toast"
import { Stepper } from "@/components/Stepper"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { formatCurrency } from "@/utils/formatters"
import InlineIncomeSourceForm from "@/components/income/InlineIncomeSourceForm"

// Define the enrollment steps outside the component
const enrollmentSteps = [
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

export default function IncomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()

  // Use ref to prevent multiple initializations
  const initialLoadRef = useRef(false)
  const formContainerRef = useRef(null)

  // State for income sources and UI
  const [incomeSources, setIncomeSources] = useState([])
  const [isAddingSource, setIsAddingSource] = useState(false)
  const [editingSourceIndex, setEditingSourceIndex] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load saved data from session storage on component mount - ONCE ONLY
  useEffect(() => {
    // Prevent this effect from running more than once
    if (initialLoadRef.current) return
    initialLoadRef.current = true

    try {
      const savedIncomeSources = sessionStorage.getItem("incomeSources")
      if (savedIncomeSources) {
        setIncomeSources(JSON.parse(savedIncomeSources))
      }
    } catch (e) {
      console.error("Error loading data from session storage:", e)
    }
  }, [])

  // Calculate total income - memoized to prevent recalculation on every render
  const calculateTotalAnnualIncome = useCallback(() => {
    return incomeSources.reduce((total, source) => {
      let annualAmount = source.amount || 0

      if (source.frequency === "monthly") {
        annualAmount *= 12
      } else if (source.frequency === "biweekly") {
        annualAmount *= 26
      } else if (source.frequency === "weekly") {
        annualAmount *= 52
      }

      return total + annualAmount
    }, 0)
  }, [incomeSources])

  // Memoize the total annual income
  const totalAnnualIncome = calculateTotalAnnualIncome()

  const handleBack = useCallback(() => {
    router.push(`/enroll/demographics${planId ? `?planId=${planId}` : ""}`)
  }, [router, planId])

  const handleAddIncomeSource = useCallback(() => {
    // Reset editing state
    setEditingSourceIndex(null)
    // Show the add form
    setIsAddingSource(true)
    // Scroll to the form container
    setTimeout(() => {
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }, [])

  const handleCancelSourceForm = useCallback(() => {
    setIsAddingSource(false)
    setEditingSourceIndex(null)
  }, [])

  const handleSaveSource = useCallback(
    (source) => {
      try {
        let updatedSources

        if (editingSourceIndex !== null) {
          // Update existing source
          updatedSources = [...incomeSources]
          updatedSources[editingSourceIndex] = source
        } else {
          // Add new source
          updatedSources = [...incomeSources, source]
        }

        // Update state
        setIncomeSources(updatedSources)

        // Save to session storage
        try {
          sessionStorage.setItem("incomeSources", JSON.stringify(updatedSources))
        } catch (e) {
          console.error("Error saving to session storage:", e)
        }

        // Reset form state
        setIsAddingSource(false)
        setEditingSourceIndex(null)

        // Show toast
        toast({
          title: editingSourceIndex !== null ? "Income source updated" : "Income source added",
          description:
            editingSourceIndex !== null
              ? "Your income source has been updated successfully."
              : "Your income source has been added successfully.",
        })
      } catch (e) {
        console.error("Error saving income source:", e)
        toast({
          title: "Error",
          description: "There was an error saving the income source. Please try again.",
          variant: "destructive",
        })
      }
    },
    [incomeSources, editingSourceIndex, toast],
  )

  const handleEditIncomeSource = useCallback((index) => {
    setEditingSourceIndex(index)
    setIsAddingSource(true)
    // Scroll to the form container
    setTimeout(() => {
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }, [])

  const handleDeleteIncomeSource = useCallback(
    (index) => {
      try {
        // Create a new array without the item at the specified index
        const updatedSources = [...incomeSources]
        updatedSources.splice(index, 1)

        // Update state
        setIncomeSources(updatedSources)

        // Save to session storage
        try {
          sessionStorage.setItem("incomeSources", JSON.stringify(updatedSources))
        } catch (e) {
          console.error("Error saving to session storage:", e)
        }

        // Show toast
        toast({
          title: "Income source removed",
          description: "The income source has been removed successfully.",
        })
      } catch (e) {
        console.error("Error removing income source:", e)
        toast({
          title: "Error",
          description: "There was an error removing the income source. Please try again.",
          variant: "destructive",
        })
      }
    },
    [incomeSources, toast],
  )

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        try {
          sessionStorage.setItem("totalAnnualIncome", totalAnnualIncome.toString())
        } catch (e) {
          console.error("Error saving to session storage:", e)
        }

        // Simplified tobacco check
        let isTobaccoUser = false
        try {
          const personalInfo = JSON.parse(sessionStorage.getItem("personalInfo") || "{}")
          const basicInfo = JSON.parse(sessionStorage.getItem("basicInfo") || "{}")
          const editQuoteData = JSON.parse(sessionStorage.getItem("editQuoteData") || "{}")

          isTobaccoUser =
            personalInfo.tobaccoUser === "yes" ||
            personalInfo.tobaccoUsage === "yes" ||
            personalInfo.tobaccoUsage === "smoker" ||
            basicInfo.tobaccoUser === "yes" ||
            basicInfo.tobaccoUser === true ||
            basicInfo.tobaccoUsage === "smoker" ||
            editQuoteData.tobaccoUser === "yes" ||
            editQuoteData.tobaccoUser === true ||
            editQuoteData.tobaccoUsage === "smoker"
        } catch (e) {
          console.error("Error checking tobacco status:", e)
        }

        // Route to next page
        if (isTobaccoUser) {
          router.push(`/enroll/tobacco-usage${planId ? `?planId=${planId}` : ""}`)
        } else {
          router.push(`/enroll/review${planId ? `?planId=${planId}` : ""}`)
        }
      } catch (error) {
        console.error("Error saving income information:", error)
        toast({
          title: "Error",
          description: "There was an error saving your information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [totalAnnualIncome, router, planId, toast],
  )

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demographics
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="income" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton
                  title="Income Help"
                  explanation="Get instant answers about providing your income information for health insurance enrollment."
                  tips={[
                    "Learn why we collect income information",
                    "Understand how to add different income sources",
                    "Get help with income calculations",
                    "Learn about subsidy eligibility",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Income Information</h1>
                <p className="text-gray-500">
                  Please provide all of your income sources to determine subsidy eligibility
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Total Annual Income Display */}
              {incomeSources.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-600 rounded-full p-3">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Total Annual Income</h2>
                        <p className="text-sm text-gray-500">Estimated based on your sources</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-purple-700">{formatCurrency(totalAnnualIncome)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Income Sources Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Your Income Sources</h2>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>

                {/* Income sources list */}
                <div className="space-y-4 mb-6">
                  {incomeSources.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Briefcase className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl text-gray-600 font-medium">No income sources added yet</h3>
                      <p className="text-gray-500">Add your first income source to continue</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {incomeSources.map((source, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Income source header */}
                          <div className="bg-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="bg-purple-100 p-3 rounded-full">
                                {source.type === "job" ? (
                                  <Briefcase className="h-5 w-5 text-purple-600" />
                                ) : (
                                  <DollarSign className="h-5 w-5 text-purple-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {source.type === "job"
                                    ? "Full-time Job"
                                    : source.type === "self-employed"
                                      ? "Self-employed"
                                      : source.type === "unemployment"
                                        ? "Unemployment"
                                        : source.type === "unemployed"
                                          ? "Unemployed"
                                          : "Other Income"}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-purple-600">
                                  <span className="font-medium">{formatCurrency(source.amount)}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-500 capitalize">{source.frequency}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                aria-label="Edit income source"
                                onClick={() => handleEditIncomeSource(index)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                aria-label="Delete income source"
                                onClick={() => handleDeleteIncomeSource(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add income source button and form */}
                <div className="space-y-4" ref={formContainerRef}>
                  {!isAddingSource ? (
                    <button
                      type="button"
                      onClick={handleAddIncomeSource}
                      className="w-full border-2 border-dashed border-purple-200 rounded-xl py-4 px-6 flex items-center justify-center gap-2 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="font-medium">Add Income Source</span>
                    </button>
                  ) : (
                    <div className="border border-purple-200 rounded-xl overflow-hidden">
                      <div className="bg-purple-50 p-4 flex items-center justify-between">
                        <h3 className="font-medium text-purple-700">
                          {editingSourceIndex !== null ? "Edit Income Source" : "Add New Income Source"}
                        </h3>
                        <button
                          type="button"
                          onClick={handleCancelSourceForm}
                          className="text-purple-500 hover:text-purple-700"
                          aria-label="Cancel adding income source"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="p-4 bg-white">
                        <InlineIncomeSourceForm
                          key={editingSourceIndex !== null ? `edit-${editingSourceIndex}` : "add-new"}
                          initialData={editingSourceIndex !== null ? incomeSources[editingSourceIndex] : null}
                          onSave={handleSaveSource}
                          onCancel={handleCancelSourceForm}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || incomeSources.length === 0}
                  className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Continue to Next Step"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Info footer */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-2">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  This information helps determine your eligibility for subsidies and special programs.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
