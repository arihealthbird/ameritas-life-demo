"use client"

import { useEffect } from "react"
import { Search, User, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDoctorSearch } from "@/hooks/useDoctorSearch"
import type { Doctor } from "@/types/doctor"

interface DoctorManagementProps {
  onClose: () => void
  onFilterUpdate?: (doctors: Doctor[]) => void
}

export default function DoctorManagement({ onClose, onFilterUpdate }: DoctorManagementProps) {
  const {
    doctorSearchQuery,
    setDoctorSearchQuery,
    isDoctorSearching,
    doctorSearchResults,
    selectedDoctors,
    handleDoctorSearch,
    handleAddDoctor,
    handleRemoveDoctor,
  } = useDoctorSearch()

  // Update parent component when selected doctors change
  useEffect(() => {
    if (onFilterUpdate) {
      onFilterUpdate(selectedDoctors)
    }
  }, [selectedDoctors, onFilterUpdate])

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Search Input */}
        <form onSubmit={handleDoctorSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search for doctors by name or specialty..."
            className="pl-10 pr-4 py-2 w-full"
            value={doctorSearchQuery}
            onChange={(e) => setDoctorSearchQuery(e.target.value)}
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
        {isDoctorSearching ? (
          <div className="p-4 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Searching for doctors...</p>
          </div>
        ) : doctorSearchResults.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium">Search Results</h3>
            </div>
            <ScrollArea className="h-48">
              <ul className="divide-y">
                {doctorSearchResults.map((doctor) => (
                  <li key={doctor.npi} className="p-3 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <User size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddDoctor(doctor)}
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
        ) : doctorSearchQuery ? (
          <div className="text-center p-4 border rounded-lg">
            <p className="text-gray-600">No doctors found. Try a different search term.</p>
          </div>
        ) : null}

        {/* Selected Doctors */}
        <div>
          <h3 className="font-medium mb-3">Selected Doctors ({selectedDoctors.length})</h3>
          {selectedDoctors.length === 0 ? (
            <div className="text-center p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600">No doctors selected yet.</p>
              <p className="text-sm text-gray-500 mt-1">Search and add doctors to see them here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {selectedDoctors.map((doctor) => (
                <li
                  key={doctor.npi}
                  className="p-3 flex justify-between items-center border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <User size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-600">
                        {doctor.specialty} • {doctor.network}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDoctor(doctor.npi)}
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
