"use client"

import type React from "react"
import { User, X } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface SelectedDoctorsListProps {
  selectedDoctors: Doctor[]
  handleRemoveDoctor: (doctorId: string) => void
}

const SelectedDoctorsList: React.FC<SelectedDoctorsListProps> = ({ selectedDoctors, handleRemoveDoctor }) => {
  if (selectedDoctors.length === 0) return null

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-6 shadow-sm transition-all duration-300 animate-in fade-in-50">
      <h3 className="font-medium text-gray-800 bg-gradient-to-r from-purple-600/5 to-pink-500/5 p-3 border-b border-gray-100">
        Selected Doctors
      </h3>
      <ul className="divide-y divide-gray-100">
        {selectedDoctors.map((doctor) => (
          <li key={doctor.npi} className="p-3 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-600/10 to-pink-500/10 p-2 rounded-full mr-3">
                  <User size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{doctor.name}</p>
                  <p className="text-xs text-gray-600">
                    {doctor.specialities.length > 0
                      ? doctor.specialities.map((speciality, index) => (
                          <span key={index}>
                            {speciality}
                            {index < doctor.specialities.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">{doctor.zipcode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDoctor(doctor.npi)}
                className="text-gray-400 hover:text-pink-500 transition-colors p-1 rounded-full hover:bg-pink-500/10"
                aria-label={`Remove ${doctor.name}`}
              >
                <X size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedDoctorsList
