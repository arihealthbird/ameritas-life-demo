"use client"

import type React from "react"
import { X, Pill } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RxDrugDetail } from "@/types/medication"

interface SelectedMedicationsListProps {
  selectedMedications: RxDrugDetail[]
  handleRemoveMedication: (medicationId: string) => void
}

const SelectedMedicationsList: React.FC<SelectedMedicationsListProps> = ({
  selectedMedications,
  handleRemoveMedication,
}) => {
  if (selectedMedications.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in-50">
      <ScrollArea className="max-h-[250px]">
        <ul className="divide-y divide-gray-100">
          {selectedMedications.map((medication) => (
            <li key={medication.rxcui} className="group hover:bg-red-50/50 transition-colors duration-150">
              <div className="p-3 flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-purple-600/10 to-pink-500/10 p-2 rounded-full">
                    <Pill size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{medication.name}</p>
                    <p className="text-xs text-gray-600">
                      {medication.rxcui} • {medication.rxnorm_dose_form}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(medication.rxcui)}
                  className={cn(
                    "text-gray-400 p-2 rounded-full",
                    "hover:bg-red-100 hover:text-red-500",
                    "transition-all duration-200 transform",
                    "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100",
                  )}
                  aria-label={`Remove ${medication.name}`}
                >
                  <X size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

export default SelectedMedicationsList
