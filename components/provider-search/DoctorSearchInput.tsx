"use client"

import type React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface DoctorSearchInputProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: (e: React.FormEvent) => void
  isSearching: boolean
}

const DoctorSearchInput: React.FC<DoctorSearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length > 1) {
      handleSearch(e)
    }
  }

  return (
    <div className="mb-6">
      <label htmlFor="doctorSearch" className="block text-sm font-medium text-gray-800 mb-3">
        Search for your doctor
      </label>

      <div className="relative transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-600/30 rounded-lg">
        {/* Changed from form to div to avoid nested forms */}
        <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex-shrink-0 p-3 text-gray-400">
            <Search size={20} className="text-purple-600/70" />
          </div>

          <input
            type="text"
            id="doctorSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "flex-1 bg-transparent border-0 focus:outline-none focus:ring-0",
              "py-3 text-gray-800 placeholder:text-gray-400",
            )}
            placeholder="Enter doctor name here"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (searchQuery.trim().length > 1) {
                  handleSearch(e as any)
                }
              }
            }}
          />

          <button
            type="button" // Changed from submit to button
            onClick={handleSubmit}
            className={cn(
              "m-1 p-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500",
              "hover:opacity-90 transition-all duration-300 focus:outline-none",
              isSearching || searchQuery.trim().length <= 1 ? "opacity-70" : "",
            )}
            aria-label="Search for doctor"
            disabled={isSearching || searchQuery.trim().length <= 1}
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={18} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorSearchInput
