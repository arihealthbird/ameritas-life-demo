"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, User, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import { Stepper, type Step } from "@/components/Stepper"
import { formatCurrency } from "@/utils/formatters"

// Define the enrollment steps
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "incarceration", name: "Incarceration" },
  { id: "demographics", name: "Demographics" },
  { id: "verify", name: "Verify" },
  { id: "plan", name: "Plan Selection" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

// Race options mapping for display
const raceOptionsMap: Record<string, string> = {
  decline: "Declined to answer",
  "american-indian": "American Indian/Alaskan Native",
  "asian-indian": "Asian Indian",
  black: "Black or African American",
  chinese: "Chinese",
  filipino: "Filipino",
  guamanian: "Guamanian or Chamorro",
  japanese: "Japanese",
  korean: "Korean",
  "native-hawaiian": "Native Hawaiian",
  samoan: "Samoan",
  vietnamese: "Vietnamese",
  white: "White",
  "asian-other": "Asian Race not listed above",
  "pacific-islander-other": "Pacific Islander Race not listed above",
  other: "Race not listed above",
}

export default function VerifyInformationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")

  // State for demographic data
  const [hispanicOrigin, setHispanicOrigin] = useState<string | null>(null)
  const [race, setRace] = useState<string | null>(null)

  // Add these after the race state variable
  const [totalAnnualIncome, setTotalAnnualIncome] = useState<number | null>(null)
  const [incomeSources, setIncomeSources] = useState<any[]>([])

  useEffect(() => {
    if (!planId) {
      router.push("/plans")
    }

    // Load personal information data
    const firstName = sessionStorage.getItem("firstName") || ""
    const lastName = sessionStorage.getItem("lastName") || ""
    const phoneNumber = sessionStorage.getItem("phoneNumber") || ""
    const address1 = sessionStorage.getItem("address1") || ""
    const address2 = sessionStorage.getItem("address2") || ""
    const city = sessionStorage.getItem("city") || ""
    const state = sessionStorage.getItem("state") || ""

    // Load demographic data
    const savedHispanicOrigin = sessionStorage.getItem("hispanicOrigin")
    const savedRace = sessionStorage.getItem("race")

    // Load income data
    const savedTotalAnnualIncome = sessionStorage.getItem("totalAnnualIncome")
    const savedIncomeSources = sessionStorage.getItem("incomeSources")

    if (savedHispanicOrigin) {
      setHispanicOrigin(savedHispanicOrigin)
    }

    if (savedRace) {
      setRace(savedRace)
    }

    if (savedTotalAnnualIncome) {
      setTotalAnnualIncome(Number.parseInt(savedTotalAnnualIncome, 10))
    }

    if (savedIncomeSources) {
      try {
        setIncomeSources(JSON.parse(savedIncomeSources))
      } catch (e) {
        console.error("Error parsing income sources:", e)
      }
    }

    // Then use this data to populate your verification page
    // ...
  }, [planId, router])

  const handleBack = () => {
    router.push(`/enroll/income?planId=${planId}`)
  }

  // Format Hispanic origin for display
  const getHispanicOriginDisplay = () => {
    if (hispanicOrigin === "yes") return "Yes"
    if (hispanicOrigin === "no") return "No"
    if (hispanicOrigin === "decline") return "Declined to answer"
    return "Not provided"
  }

  // Format race for display
  const getRaceDisplay = () => {
    if (!race) return "Not provided"
    return raceOptionsMap[race] || race
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Income
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="verify" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Information</h1>
            <p className="text-gray-600 mb-8">
              Please review your information below to ensure everything is correct before proceeding.
            </p>

            {/* Demographics Information */}
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Demographics</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/enroll/demographics?planId=${planId}`)}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <p className="text-sm font-medium text-gray-500">Hispanic, Latino, or Spanish Origin</p>
                  </div>
                  <p className="text-base font-medium pl-6">{getHispanicOriginDisplay()}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <p className="text-sm font-medium text-gray-500">Race/Ethnicity</p>
                  </div>
                  <p className="text-base font-medium pl-6">{getRaceDisplay()}</p>
                </div>
              </div>
            </div>

            {/* Income Information */}
            {totalAnnualIncome !== null && (
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Income</h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/enroll/income?planId=${planId}`)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <p className="text-sm font-medium text-gray-500">Total Annual Income</p>
                    </div>
                    <p className="text-base font-medium pl-6">{formatCurrency(totalAnnualIncome)}</p>
                  </div>

                  {incomeSources.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 pl-6">Income Sources: {incomeSources.length}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other verification sections would go here */}
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>

            {/* Continue Button */}
            <div className="mt-8 flex justify-center">
              <Button
                className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/enroll/plan-selection?planId=${planId}`)}
              >
                Continue to Plan Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
