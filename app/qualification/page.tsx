"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Flag, ArrowRight } from "lucide-react"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import BackButton from "@/components/BackButton"
import { Particles } from "@/components/ui/particles-interactive"
import { Button } from "@/components/ui/button"

type CitizenshipStatus = "citizen" | "permanent_resident" | "none"

export default function QualificationPage() {
  const router = useRouter()
  const [citizenshipStatus, setCitizenshipStatus] = useState<CitizenshipStatus | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load saved data when component mounts
  useEffect(() => {
    const savedStatus = sessionStorage.getItem("citizenshipStatus") as CitizenshipStatus | null
    if (savedStatus) {
      setCitizenshipStatus(savedStatus)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!citizenshipStatus) {
      return
    }

    setIsSubmitting(true)

    // Store citizenship status in session storage
    sessionStorage.setItem("citizenshipStatus", citizenshipStatus)

    // Simulate API call
    setTimeout(() => {
      // Navigate to plans page
      router.push("/plans")
    }, 800)
  }

  const options = [
    {
      id: "citizen",
      label: "U.S. Citizen",
      description: "Born in the U.S. or naturalized citizen",
      iconSize: 20,
      gradient: "from-blue-100 to-sky-100",
    },
    {
      id: "permanent_resident",
      label: "Permanent Resident",
      description: "Green card holder or lawful permanent resident",
      iconSize: 20,
      gradient: "from-indigo-100 to-purple-100",
    },
    {
      id: "none",
      label: "None of the above",
      description: "Other immigration status",
      iconSize: 20,
      gradient: "from-gray-100 to-slate-100",
    },
  ]

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-white relative overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={100}
          staticity={30}
          ease={70}
          color="#fc3893"
          size={0.5}
        />

        <div className="max-w-xl mx-auto px-4 py-12">
          {/* Container to align BackButton with card */}
          <div className="max-w-md mx-auto mb-0 h-10">
            <BackButton />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative z-10 max-w-lg mx-auto">
            {/* Birdy AI Button - positioned at top right corner */}
            <div className="absolute -top-4 -right-4 z-20">
              <BirdyAIFloatingButton
                title="Qualification Help"
                explanation="Get instant answers about eligibility requirements for life insurance."
                tips={[
                  "Learn about citizenship requirements",
                  "Understand permanent resident eligibility",
                  "Get help with qualification questions",
                  "Learn about documentation needed",
                ]}
              />
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
                Qualification Check
              </h1>
              <p className="text-gray-600">Help us determine your eligibility for life insurance coverage</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-gray-800 mb-6 text-center">
                    Are you a citizen or permanent resident of the USA?
                  </p>

                  <div className="space-y-3">
                    {options.map((option) => {
                      const isSelected = citizenshipStatus === option.id

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setCitizenshipStatus(option.id as CitizenshipStatus)}
                          className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ease-in-out text-left flex items-center min-h-[80px]
                ${
                  isSelected
                    ? "border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg transform scale-[1.01]"
                    : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                }`}
                        >
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 flex-shrink-0
                ${
                  isSelected
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-md text-white"
                    : `bg-gradient-to-br ${option.gradient} text-gray-600`
                }`}
                          >
                            <Flag size={20} strokeWidth={1.5} />
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <h3
                              className={`font-semibold text-base mb-1 transition-colors ${
                                isSelected ? "text-pink-600" : "text-gray-800"
                              }`}
                            >
                              {option.label}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-200 flex items-center justify-center
                ${isSelected ? "border-pink-500 bg-gradient-to-r from-purple-500 to-pink-500" : "border-gray-300"}`}
                          >
                            {isSelected && (
                              <svg
                                width="12"
                                height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4.5L4.5 8L11 1.5"
                                  stroke="white"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !citizenshipStatus}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-4 px-6 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
