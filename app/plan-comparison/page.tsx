"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { mockPlans } from "@/data/mockPlans"
import type { InsurancePlan } from "@/types/plans"
import { cn } from "@/lib/utils"
import Link from "next/link"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"

export default function PlanComparisonPage() {
  const searchParams = useSearchParams()
  const planIdsParam = searchParams.get("plans") || ""

  const [selectedPlans, setSelectedPlans] = useState<InsurancePlan[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "plan-highlights": true,
    "doctor-visits": false,
    "prescription-drugs": false,
    "emergency-services": false,
    "hospital-services": false,
    "maternity-care": false,
  })
  const [costView, setCostView] = useState<"before" | "after">("before")

  useEffect(() => {
    if (planIdsParam) {
      const ids = planIdsParam.split(",")
      const plans = mockPlans.filter((plan) => ids.includes(plan.id))
      setSelectedPlans(plans)
    }
  }, [planIdsParam]) // Now we only depend on the stable planIdsParam string

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMetalLevelColor = (metalLevel: string) => {
    switch (metalLevel.toLowerCase()) {
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "bronze":
        return "bg-amber-100 text-amber-800"
      case "platinum":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedPlans.length === 0) {
    return (
      <>
        <SimpleHeader />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">No Plans Selected</h1>
            <p className="text-gray-600 mb-6">Please select plans to compare from the plans page.</p>
            <Link href="/plans">
              <Button>Go to Plans</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back button and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/plans" className="mr-3">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <ArrowLeft size={16} />
                  Back to Plans
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Plan Comparison</h1>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selectedPlans.map((plan, index) => (
              <div key={plan.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Plan Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium",
                          index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-2 text-xs font-medium text-gray-600">Ranked #{plan.rank || index + 1}</div>
                    </div>
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        getMetalLevelColor(plan.metalLevel),
                      )}
                    >
                      {plan.metalLevel}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">{plan.carrier}</h2>
                  <p className="text-sm text-gray-600">{plan.name}</p>

                  <div className="mt-2 flex items-center">
                    <div className={cn("text-xs font-medium", getMatchColor(plan.matchScore || 0))}>
                      {plan.matchScore || 67}% match
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Monthly Premium
                    </p>
                    <p className="font-bold text-gray-900">${plan.premium}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Deductible
                    </p>
                    <p className="font-bold text-gray-900">${plan.deductible.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      Plan Type
                    </p>
                    <p className="font-bold text-gray-900">{plan.type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Out-of-Pocket
                    </p>
                    <p className="font-bold text-gray-900">${plan.outOfPocketMax.toLocaleString()}</p>
                  </div>
                </div>

                {/* Coverage Indicators */}
                <div className="px-4 pb-2 flex items-center gap-4">
                  <div className="flex items-center">
                    <div
                      className={cn("w-2 h-2 rounded-full mr-1", plan.coversDoctors ? "bg-green-500" : "bg-red-500")}
                    ></div>
                    <span className="text-xs text-gray-600">Doctors</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mr-1",
                        plan.coversMedications ? "bg-green-500" : "bg-red-500",
                      )}
                    ></div>
                    <span className="text-xs text-gray-600">Medications</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="px-4 pb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn("w-4 h-4", i < Math.floor(plan.rating) ? "text-yellow-400" : "text-gray-300")}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-600">{plan.rating}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  <Link href={`/plan-details?id=${plan.id}`}>
                    <Button variant="outline" className="w-full">
                      Details
                    </Button>
                  </Link>
                  <Link href={`/enroll/create-account?planId=${plan.id}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12L10 17L19 8"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Enroll
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Cost View Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-1 border border-gray-200 inline-flex">
              <button
                className={cn(
                  "px-4 py-1 text-sm rounded-full transition-colors",
                  costView === "before" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100",
                )}
                onClick={() => setCostView("before")}
              >
                Before Deductible
              </button>
              <button
                className={cn(
                  "px-4 py-1 text-sm rounded-full transition-colors",
                  costView === "after" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100",
                )}
                onClick={() => setCostView("after")}
              >
                After Deductible
              </button>
            </div>
          </div>

          {/* Comparison Sections */}
          <div className="space-y-4">
            {/* Plan Highlights */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleSection("plan-highlights")}
              >
                <h2 className="text-lg font-semibold">Plan Highlights</h2>
                {expandedSections["plan-highlights"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections["plan-highlights"] && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left font-medium text-gray-500"></th>
                          {selectedPlans.map((plan, index) => (
                            <th key={plan.id} className="p-4 text-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mb-1",
                                    index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                                  )}
                                >
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-900">{plan.carrier}</span>
                                <span className="text-xs text-gray-500">{plan.name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Monthly premium</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-premium`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">${plan.premium}</span>
                                <span className="text-gray-500 text-xs ml-1">/mo</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Deductible</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-deductible`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  ${plan.deductible.toLocaleString()}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Max out-of-pocket</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-oop`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  ${plan.outOfPocketMax.toLocaleString()}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Plan tier</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-tier`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">{plan.metalLevel}</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Network type</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-network`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">{plan.type}</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 text-sm font-medium text-gray-700">Rating</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-rating`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">{plan.rating}/5</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Visits */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleSection("doctor-visits")}
              >
                <h2 className="text-lg font-semibold">Doctor Visits</h2>
                {expandedSections["doctor-visits"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections["doctor-visits"] && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left font-medium text-gray-500"></th>
                          {selectedPlans.map((plan, index) => (
                            <th key={plan.id} className="p-4 text-center">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto",
                                  index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                                )}
                              >
                                {index + 1}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Primary care visit</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-primary`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$30 copay" : "$15 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Specialist visit</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-specialist`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$50 copay" : "$25 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 text-sm font-medium text-gray-700">Preventive care</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-preventive`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-green-600 font-semibold">No charge</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Prescription Drugs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleSection("prescription-drugs")}
              >
                <h2 className="text-lg font-semibold">Prescription Drugs</h2>
                {expandedSections["prescription-drugs"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections["prescription-drugs"] && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left font-medium text-gray-500"></th>
                          {selectedPlans.map((plan, index) => (
                            <th key={plan.id} className="p-4 text-center">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto",
                                  index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                                )}
                              >
                                {index + 1}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Generic drugs</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-generic`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$15 copay" : "$10 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Preferred brand drugs</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-preferred`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$50 copay" : "$35 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 text-sm font-medium text-gray-700">Non-preferred brand drugs</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-nonpreferred`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$100 copay" : "$75 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Services */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleSection("emergency-services")}
              >
                <h2 className="text-lg font-semibold">Emergency Services</h2>
                {expandedSections["emergency-services"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections["emergency-services"] && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left font-medium text-gray-500"></th>
                          {selectedPlans.map((plan, index) => (
                            <th key={plan.id} className="p-4 text-center">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto",
                                  index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                                )}
                              >
                                {index + 1}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Emergency room care</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-er`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$350 copay" : "$250 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 text-sm font-medium text-gray-700">Emergency medical transportation</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-transport`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "$250 copay" : "$150 copay"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Hospital Services */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleSection("hospital-services")}
              >
                <h2 className="text-lg font-semibold">Hospital Services</h2>
                {expandedSections["hospital-services"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections["hospital-services"] && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left font-medium text-gray-500"></th>
                          {selectedPlans.map((plan, index) => (
                            <th key={plan.id} className="p-4 text-center">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto",
                                  index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                                )}
                              >
                                {index + 1}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Inpatient hospital stay</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-inpatient`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "20% coinsurance" : "10% coinsurance"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 text-sm font-medium text-gray-700">Outpatient surgery</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-outpatient`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "20% coinsurance" : "10% coinsurance"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Maternity Care */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleSection("maternity-care")}
              >
                <h2 className="text-lg font-semibold">Maternity Care</h2>
                {expandedSections["maternity-care"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections["maternity-care"] && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-left font-medium text-gray-500"></th>
                          {selectedPlans.map((plan, index) => (
                            <th key={plan.id} className="p-4 text-center">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto",
                                  index === 0 ? "bg-purple-600" : index === 1 ? "bg-green-600" : "bg-blue-600",
                                )}
                              >
                                {index + 1}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-4 text-sm font-medium text-gray-700">Prenatal and postnatal care</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-prenatal`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-green-600 font-semibold">No charge</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 text-sm font-medium text-gray-700">Childbirth/delivery</td>
                          {selectedPlans.map((plan) => (
                            <td key={`${plan.id}-delivery`} className="p-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {costView === "before" ? "20% coinsurance" : "10% coinsurance"}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Birdy AI Floating Button */}
      <BirdyAIFloatingButton
        title="Plan Comparison Help"
        explanation="Get instant answers about plan differences, coverage details, and help understanding insurance terms."
        tips={[
          "Ask about specific coverage differences",
          "Learn what terms like 'coinsurance' mean",
          "Get help understanding which plan is best for your needs",
          "Ask about enrollment deadlines",
        ]}
      />
    </>
  )
}
