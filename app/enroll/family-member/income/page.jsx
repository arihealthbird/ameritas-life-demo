"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Plus, Edit, Trash2, Info, DollarSign, Briefcase, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/utils/formatters"
import InlineIncomeSourceForm from "@/components/income/InlineIncomeSourceForm"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"
import { getFamilyMemberById, updateFamilyMember, getPreviousStep } from "@/utils/familyMemberUtils"
import { getStepUrl } from "@/utils/routeUtils"

export default function FamilyMemberIncomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const familyMemberId = searchParams.get("familyMemberId")
  const memberType = searchParams.get("type")
  const memberId = searchParams.get("id")
  const memberName = searchParams.get("name") || "Family Member"
  const { toast } = useToast()

  // Use ref to track initialization
  const initialLoadRef = useRef(false)
  const formContainerRef = useRef(null)

  // State for income sources and UI
  const [incomeSources, setIncomeSources] = useState([])
  const [isAddingSource, setIsAddingSource] = useState(false)
  const [editingSourceIndex, setEditingSourceIndex] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total income - done directly in render, not in state
  const totalAnnualIncome = incomeSources.reduce((total, source) => {
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

  // Load pre-filled data from session storage - ONCE ONLY
  useEffect(() => {
    if (initialLoadRef.current) return
    initialLoadRef.current = true

    if (!familyMemberId) {
      toast({
        title: "Missing family member information",
        description: "Unable to identify which family member to edit",
        variant: "destructive",
      })
      return
    }

    try {
      // Load family member data
      const member = getFamilyMemberById(familyMemberId)
      if (member && member.incomeSources) {
        setIncomeSources(member.incomeSources)
      }
    } catch (e) {
      console.error("Error loading family member data:", e)
    }
  }, [familyMemberId, toast])

  function handleAddIncomeSource() {
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
  }

  function handleCancelSourceForm() {
    setIsAddingSource(false)
    setEditingSourceIndex(null)
  }

  function handleSaveSource(source) {
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

      // Reset form state
      setIsAddingSource(false)
      setEditingSourceIndex(null)

      // Show toast
      toast({
        title: editingSourceIndex !== null ? "Income source updated" : "Income source added",
        description:
          editingSourceIndex !== null
            ? "The income source has been updated successfully."
            : "The income source has been added successfully.",
      })
    } catch (e) {
      console.error("Error saving income source:", e)
      toast({
        title: "Error",
        description: "There was an error saving the income source. Please try again.",
        variant: "destructive",
      })
    }
  }

  function handleEditIncomeSource(index) {
    setEditingSourceIndex(index)
    setIsAddingSource(true)
    // Scroll to the form container
    setTimeout(() => {
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  function handleDeleteIncomeSource(index) {
    try {
      // Create a new array without the item at the specified index
      const updatedSources = [...incomeSources]
      updatedSources.splice(index, 1)

      // Update state
      setIncomeSources(updatedSources)

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
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update family member data
      if (familyMemberId) {
        const member = getFamilyMemberById(familyMemberId)
        if (member) {
          const updatedMember = {
            ...member,
            incomeSources,
            totalAnnualIncome,
          }
          updateFamilyMember(updatedMember)

          // Check if the family member is a tobacco user
          const isTobaccoUser =
            member.tobaccoUsage === "yes" ||
            member.tobaccoUsage === "smoker" ||
            member.tobaccoUser === "yes" ||
            member.tobaccoUser === true

          // If member is included in coverage and is a tobacco user, route to tobacco page
          if (member.includedInCoverage && isTobaccoUser) {
            // Mark family member as needing tobacco usage information
            try {
              sessionStorage.setItem(
                `tobaccoUsageData_${familyMemberId}`,
                JSON.stringify({
                  isTobaccoUser: "yes",
                }),
              )
            } catch (e) {
              console.error("Error saving tobacco usage data:", e)
            }

            // Navigate to tobacco usage page
            router.push(
              `/enroll/family-member/tobacco-usage${planId ? `?planId=${planId}` : ""}&familyMemberId=${familyMemberId}&type=${memberType}&name=${encodeURIComponent(member.firstName || memberType)}`,
            )
            return
          }

          // Mark this family member as enrolled in session storage
          try {
            const enrolledMembersJson = sessionStorage.getItem("enrolledFamilyMembers")
            let enrolledMembers = {}

            if (enrolledMembersJson) {
              enrolledMembers = JSON.parse(enrolledMembersJson)
            }

            enrolledMembers[familyMemberId] = true
            sessionStorage.setItem("enrolledFamilyMembers", JSON.stringify(enrolledMembers))
          } catch (e) {
            console.error("Error updating enrolled members:", e)
          }
        }
      }

      // Show success toast
      toast({
        title: "Information Saved",
        description: `${memberType === "spouse" ? "Spouse" : "Dependent"} income information has been saved`,
      })

      // After completing the income page, redirect back to the review page
      router.push(`/enroll/review${planId ? `?planId=${planId}` : ""}`)
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
  }

  function handleBack() {
    router.push(
      `/enroll/family-member/demographics?id=${memberId}&type=${memberType}&name=${encodeURIComponent(memberName)}`,
    )
  }

  // Get the previous step for the back button
  const previousStep = getPreviousStep("income")
  const backUrl = previousStep ? getStepUrl(previousStep) : undefined
  const backText = previousStep ? `Back to ${previousStep.charAt(0).toUpperCase() + previousStep.slice(1)}` : undefined

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <FamilyMemberEnrollmentLayout
            currentStep="income"
            title={`${memberType === "spouse" ? "Spouse" : "Dependent"} Income Information`}
            description={`Please provide your ${memberType === "spouse" ? "spouse's" : "dependent's"} income sources`}
            aiTitle={`${memberType === "spouse" ? "Spouse" : "Dependent"} Income Help`}
            aiExplanation={`Get instant answers about providing your ${memberType === "spouse" ? "spouse's" : "dependent's"} income information for health insurance enrollment.`}
            aiTips={[
              `Learn why we collect your ${memberType === "spouse" ? "spouse's" : "dependent's"} income information`,
              "Understand how to add different income sources",
              "Get help with income calculations",
              "Learn about subsidy eligibility",
            ]}
            backUrl={backUrl}
            backText={backText}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Total Annual Income Display */}
              {incomeSources.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-600 rounded-full p-3">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Total Annual Income</h2>
                        <p className="text-sm text-gray-500">Estimated based on income sources</p>
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
                  <h2 className="text-xl font-semibold">Income Sources</h2>
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
                      <p className="text-gray-500">Add an income source to continue</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {incomeSources.map((source, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Income source header */}
                          <div className="bg-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="bg-purple-100 p-3 rounded-full">
                                {source.type === "job" || source.type === "part-time" ? (
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
                  {isSubmitting ? "Saving..." : "Complete Enrollment"}
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
          </FamilyMemberEnrollmentLayout>
        </div>
      </div>
    </>
  )
}
