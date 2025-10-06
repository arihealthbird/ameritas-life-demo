"use client"

import { useEffect } from "react"
import { Search, Pill, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMedicationSearch } from "@/hooks/useMedicationSearch"
import type { RxDrugDetail } from "@/types/medication"

interface MedicationManagementProps {
  onClose: () => void
  onFilterUpdate?: (medications: RxDrugDetail[]) => void
}

export default function MedicationManagement({ onClose, onFilterUpdate }: MedicationManagementProps) {
  const {
    medicationSearchQuery,
    setMedicationSearchQuery,
    isMedicationSearching,
    medicationSearchResults,
    selectedMedications,
    handleMedicationSearch,
    handleAddMedication,
    handleRemoveMedication,
  } = useMedicationSearch()

  // Update parent component when selected medications change
  useEffect(() => {
    if (onFilterUpdate) {
      onFilterUpdate(selectedMedications)
    }
  }, [selectedMedications, onFilterUpdate])

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Search Input */}
        <form onSubmit={handleMedicationSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search for medications by name..."
            className="pl-10 pr-4 py-2 w-full"
            value={medicationSearchQuery}
            onChange={(e) => setMedicationSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="default"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700"
          >
            Search
          </Button>
        </form>

        {/* Search Results */}
        {isMedicationSearching ? (
          <div className="p-4 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Searching for medications...</p>
          </div>
        ) : medicationSearchResults.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium">Search Results</h3>
            </div>
            <ScrollArea className="h-48">
              <ul className="divide-y">
                {medicationSearchResults.map((medication) => (
                  <li key={medication.rxcui} className="p-3 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Pill size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.display_name}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddMedication(medication)}
                      className="text-purple-600 hover:bg-purple-50"
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        ) : medicationSearchQuery ? (
          <div className="text-center p-4 border rounded-lg">
            <p className="text-gray-600">No medications found. Try a different search term.</p>
          </div>
        ) : null}

        {/* Selected Medications */}
        <div>
          <h3 className="font-medium mb-3">Selected Medications ({selectedMedications.length})</h3>
          {selectedMedications.length === 0 ? (
            <div className="text-center p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600">No medications selected yet.</p>
              <p className="text-sm text-gray-500 mt-1">Search and add medications to see them here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {selectedMedications.map((medication) => (
                <li
                  key={medication.rxcui}
                  className="p-3 flex justify-between items-center border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Pill size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-gray-600">{medication.full_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedication(medication.rxcui)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <X size={16} className="mr-1" />
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
