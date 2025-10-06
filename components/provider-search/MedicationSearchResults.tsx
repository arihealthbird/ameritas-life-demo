"use client"

import type React from "react"
import { Plus, Pill, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { IDrugInfo, RxDrugDetail } from "@/types/medication"
import { useState } from "react"

// Synthetic medication data
const syntheticMedications = [
  {
    drugbank_pcid: "DB01076",
    name: "Lipitor",
    hit: "Atorvastatin 10 MG Oral Tablet",
    display_name: "Atorvastatin",
    type: "Prescription",
    strength: "10 MG",
    formulation: "Oral Tablet",
    brand_name: "Lipitor",
  },
  {
    drugbank_pcid: "DB01060",
    name: "Amoxicillin",
    hit: "Amoxicillin 775 MG Oral Tablet",
    display_name: "Amoxicillin",
    type: "Prescription",
    strength: "775 MG",
    formulation: "Oral Tablet",
    brand_name: "Augmentin",
  },
]

interface MedicationSearchResultsProps {
  isMedicationSearching: boolean
  medicationSearchQuery: string
  medicationSearchResults: IDrugInfo[]
  handleAddMedication: (medication: RxDrugDetail) => void
}

const MedicationSearchResults: React.FC<MedicationSearchResultsProps> = ({
  isMedicationSearching,
  medicationSearchQuery,
  medicationSearchResults,
  handleAddMedication,
}) => {
  const [selectedMedications, setSelectedMedications] = useState<Set<string>>(new Set())

  // Mock function to simulate fetching drug details
  const handleSelectMedication = (medication: any) => {
    const isSelected = selectedMedications.has(medication.drugbank_pcid)
    if (!isSelected) {
      setSelectedMedications((prev) => new Set(prev).add(medication.drugbank_pcid))

      const mockDrugDetail: RxDrugDetail = {
        rxcui: medication.drugbank_pcid,
        name: medication.name,
        full_name: medication.hit,
        rxnorm_dose_form: medication.formulation || "Tablet",
        route: "Oral",
      }

      handleAddMedication(mockDrugDetail)
    }
  }

  // Show nothing if user hasn't started typing yet
  if (!medicationSearchQuery || medicationSearchQuery.trim().length <= 1) {
    return null
  }

  // Show loading state while searching
  if (isMedicationSearching) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="p-4 flex justify-center items-center space-x-2">
          <div className="w-5 h-5 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
          <span className="text-gray-600">Searching for medications...</span>
        </div>
      </div>
    )
  }

  // Check for synthetic medication matches
  const searchLower = medicationSearchQuery.toLowerCase().trim()
  const matchedMedications = syntheticMedications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchLower) ||
      medication.display_name.toLowerCase().includes(searchLower) ||
      searchLower.includes(medication.name.toLowerCase()) ||
      searchLower.includes(medication.display_name.toLowerCase()),
  )

  // Show synthetic results if we have matches
  if (matchedMedications.length > 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
        <ScrollArea className="max-h-[250px] overflow-y-auto">
          <ul className="divide-y divide-gray-100">
            {matchedMedications.map((medication) => {
              const isSelected = selectedMedications.has(medication.drugbank_pcid)
              return (
                <li
                  key={medication.drugbank_pcid}
                  className="group hover:bg-purple-600/5 transition-colors duration-150"
                >
                  <div className="p-6 flex justify-between items-center bg-gradient-to-r from-white via-purple-50/30 to-pink-50/20 hover:from-purple-50/40 hover:via-purple-100/30 hover:to-pink-50/30 transition-all duration-300 border-l-2 border-transparent hover:border-l-purple-400 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-pink-500/15 p-3 rounded-2xl shadow-lg ring-1 ring-purple-200/50 group-hover:ring-purple-300/70 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                        <Pill
                          size={20}
                          className="text-purple-700 group-hover:text-purple-800 transition-colors duration-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 group-hover:text-purple-800 transition-colors duration-300 text-lg tracking-tight">
                          {medication.name}
                        </p>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
                          {medication.display_name} • {medication.strength} • {medication.formulation} •{" "}
                          {medication.brand_name}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectMedication(medication)}
                      disabled={isSelected}
                      className={cn(
                        "p-3 rounded-2xl relative z-10 transition-all duration-300 transform shadow-lg ring-1",
                        isSelected
                          ? "bg-gradient-to-br from-green-100/80 to-emerald-100/60 text-green-700 ring-green-200/50"
                          : "bg-gradient-to-br from-purple-100/80 to-pink-100/60 text-purple-700 ring-purple-200/50 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:shadow-xl hover:ring-purple-300/70 hover:-translate-y-0.5 active:scale-95 active:translate-y-0",
                        isSelected
                          ? "opacity-100 scale-100"
                          : "opacity-70 group-hover:opacity-100 scale-95 group-hover:scale-100",
                      )}
                      aria-label={isSelected ? `${medication.name} selected` : `Add ${medication.name}`}
                    >
                      {isSelected ? (
                        <Check size={20} className="transition-transform duration-300" />
                      ) : (
                        <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
                      )}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </div>
    )
  }

  // Show no results message for non-matching searches
  if (medicationSearchQuery.trim().length > 1) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Search size={24} className="text-gray-400 mb-2" />
          <p className="text-gray-700 font-medium">No medications found</p>
          <p className="text-gray-500 text-sm">Try a different search term</p>
        </div>
      </div>
    )
  }

  // Show results (fallback for original search results)
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
      <ScrollArea className="max-h-[250px] overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {medicationSearchResults.map((medication) => {
            const isSelected = selectedMedications.has(medication.drugbank_pcid)
            return (
              <li key={medication.drugbank_pcid} className="group hover:bg-purple-600/5 transition-colors duration-150">
                <div className="p-6 flex justify-between items-center bg-gradient-to-r from-white via-purple-50/30 to-pink-50/20 hover:from-purple-50/40 hover:via-purple-100/30 hover:to-pink-50/30 transition-all duration-300 border-l-2 border-transparent hover:border-l-purple-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-pink-500/15 p-3 rounded-2xl shadow-lg ring-1 ring-purple-200/50 group-hover:ring-purple-300/70 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      <Pill
                        size={20}
                        className="text-purple-700 group-hover:text-purple-800 transition-colors duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 group-hover:text-purple-800 transition-colors duration-300 text-lg tracking-tight">
                        {medication.name}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
                        {medication.hit} • {medication.drugbank_pcid}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectMedication(medication)}
                    disabled={isSelected}
                    className={cn(
                      "p-3 rounded-2xl relative z-10 transition-all duration-300 transform shadow-lg ring-1",
                      isSelected
                        ? "bg-gradient-to-br from-green-100/80 to-emerald-100/60 text-green-700 ring-green-200/50"
                        : "bg-gradient-to-br from-purple-100/80 to-pink-100/60 text-purple-700 ring-purple-200/50 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:shadow-xl hover:ring-purple-300/70 hover:-translate-y-0.5 active:scale-95 active:translate-y-0",
                      isSelected
                        ? "opacity-100 scale-100"
                        : "opacity-70 group-hover:opacity-100 scale-95 group-hover:scale-100",
                    )}
                    aria-label={isSelected ? `${medication.name} selected` : `Add ${medication.name}`}
                  >
                    {isSelected ? (
                      <Check size={20} className="transition-transform duration-300" />
                    ) : (
                      <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
                    )}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}

export default MedicationSearchResults
