"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { RxDrugDetail } from "@/types/medication"

// Create a custom event for medication changes
const MEDICATION_CHANGE_EVENT = "medicationChange"

// Define the IDrugInfo interface
interface IDrugInfo {
  drugbank_pcid: string
  name: string
  hit: string
  display_name: string
  type: string
}

// Create a singleton instance to ensure all components use the same data
let globalSelectedMedications: RxDrugDetail[] = []

// Try to load from sessionStorage on module initialization
try {
  const storedMedications = typeof window !== "undefined" ? sessionStorage.getItem("selectedMedications") : null
  if (storedMedications) {
    globalSelectedMedications = JSON.parse(storedMedications)
  }
} catch (error) {
  console.error("Error loading medications from sessionStorage:", error)
}

export function useMedicationSearch() {
  const [medicationSearchQuery, setMedicationSearchQuery] = useState("")
  const [isMedicationSearching, setIsMedicationSearching] = useState(false)
  const [medicationSearchResults, setMedicationSearchResults] = useState<IDrugInfo[]>([])
  const [selectedMedications, setSelectedMedications] = useState<RxDrugDetail[]>(globalSelectedMedications)

  // Update global state and sessionStorage when selectedMedications changes
  useEffect(() => {
    // Only update if the arrays are different
    if (JSON.stringify(selectedMedications) !== JSON.stringify(globalSelectedMedications)) {
      globalSelectedMedications = [...selectedMedications]

      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedMedications", JSON.stringify(selectedMedications))
      }

      // Dispatch a custom event to notify other components
      if (typeof window !== "undefined") {
        const event = new CustomEvent(MEDICATION_CHANGE_EVENT, { detail: selectedMedications })
        window.dispatchEvent(event)
      }
    }
  }, [selectedMedications])

  // Listen for medication changes from other components
  useEffect(() => {
    const handleMedicationChange = (event: CustomEvent<RxDrugDetail[]>) => {
      // Only update if the arrays are different
      if (JSON.stringify(event.detail) !== JSON.stringify(selectedMedications)) {
        setSelectedMedications(event.detail)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener(MEDICATION_CHANGE_EVENT, handleMedicationChange as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(MEDICATION_CHANGE_EVENT, handleMedicationChange as EventListener)
      }
    }
  }, [selectedMedications])

  // Sync with global state on mount and when global state changes
  useEffect(() => {
    const syncWithGlobalState = () => {
      // Only update if the arrays are different
      if (JSON.stringify(globalSelectedMedications) !== JSON.stringify(selectedMedications)) {
        setSelectedMedications([...globalSelectedMedications])
      }
    }

    // Initial sync
    syncWithGlobalState()

    // Set up interval to check for changes
    const intervalId = setInterval(syncWithGlobalState, 500)

    return () => clearInterval(intervalId)
  }, [selectedMedications])

  const handleMedicationSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!medicationSearchQuery.trim()) return

      setIsMedicationSearching(true)

      // Mock API call - in a real app, this would be an actual API call
      setTimeout(() => {
        // Always include Lipitor in the results
        const lipitor: IDrugInfo = {
          drugbank_pcid: "DB01076",
          name: "Lipitor",
          hit: "Lipitor (Atorvastatin) 20mg Tablet",
          display_name: "20mg Tablet",
          type: "Prescription",
        }

        // Mock search results
        let mockResults = [
          {
            drugbank_pcid: "DB00622",
            name: "Lisinopril",
            hit: "Lisinopril 10mg Tablet",
            display_name: "10mg Tablet",
            type: "Prescription",
          },
          {
            drugbank_pcid: "DB01095",
            name: "Metformin",
            hit: "Metformin 500mg Tablet",
            display_name: "500mg Tablet",
            type: "Prescription",
          },
          {
            drugbank_pcid: "DB00571",
            name: "Amoxicillin",
            hit: "Amoxicillin 500mg Capsule",
            display_name: "500mg Capsule",
            type: "Prescription",
          },
        ]

        // Add Lipitor if not already in results and the search query matches
        const lowerQuery = medicationSearchQuery.toLowerCase()
        if (
          lowerQuery === "" ||
          "lipitor".includes(lowerQuery) ||
          "atorvastatin".includes(lowerQuery) ||
          "statin".includes(lowerQuery) ||
          "cholesterol".includes(lowerQuery)
        ) {
          // Check if Lipitor is already in the results
          if (!mockResults.some((med) => med.drugbank_pcid === lipitor.drugbank_pcid)) {
            mockResults = [lipitor, ...mockResults]
          }
        }

        setMedicationSearchResults(mockResults)
        setIsMedicationSearching(false)
      }, 1000)
    },
    [medicationSearchQuery],
  )

  const handleAddMedication = useCallback(
    (medication: RxDrugDetail) => {
      if (!selectedMedications.some((m) => m.rxcui === medication.rxcui)) {
        const updatedMedications = [...selectedMedications, medication]
        setSelectedMedications(updatedMedications)

        // Update global state immediately
        globalSelectedMedications = updatedMedications

        // Save to sessionStorage immediately
        if (typeof window !== "undefined") {
          sessionStorage.setItem("selectedMedications", JSON.stringify(updatedMedications))

          // Dispatch event immediately
          const event = new CustomEvent(MEDICATION_CHANGE_EVENT, { detail: updatedMedications })
          window.dispatchEvent(event)
        }
      }
    },
    [selectedMedications],
  )

  const handleRemoveMedication = useCallback(
    (rxcui: string) => {
      const updatedMedications = selectedMedications.filter((medication) => medication.rxcui !== rxcui)
      setSelectedMedications(updatedMedications)

      // Update global state immediately
      globalSelectedMedications = updatedMedications

      // Save to sessionStorage immediately
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedMedications", JSON.stringify(updatedMedications))

        // Dispatch event immediately
        const event = new CustomEvent(MEDICATION_CHANGE_EVENT, { detail: updatedMedications })
        window.dispatchEvent(event)
      }
    },
    [selectedMedications],
  )

  return {
    medicationSearchQuery,
    setMedicationSearchQuery,
    isMedicationSearching,
    medicationSearchResults,
    selectedMedications,
    handleAddMedication,
    handleRemoveMedication,
    handleMedicationSearch,
  }
}
