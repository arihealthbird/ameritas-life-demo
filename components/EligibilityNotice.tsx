"use client"
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type EligibilityType = "medicare" | "medicaid"

interface FamilyMemberWithAgeRestriction {
  type: "primary" | "spouse" | "dependent"
  name?: string
  age: number
  isOver65?: boolean
}

interface EligibilityNoticeProps {
  type: EligibilityType
  familyMembers: FamilyMemberWithAgeRestriction[]
  onClose: () => void
}

export default function EligibilityNotice({ type, familyMembers, onClose }: EligibilityNoticeProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-red-600">
          {type === "medicaid" ? "Age Restriction Notice" : "Medicare Eligibility Notice"}
        </DialogTitle>
      </DialogHeader>

      <div className="py-4">
        {familyMembers.map((member, index) => (
          <div key={index} className="mb-4 p-3 border rounded-md bg-gray-50">
            <h3 className="font-medium">
              {member.type === "primary"
                ? "Primary Applicant"
                : member.type === "spouse"
                  ? "Spouse"
                  : member.name || `Dependent ${index + 1}`}
              {" - "}
              {member.age} years old
            </h3>
            {member.isOver65 || (member.age && member.age > 65) ? (
              <p className="text-sm text-gray-600 mt-1">
                This person may be eligible for Medicare, which is typically the primary health insurance option for
                individuals 65 and older.
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-1">
                This person is under 19 years old and may be eligible for your state's Children's Health Insurance
                Program (CHIP) or Medicaid.
              </p>
            )}
          </div>
        ))}

        <p className="mt-4">
          {type === "medicare"
            ? "While you can still apply for a Marketplace plan, Medicare may offer better coverage options for your needs."
            : "The primary applicant for a Marketplace health insurance plan must be at least 19 years old."}
        </p>
        <p className="mt-2">Would you like to continue with this application?</p>
      </div>

      <DialogFooter className="flex justify-between sm:justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>Continue Anyway</Button>
      </DialogFooter>
    </>
  )
}
