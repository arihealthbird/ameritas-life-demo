"use client"

import type React from "react"
import { Heart, Users, Pencil, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FamilyMember {
  id: string
  type: "spouse" | "dependent"
  dateOfBirth: string
  gender: "male" | "female"
  tobaccoUsage: "non-smoker" | "smoker"
  includedInCoverage: boolean
}

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: (member: FamilyMember) => void
  onDelete: (id: string) => void
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {member.type === "spouse" ? (
            <Heart className="h-5 w-5 text-pink-500 mr-2" />
          ) : (
            <Users className="h-5 w-5 text-purple-600 mr-2" />
          )}
          <h3 className="font-medium text-gray-900 capitalize">{member.type}</h3>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-purple-600"
            onClick={() => onEdit(member)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-600"
            onClick={() => onDelete(member.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Date of Birth</p>
          <p className="font-medium">{member.dateOfBirth}</p>
        </div>
        <div>
          <p className="text-gray-500">Gender</p>
          <p className="font-medium capitalize">{member.gender}</p>
        </div>
        <div>
          <p className="text-gray-500">Tobacco Usage</p>
          <p className="font-medium capitalize">{member.tobaccoUsage.replace("-", " ")}</p>
        </div>
        <div>
          <p className="text-gray-500">Coverage</p>
          {member.includedInCoverage ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" /> Included
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Not Included
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FamilyMemberCard
