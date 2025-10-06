"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TobaccoUsageForm } from "@/components/TobaccoUsageForm"
import { useToast } from "@/hooks/use-toast"

export default function TobaccoUsagePage() {
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load enrollment data from localStorage
    const storedData = localStorage.getItem("enrollmentData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setEnrollmentData(parsedData)
    }
    setLoading(false)
  }, [])

  const handleSave = (tobaccoData: { isTobaccoUser: boolean; lastUsedDate?: string }) => {
    if (!enrollmentData) return

    const updatedData = {
      ...enrollmentData,
      primaryApplicant: {
        ...enrollmentData.primaryApplicant,
        isTobaccoUser: tobaccoData.isTobaccoUser,
        lastTobaccoUseDate: tobaccoData.lastUsedDate || null,
      },
    }

    localStorage.setItem("enrollmentData", JSON.stringify(updatedData))

    // Determine next route based on family members
    const hasFamilyMembers = enrollmentData.familyMembers && enrollmentData.familyMembers.length > 0

    if (hasFamilyMembers) {
      // Check if there's a spouse that needs tobacco info
      const spouse = enrollmentData.familyMembers.find(
        (member: any) => member.relationshipToPrimary === "Spouse" && member.includedInCoverage,
      )

      if (spouse) {
        router.push(`/enroll/family-member/tobacco-usage?memberId=${spouse.id}`)
      } else {
        // Check if there are dependents that need tobacco info
        const dependent = enrollmentData.familyMembers.find(
          (member: any) => member.relationshipToPrimary !== "Spouse" && member.includedInCoverage,
        )

        if (dependent) {
          router.push(`/enroll/family-member/tobacco-usage?memberId=${dependent.id}`)
        } else {
          router.push("/enroll/income")
        }
      }
    } else {
      router.push("/enroll/income")
    }
  }

  const handleBack = () => {
    router.push("/enroll/demographics")
  }

  const handleSkip = () => {
    if (!enrollmentData) return

    // Skip is only allowed if primary applicant is not included in coverage
    if (!enrollmentData.primaryApplicant.includedInCoverage) {
      // Update data to explicitly set tobacco usage to false when skipping
      const updatedData = {
        ...enrollmentData,
        primaryApplicant: {
          ...enrollmentData.primaryApplicant,
          isTobaccoUser: false,
          lastTobaccoUseDate: null,
        },
      }

      localStorage.setItem("enrollmentData", JSON.stringify(updatedData))

      // Determine next route based on family members
      const hasFamilyMembers = enrollmentData.familyMembers && enrollmentData.familyMembers.length > 0

      if (hasFamilyMembers) {
        // Check if there's a spouse that needs tobacco info
        const spouse = enrollmentData.familyMembers.find(
          (member: any) => member.relationshipToPrimary === "Spouse" && member.includedInCoverage,
        )

        if (spouse) {
          router.push(`/enroll/family-member/tobacco-usage?memberId=${spouse.id}`)
        } else {
          // Check if there are dependents that need tobacco info
          const dependent = enrollmentData.familyMembers.find(
            (member: any) => member.relationshipToPrimary !== "Spouse" && member.includedInCoverage,
          )

          if (dependent) {
            router.push(`/enroll/family-member/tobacco-usage?memberId=${dependent.id}`)
          } else {
            router.push("/enroll/income")
          }
        }
      } else {
        router.push("/enroll/income")
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!enrollmentData) {
    router.push("/enroll/personal-information")
    return null
  }

  const { primaryApplicant } = enrollmentData
  const canSkip = !primaryApplicant.includedInCoverage

  return (
    <TobaccoUsageForm
      applicantType="primary"
      initialTobaccoUser={primaryApplicant.isTobaccoUser || false}
      initialLastUsedDate={primaryApplicant.lastTobaccoUseDate || ""}
      onSave={handleSave}
      onBack={handleBack}
      onSkip={handleSkip}
      canSkip={canSkip}
    />
  )
}
