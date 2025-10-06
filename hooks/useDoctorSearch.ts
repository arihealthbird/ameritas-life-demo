"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { Doctor } from "@/types/doctor"

// Create a custom event for doctor changes
const DOCTOR_CHANGE_EVENT = "doctorChange"

// Create a singleton instance to ensure all components use the same data
let globalSelectedDoctors: Doctor[] = []

// Try to load from sessionStorage on module initialization
try {
  const storedDoctors = typeof window !== "undefined" ? sessionStorage.getItem("selectedDoctors") : null
  if (storedDoctors) {
    globalSelectedDoctors = JSON.parse(storedDoctors)
  }
} catch (error) {
  console.error("Error loading doctors from sessionStorage:", error)
}

export function useDoctorSearch() {
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("")
  const [isDoctorSearching, setIsDoctorSearching] = useState(false)
  const [doctorSearchResults, setDoctorSearchResults] = useState<Doctor[]>([])
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>(globalSelectedDoctors)

  // Update global state and sessionStorage when selectedDoctors changes
  useEffect(() => {
    // Only update if the arrays are different
    if (JSON.stringify(selectedDoctors) !== JSON.stringify(globalSelectedDoctors)) {
      globalSelectedDoctors = [...selectedDoctors]

      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedDoctors", JSON.stringify(selectedDoctors))
      }

      // Dispatch a custom event to notify other components
      if (typeof window !== "undefined") {
        const event = new CustomEvent(DOCTOR_CHANGE_EVENT, { detail: selectedDoctors })
        window.dispatchEvent(event)
      }
    }
  }, [selectedDoctors])

  // Listen for doctor changes from other components
  useEffect(() => {
    const handleDoctorChange = (event: CustomEvent<Doctor[]>) => {
      // Only update if the arrays are different
      if (JSON.stringify(event.detail) !== JSON.stringify(selectedDoctors)) {
        setSelectedDoctors(event.detail)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener(DOCTOR_CHANGE_EVENT, handleDoctorChange as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(DOCTOR_CHANGE_EVENT, handleDoctorChange as EventListener)
      }
    }
  }, [selectedDoctors])

  // Sync with global state on mount and when global state changes
  useEffect(() => {
    const syncWithGlobalState = () => {
      // Only update if the arrays are different
      if (JSON.stringify(globalSelectedDoctors) !== JSON.stringify(selectedDoctors)) {
        setSelectedDoctors([...globalSelectedDoctors])
      }
    }

    // Initial sync
    syncWithGlobalState()

    // Set up interval to check for changes
    const intervalId = setInterval(syncWithGlobalState, 500)

    return () => clearInterval(intervalId)
  }, [selectedDoctors])

  const handleDoctorSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!doctorSearchQuery.trim()) return

      setIsDoctorSearching(true)

      // Mock API call - in a real app, this would be an actual API call
      setTimeout(() => {
        // Always include John Doe in the results
        const johnDoe: Doctor = {
          npi: "1122334455",
          name: "Dr. John Doe",
          specialty: "Family Medicine",
          address: "123 Health Street, Miami, FL 33136",
          phone: "(305) 555-1212",
          network: "In-Network",
          specialities: ["Family Medicine", "Primary Care"],
          zipcode: "33136",
        }

        // Mock search results
        let mockResults: Doctor[] = [
          {
            npi: "1234567890",
            name: "Dr. Jane Smith",
            specialty: "Cardiology",
            address: "123 Medical Center Dr, Miami, FL 33136",
            phone: "(305) 555-1234",
            network: "In-Network",
            specialities: ["Cardiology"],
            zipcode: "33136",
          },
          {
            npi: "0987654321",
            name: "Dr. John Johnson",
            specialty: "Family Medicine",
            address: "456 Health Blvd, Miami, FL 33137",
            phone: "(305) 555-5678",
            network: "In-Network",
            specialities: ["Family Medicine"],
            zipcode: "33137",
          },
          {
            npi: "5566778899",
            name: "Dr. Maria Rodriguez",
            specialty: "Pediatrics",
            address: "789 Children's Way, Miami, FL 33138",
            phone: "(305) 555-9012",
            network: "Out-of-Network",
            specialities: ["Pediatrics"],
            zipcode: "33138",
          },
        ]

        // Add John Doe if not already in results and the search query matches
        const lowerQuery = doctorSearchQuery.toLowerCase()
        if (
          lowerQuery === "" ||
          "john".includes(lowerQuery) ||
          "doe".includes(lowerQuery) ||
          "john doe".includes(lowerQuery) ||
          "family".includes(lowerQuery) ||
          "medicine".includes(lowerQuery) ||
          "primary".includes(lowerQuery)
        ) {
          // Check if John Doe is already in the results
          if (!mockResults.some((doctor) => doctor.npi === johnDoe.npi)) {
            mockResults = [johnDoe, ...mockResults]
          }
        }

        setDoctorSearchResults(mockResults)
        setIsDoctorSearching(false)
      }, 1000)
    },
    [doctorSearchQuery],
  )

  const handleAddDoctor = useCallback(
    (doctor: Doctor) => {
      if (!selectedDoctors.some((d) => d.npi === doctor.npi)) {
        const updatedDoctors = [...selectedDoctors, doctor]
        setSelectedDoctors(updatedDoctors)

        // Update global state immediately
        globalSelectedDoctors = updatedDoctors

        // Save to sessionStorage immediately
        if (typeof window !== "undefined") {
          sessionStorage.setItem("selectedDoctors", JSON.stringify(updatedDoctors))

          // Dispatch event immediately
          const event = new CustomEvent(DOCTOR_CHANGE_EVENT, { detail: updatedDoctors })
          window.dispatchEvent(event)
        }
      }
    },
    [selectedDoctors],
  )

  const handleRemoveDoctor = useCallback(
    (npi: string) => {
      const updatedDoctors = selectedDoctors.filter((doctor) => doctor.npi !== npi)
      setSelectedDoctors(updatedDoctors)

      // Update global state immediately
      globalSelectedDoctors = updatedDoctors

      // Save to sessionStorage immediately
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedDoctors", JSON.stringify(updatedDoctors))

        // Dispatch event immediately
        const event = new CustomEvent(DOCTOR_CHANGE_EVENT, { detail: updatedDoctors })
        window.dispatchEvent(event)
      }
    },
    [selectedDoctors],
  )

  return {
    doctorSearchQuery,
    setDoctorSearchQuery,
    isDoctorSearching,
    doctorSearchResults,
    selectedDoctors,
    handleDoctorSearch,
    handleAddDoctor,
    handleRemoveDoctor,
  }
}
