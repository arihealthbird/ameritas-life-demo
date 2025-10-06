"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TobaccoUsageForm } from "@/components/TobaccoUsageForm"
import { useToast } from "@/hooks/use-toast"

export default function FamilyMemberTobaccoUsagePage() {
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const [currentMember, setCurrentMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const memberId = searchParams.get("memberId")

  useEffect(() => {
    // Load enrollment data from localStorage
    const storedData = localStorage.getItem("enrollmentData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setEnrollmentData(parsedData)

      if (memberId && parsedData.familyMembers) {
        const member = parsedData.familyMembers.find((m: any) => m.id === memberId)
        if (member) {
          setCurrentMember(member)
        } else {
          // Member not found, redirect to income page
          router.push("/enroll/income")
        }
      } else {
        // No member ID, redirect to income page
        router.push("/enroll/income")
      }
    }
    setLoading(false)
  }, [memberId, router])

  const handleSave = (tobaccoData: { isTobaccoUser: boolean; lastUsedDate?: string }) => {
    if (!enrollmentData || !currentMember) return

    // Update the current family member's tobacco usage data
    const updatedFamilyMembers = enrollmentData.familyMembers.map((member: any) => {
      if (member.id === memberId) {
        return {
          ...member,
          isTobaccoUser: tobaccoData.isTobaccoUser,
          lastTobaccoUseDate: tobaccoData.lastUsedDate || null,
        }
      }
      return member
    })

    const updatedData = {
      ...enrollmentData,
      familyMembers: updatedFamilyMembers,
    }

    localStorage.setItem("enrollmentData", JSON.stringify(updatedData))

    // Find the next family member who needs tobacco info
    const remainingMembers = updatedData.familyMembers.filter(
      (member: any) => member.id !== memberId && member.includedInCoverage && member.isTobaccoUser === undefined,
    )

    if (remainingMembers.length > 0) {
      // Navigate to the next family member's tobacco page
      router.push(`/enroll/family-member/tobacco-usage?memberId=${remainingMembers[0].id}`)
    } else {
      // All family members processed, move to income page
      router.push("/enroll/income")
    }
  }

  const handleBack = () => {
    if (currentMember?.relationshipToPrimary === "Spouse") {
      // If current member is spouse, go back to primary applicant's tobacco page
      router.push("/enroll/tobacco-usage")
    } else {
      // Find the previous family member who needed tobacco info
      const familyMembers = enrollmentData?.familyMembers || []
      const currentIndex = familyMembers.findIndex((m: any) => m.id === memberId)

      if (currentIndex > 0) {
        // Look for previous members who are included in coverage
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (familyMembers[i].includedInCoverage) {
            return router.push(`/enroll/family-member/tobacco-usage?memberId=${familyMembers[i].id}`)
          }
        }
      }

      // If no previous family member, go back to primary applicant's tobacco page
      router.push("/enroll/tobacco-usage")
    }
  }

  const handleSkip = () => {
    if (!enrollmentData || !currentMember) return

    // Skip is only allowed if family member is not included in coverage
    if (!currentMember.includedInCoverage) {
      // Update data to explicitly set tobacco usage to false when skipping
      const updatedFamilyMembers = enrollmentData.familyMembers.map((member: any) => {
        if (member.id === memberId) {
          return {
            ...member,
            isTobaccoUser: false,
            lastTobaccoUseDate: null,
          }
        }
        return member
      })

      const updatedData = {
        ...enrollmentData,
        familyMembers: updatedFamilyMembers,
      }

      localStorage.setItem("enrollmentData", JSON.stringify(updatedData))

      // Find the next family member who needs tobacco info
      const remainingMembers = updatedData.familyMembers.filter(
        (member: any) => member.id !== memberId && member.includedInCoverage && member.isTobaccoUser === undefined,
      )

      if (remainingMembers.length > 0) {
        // Navigate to the next family member's tobacco page
        router.push(`/enroll/family-member/tobacco-usage?memberId=${remainingMembers[0].id}`)
      } else {
        // All family members processed, move to income page
        router.push("/enroll/income")
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!enrollmentData || !currentMember) {
    router.push("/enroll/personal-information")
    return null
  }

  const applicantType = currentMember.relationshipToPrimary === "Spouse" ? "spouse" : "dependent"
  const canSkip = !currentMember.includedInCoverage
  const fullName = `${currentMember.firstName} ${currentMember.lastName}`

  return (
    <TobaccoUsageForm
      applicantType={applicantType}
      applicantName={fullName}
      initialTobaccoUser={currentMember.isTobaccoUser || false}
      initialLastUsedDate={currentMember.lastTobaccoUseDate || ""}
      onSave={handleSave}
      onBack={handleBack}
      onSkip={handleSkip}
      canSkip={canSkip}
    />
  )
}
