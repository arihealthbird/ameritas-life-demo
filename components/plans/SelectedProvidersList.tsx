"use client"

import { User, Pill, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Doctor } from "@/types/doctor"
import type { RxDrugDetail } from "@/types/medication"

interface SelectedProvidersListProps {
  selectedDoctors: Doctor[]
  selectedMedications: RxDrugDetail[]
  onRemoveDoctor: (npi: string) => void
  onRemoveMedication: (rxcui: string) => void
  onManageDoctors: () => void
  onManageMedications: () => void
}

export default function SelectedProvidersList({
  selectedDoctors,
  selectedMedications,
  onRemoveDoctor,
  onRemoveMedication,
  onManageDoctors,
  onManageMedications,
}: SelectedProvidersListProps) {
  const hasDoctors = selectedDoctors.length > 0
  const hasMedications = selectedMedications.length > 0

  if (!hasDoctors && !hasMedications) {
    return null
  }

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      {hasDoctors && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <User size={14} className="mr-1.5 text-purple-600" />
              My Doctors
            </h4>
            <Button variant="ghost" size="sm" onClick={onManageDoctors} className="text-xs text-purple-600 h-6 px-2">
              Manage
            </Button>
          </div>
          <ul className="space-y-1.5">
            {selectedDoctors.map((doctor) => (
              <li
                key={doctor.npi}
                className="text-sm bg-gray-50 rounded-md px-3 py-1.5 flex items-center justify-between"
              >
                <span className="truncate">{doctor.name}</span>
                <button
                  onClick={() => onRemoveDoctor(doctor.npi)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                  aria-label={`Remove ${doctor.name}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasMedications && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <Pill size={14} className="mr-1.5 text-purple-600" />
              My Medications
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onManageMedications}
              className="text-xs text-purple-600 h-6 px-2"
            >
              Manage
            </Button>
          </div>
          <ul className="space-y-1.5">
            {selectedMedications.map((medication) => (
              <li
                key={medication.rxcui}
                className="text-sm bg-gray-50 rounded-md px-3 py-1.5 flex items-center justify-between"
              >
                <span className="truncate">{medication.name}</span>
                <button
                  onClick={() => onRemoveMedication(medication.rxcui)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                  aria-label={`Remove ${medication.name}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
