"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface DoctorFormActionsProps {
  isSubmitting: boolean
  handleSkip: () => void
  activeTab: "doctor" | "medication"
  onSwitchTab: () => void
}

export default function DoctorFormActions({
  isSubmitting,
  handleSkip,
  activeTab,
  onSwitchTab,
}: DoctorFormActionsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {activeTab === "doctor" ? (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault() // Prevent any default form behavior
            onSwitchTab()
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
        >
          Find Medications
          <ArrowRight className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
        >
          {isSubmitting ? "Processing..." : "Continue"}
          <ArrowRight className="h-5 w-5" />
        </Button>
      )}

      <Button type="button" variant="ghost" onClick={handleSkip} disabled={isSubmitting}>
        Skip this step
      </Button>
    </div>
  )
}
