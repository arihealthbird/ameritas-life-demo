"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { User, Pill, Check, AlertTriangle, X, Plus, Search, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDoctorSearch } from "@/hooks/useDoctorSearch"
import { useMedicationSearch } from "@/hooks/useMedicationSearch"
import type { InsurancePlan } from "@/types/plans"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CoverageStatusButtonsProps {
  plan: InsurancePlan
  className?: string
}

export default function CoverageStatusButtons({ plan, className }: CoverageStatusButtonsProps) {
  const {
    selectedDoctors,
    handleAddDoctor,
    handleRemoveDoctor,
    doctorSearchQuery,
    setDoctorSearchQuery,
    handleDoctorSearch,
    doctorSearchResults,
    isDoctorSearching,
  } = useDoctorSearch()

  const {
    selectedMedications,
    handleAddMedication,
    handleRemoveMedication,
    medicationSearchQuery,
    setMedicationSearchQuery,
    handleMedicationSearch,
    medicationSearchResults,
    isMedicationSearching,
  } = useMedicationSearch()

  const [showDoctorsList, setShowDoctorsList] = useState(false)
  const [showMedicationsList, setShowMedicationsList] = useState(false)
  const [showDoctorSearch, setShowDoctorSearch] = useState(false)
  const [showMedicationSearch, setShowMedicationSearch] = useState(false)
  const doctorsBoxRef = useRef<HTMLDivElement>(null)
  const medicationsBoxRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const hasDoctors = selectedDoctors.length > 0
  const hasMedications = selectedMedications.length > 0

  // Determine coverage status
  const doctorCoverageStatus = !hasDoctors ? "none" : plan.coversDoctors ? "all" : "none"

  const medicationCoverageStatus = !hasMedications
    ? "none"
    : plan.coversMedications === true
      ? "all"
      : plan.coversMedications === false
        ? "none"
        : "some"

  // Get status color
  const getStatusColor = (status: "all" | "some" | "none", hasItems: boolean) => {
    if (!hasItems) {
      return "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    }

    switch (status) {
      case "all":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
      case "some":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
      case "none":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    }
  }

  // Get status icon
  const getStatusIcon = (status: "all" | "some" | "none", hasItems: boolean) => {
    if (!hasItems) return null

    switch (status) {
      case "all":
        return <Check size={12} className="text-green-600" />
      case "some":
        return <AlertTriangle size={12} className="text-yellow-600" />
      case "none":
        return <X size={12} className="text-red-600" />
      default:
        return null
    }
  }

  // Get button text
  const getDoctorButtonText = () => {
    if (!hasDoctors) return "No Doctors"
    return doctorCoverageStatus === "all"
      ? "All Doctors Covered"
      : doctorCoverageStatus === "some"
        ? "Some Doctors Covered"
        : "No Doctors Covered"
  }

  const getMedicationButtonText = () => {
    if (!hasMedications) return "No Medications"

    switch (medicationCoverageStatus) {
      case "all":
        return "All Meds Covered"
      case "some":
        return "Some Meds Covered"
      case "none":
        return "No Meds Covered"
      default:
        return "No Medications"
    }
  }

  // Handle click outside to close mini-boxes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (doctorsBoxRef.current && !doctorsBoxRef.current.contains(event.target as Node)) {
        setShowDoctorsList(false)
        setShowDoctorSearch(false)
      }

      if (medicationsBoxRef.current && !medicationsBoxRef.current.contains(event.target as Node)) {
        setShowMedicationsList(false)
        setShowMedicationSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle edit button click
  const handleEditClick = () => {
    router.push("/provider-medication-search")
  }

  // Handle doctor search form submission
  const handleDoctorSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleDoctorSearch(e)
  }

  // Handle medication search form submission
  const handleMedicationSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleMedicationSearch(e)
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 mt-2", className)}>
      <div className="relative" ref={doctorsBoxRef}>
        <button
          onClick={() => {
            // Always toggle the doctor list, never navigate away
            setShowDoctorsList(!showDoctorsList)
            setShowMedicationsList(false)
          }}
          className={cn(
            "flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors",
            getStatusColor(doctorCoverageStatus, hasDoctors),
          )}
        >
          <User size={12} />
          <span>{getDoctorButtonText()}</span>
          {getStatusIcon(doctorCoverageStatus, hasDoctors)}
        </button>

        {showDoctorsList && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="p-3 border-b border-gray-100 bg-purple-50/50">
              <h3 className="font-medium text-purple-800 flex items-center">
                <User size={14} className="mr-2 text-purple-600" />
                Your Selected Doctors
              </h3>
            </div>

            {/* Doctor search section */}
            {showDoctorSearch ? (
              <div className="p-3 border-b border-gray-100">
                <form onSubmit={handleDoctorSearchSubmit} className="space-y-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for a doctor..."
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      className="pr-8 text-sm"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      <Search size={16} />
                    </button>
                  </div>

                  {isDoctorSearching ? (
                    <div className="text-center py-2">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                      <span className="ml-2 text-xs text-gray-500">Searching...</span>
                    </div>
                  ) : doctorSearchResults.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto border rounded-md">
                      <ul className="divide-y divide-gray-100">
                        {doctorSearchResults.map((doctor) => (
                          <li
                            key={doctor.npi}
                            className="p-2 hover:bg-gray-50 flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-xs text-gray-500">{doctor.specialities.join(", ")}</p>
                            </div>
                            <button
                              onClick={() => handleAddDoctor(doctor)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Add doctor"
                            >
                              <Plus size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : doctorSearchQuery.length > 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No doctors found</p>
                  ) : null}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDoctorSearch(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="text-xs">
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-3 border-b border-gray-100">
                <Button
                  onClick={() => setShowDoctorSearch(true)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs flex items-center justify-center"
                >
                  <Plus size={12} className="mr-1" />
                  Add Doctor
                </Button>
              </div>
            )}

            {/* Selected doctors list */}
            <div className="max-h-60 overflow-y-auto">
              {selectedDoctors.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {selectedDoctors.map((doctor) => (
                    <li key={doctor.npi} className="p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="w-1 h-10 bg-purple-400 rounded-full mr-2"></div>
                          <div>
                            <p className="font-medium text-gray-800">{doctor.name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialities.join(", ")}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveDoctor(doctor.npi)}
                          className="text-gray-400 hover:text-red-500"
                          title="Remove doctor"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <p>No doctors selected</p>
                  <p className="text-xs mt-1">Click "Add Doctor" to search and add doctors</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                {doctorCoverageStatus === "all" ? (
                  <Check size={14} className="text-green-600 mr-1" />
                ) : (
                  <X size={14} className="text-red-600 mr-1" />
                )}
                <span className="text-sm">
                  {doctorCoverageStatus === "all" ? "All doctors covered" : "No doctors covered"}
                </span>
              </div>
              <button
                onClick={handleEditClick}
                className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
              >
                <Edit size={12} className="mr-1" />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={medicationsBoxRef}>
        <button
          onClick={() => {
            // Always toggle the medication list, never navigate away
            setShowMedicationsList(!showMedicationsList)
            setShowDoctorsList(false)
          }}
          className={cn(
            "flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors",
            getStatusColor(medicationCoverageStatus, hasMedications),
          )}
        >
          <Pill size={12} />
          <span>{getMedicationButtonText()}</span>
          {getStatusIcon(medicationCoverageStatus, hasMedications)}
        </button>

        {showMedicationsList && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="p-3 border-b border-gray-100 bg-purple-50/50">
              <h3 className="font-medium text-purple-800 flex items-center">
                <Pill size={14} className="mr-2 text-purple-600" />
                Your Selected Medications
              </h3>
            </div>

            {/* Medication search section */}
            {showMedicationSearch ? (
              <div className="p-3 border-b border-gray-100">
                <form onSubmit={handleMedicationSearchSubmit} className="space-y-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for a medication..."
                      value={medicationSearchQuery}
                      onChange={(e) => setMedicationSearchQuery(e.target.value)}
                      className="pr-8 text-sm"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      <Search size={16} />
                    </button>
                  </div>

                  {isMedicationSearching ? (
                    <div className="text-center py-2">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                      <span className="ml-2 text-xs text-gray-500">Searching...</span>
                    </div>
                  ) : medicationSearchResults.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto border rounded-md">
                      <ul className="divide-y divide-gray-100">
                        {medicationSearchResults.map((medication) => (
                          <li
                            key={medication.drugbank_pcid}
                            className="p-2 hover:bg-gray-50 flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium">{medication.name}</p>
                              <p className="text-xs text-gray-500">{medication.hit}</p>
                            </div>
                            <button
                              onClick={() => {
                                // Create the medication object in the format expected by handleAddMedication
                                const medicationToAdd = {
                                  rxcui: medication.hit, // Use hit as the unique identifier
                                  name: medication.name,
                                  full_name: medication.hit,
                                  rxnorm_dose_form: medication.display_name,
                                  route: "Oral",
                                }
                                handleAddMedication(medicationToAdd)
                              }}
                              className="text-purple-600 hover:text-purple-800"
                              title="Add medication"
                            >
                              <Plus size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : medicationSearchQuery.length > 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No medications found</p>
                  ) : null}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMedicationSearch(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="text-xs">
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-3 border-b border-gray-100">
                <Button
                  onClick={() => setShowMedicationSearch(true)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs flex items-center justify-center"
                >
                  <Plus size={12} className="mr-1" />
                  Add Medication
                </Button>
              </div>
            )}

            {/* Selected medications list */}
            <div className="max-h-60 overflow-y-auto">
              {selectedMedications.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {selectedMedications.map((medication) => (
                    <li key={medication.rxcui} className="p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="w-1 h-10 bg-purple-400 rounded-full mr-2"></div>
                          <div>
                            <p className="font-medium text-gray-800">{medication.name}</p>
                            <p className="text-xs text-gray-500">
                              {medication.rxnorm_dose_form || medication.full_name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMedication(medication.rxcui)}
                          className="text-gray-400 hover:text-red-500"
                          title="Remove medication"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <p>No medications selected</p>
                  <p className="text-xs mt-1">Click "Add Medication" to search and add medications</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                {medicationCoverageStatus === "all" ? (
                  <Check size={14} className="text-green-600 mr-1" />
                ) : (
                  <X size={14} className="text-red-600 mr-1" />
                )}
                <span className="text-sm">
                  {medicationCoverageStatus === "all"
                    ? "All medications covered"
                    : medicationCoverageStatus === "some"
                      ? "Some medications covered"
                      : "No medications covered"}
                </span>
              </div>
              <button
                onClick={handleEditClick}
                className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
              >
                <Edit size={12} className="mr-1" />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
