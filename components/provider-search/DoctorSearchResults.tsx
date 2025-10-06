"use client"

import type React from "react"
import { Plus, User, Search, Check } from "lucide-react"
import type { Doctor } from "@/types/doctor"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

// Synthetic doctor data
const syntheticDoctors = [
  {
    npi: "1234567890",
    name: "Jonathan Truong MD",
    specialities: ["Family Medicine"],
    zipcode: "90210",
    distance: "2.3 miles",
  },
  {
    npi: "0987654321",
    name: "Kiet Abascal DDS",
    specialities: ["Dentistry"],
    zipcode: "90211",
    distance: "3.1 miles",
  },
]

interface DoctorSearchResultsProps {
  isSearching: boolean
  searchQuery: string
  searchResults: Doctor[]
  handleAddDoctor: (doctor: Doctor) => void
}

const DoctorSearchResults: React.FC<DoctorSearchResultsProps> = ({
  isSearching,
  searchQuery,
  searchResults,
  handleAddDoctor,
}) => {
  const [selectedDoctors, setSelectedDoctors] = useState<Set<string>>(new Set())

  const handleDoctorClick = (doctor: any) => {
    const isSelected = selectedDoctors.has(doctor.npi)
    if (!isSelected) {
      setSelectedDoctors((prev) => new Set(prev).add(doctor.npi))
      handleAddDoctor(doctor)
    }
  }

  // Show nothing if user hasn't started typing yet
  if (!searchQuery || searchQuery.trim().length <= 1) {
    return null
  }

  // Show loading state while searching
  if (isSearching) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="p-4 flex justify-center items-center space-x-2">
          <div className="w-5 h-5 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
          <span className="text-gray-600">Searching for doctors...</span>
        </div>
      </div>
    )
  }

  // Check for synthetic doctor matches
  const searchLower = searchQuery.toLowerCase().trim()
  const matchedDoctors = syntheticDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchLower) ||
      searchLower.includes(doctor.name.toLowerCase().split(" ")[0]) || // First name
      searchLower.includes(doctor.name.toLowerCase().split(" ")[1]), // Last name
  )

  // Show synthetic results if we have matches
  if (matchedDoctors.length > 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
        <ScrollArea className="max-h-[250px] overflow-y-auto">
          <ul className="divide-y divide-gray-100">
            {matchedDoctors.map((doctor) => {
              const isSelected = selectedDoctors.has(doctor.npi)
              return (
                <li key={doctor.npi} className="group hover:bg-purple-600/5 transition-colors duration-150">
                  <div className="p-6 flex justify-between items-center bg-gradient-to-r from-white via-purple-50/30 to-pink-50/20 hover:from-purple-50/40 hover:via-purple-100/30 hover:to-pink-50/30 transition-all duration-300 border-l-2 border-transparent hover:border-l-purple-400 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-pink-500/15 p-3 rounded-2xl shadow-lg ring-1 ring-purple-200/50 group-hover:ring-purple-300/70 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                        <User
                          size={20}
                          className="text-purple-700 group-hover:text-purple-800 transition-colors duration-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 group-hover:text-purple-800 transition-colors duration-300 text-lg tracking-tight">
                          {doctor.name}
                        </p>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
                          {doctor.specialities.join(", ")} • {doctor.zipcode} • {doctor.distance}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDoctorClick(doctor)}
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
                      aria-label={isSelected ? `${doctor.name} selected` : `Add ${doctor.name}`}
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
  if (searchQuery.trim().length > 1) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Search size={24} className="text-gray-400 mb-2" />
          <p className="text-gray-700 font-medium">No doctors found</p>
          <p className="text-gray-500 text-sm">Try a different search term</p>
        </div>
      </div>
    )
  }

  // Show results
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
      <div className="bg-gradient-to-r from-purple-600/5 to-pink-500/5 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-800 flex items-center">
          <Search size={16} className="text-purple-600 mr-2" />
          Doctor Results
        </h3>
        <span className="text-sm text-gray-500">{searchResults.length} found</span>
      </div>
      <ScrollArea className="max-h-[250px] overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {searchResults.map((doctor) => {
            const isSelected = selectedDoctors.has(doctor.npi)
            return (
              <li
                key={doctor.npi}
                className={`group hover:bg-purple-600/5 transition-colors duration-150 ${
                  doctor.name === "Dr. John Doe" ? "border-l-4 border-purple-600" : ""
                }`}
              >
                <div className="p-6 flex justify-between items-center bg-gradient-to-r from-white via-purple-50/30 to-pink-50/20 hover:from-purple-50/40 hover:via-purple-100/30 hover:to-pink-50/30 transition-all duration-300 border-l-2 border-transparent hover:border-l-purple-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-pink-500/15 p-3 rounded-2xl shadow-lg ring-1 ring-purple-200/50 group-hover:ring-purple-300/70 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      <User
                        size={20}
                        className="text-purple-700 group-hover:text-purple-800 transition-colors duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 group-hover:text-purple-800 transition-colors duration-300 text-lg tracking-tight">
                        {doctor.name}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
                        {doctor.specialities.length > 0
                          ? doctor.specialities.map((speciality, index) => (
                              <span key={index}>
                                {speciality}
                                {index < doctor.specialities.length - 1 ? ", " : ""}
                              </span>
                            ))
                          : "Unknown"}{" "}
                        • {doctor.zipcode}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDoctorClick(doctor)}
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
                    aria-label={isSelected ? `${doctor.name} selected` : `Add ${doctor.name}`}
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

export default DoctorSearchResults
