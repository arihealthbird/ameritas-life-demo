"use client"
import { cn } from "@/lib/utils"
// import { useDoctorSearch } from "@/hooks/useDoctorSearch"
// import { useMedicationSearch } from "@/hooks/useMedicationSearch"

interface CoverageIndicatorsProps {
  coversDoctors: boolean
  coversMedications: boolean
  className?: string
}

export default function CoverageIndicators({ coversDoctors, coversMedications, className }: CoverageIndicatorsProps) {
  // This component is now deprecated in favor of CoverageStatusButtons
  // We're keeping it for backward compatibility with other parts of the app
  // const { selectedDoctors } = useDoctorSearch()
  // const { selectedMedications } = useMedicationSearch()

  // const hasDoctors = selectedDoctors.length > 0
  // const hasMedications = selectedMedications.length > 0

  // Don't show indicators if we have doctors or medications selected
  // as we'll show the CoverageStatusButtons instead
  // if (hasDoctors || hasMedications) {
  //   return null
  // }

  return (
    <div className={cn("flex items-center gap-4 mt-3", className)}>
      <div className="flex items-center gap-1.5">
        <div className={cn("w-3 h-3 rounded-full", coversDoctors ? "bg-green-500" : "bg-healthbird-gray-300")}></div>
        <span className="text-xs text-healthbird-gray-500">{coversDoctors ? "Covers" : "No"} Doctors</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className={cn("w-3 h-3 rounded-full", coversMedications ? "bg-green-500" : "bg-healthbird-gray-300")}
        ></div>
        <span className="text-xs text-healthbird-gray-500">{coversMedications ? "Covers" : "No"} Medications</span>
      </div>
    </div>
  )
}
