"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import BackButton from "@/components/BackButton"
import { SimpleParticles } from "@/components/ui/simple-particles"
import { cn } from "@/lib/utils"

// Define rider types for term life insurance
interface Rider {
  id: string
  name: string
  description: string
  baseCost: number // Monthly cost
  isPercentage?: boolean // If true, cost is percentage of base premium
  isIncluded?: boolean // If true, included by default
  isOptional: boolean
}

const availableRiders: Rider[] = [
  {
    id: "accidental-death",
    name: "Accidental Death Benefit",
    description: "Additional benefit if death is due to an accident",
    baseCost: 0,
    isIncluded: true,
    isOptional: false,
  },
  {
    id: "waiver-premium",
    name: "Waiver of Premium",
    description: "Waives premium payments if you become disabled",
    baseCost: 15,
    isOptional: true,
  },
  {
    id: "terminal-illness",
    name: "Terminal Illness Benefit",
    description: "Accelerated death benefit for terminal illness",
    baseCost: 8,
    isOptional: true,
  },
  {
    id: "child-term",
    name: "Child Term Rider",
    description: "Coverage for all children under 18",
    baseCost: 12,
    isOptional: true,
  },
  {
    id: "spouse-term",
    name: "Spouse Term Rider",
    description: "Additional coverage for your spouse",
    baseCost: 25,
    isOptional: true,
  },
]

export default function PlansPage() {
  const router = useRouter()

  // User information
  const [age, setAge] = useState<number>(35)
  const [gender, setGender] = useState<string>("male")
  const [healthStatus, setHealthStatus] = useState<string>("Great")

  // Coverage selection
  const [termLifeCoverage, setTermLifeCoverage] = useState<number>(250000)
  const [selectedRiders, setSelectedRiders] = useState<string[]>(["accidental-death"])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load user info from session storage
  useEffect(() => {
    const savedGender = sessionStorage.getItem("gender")
    const savedHealthStatus = sessionStorage.getItem("healthStatus")
    const savedDateOfBirth = sessionStorage.getItem("dateOfBirth")

    if (savedGender) setGender(savedGender)
    if (savedHealthStatus) setHealthStatus(savedHealthStatus)

    if (savedDateOfBirth) {
      const birthDate = new Date(savedDateOfBirth)
      const today = new Date()
      const calculatedAge = today.getFullYear() - birthDate.getFullYear()
      setAge(calculatedAge)
    }
  }, [])

  // Calculate costs
  const basePremiumPerMonth = Math.round((termLifeCoverage / 1000) * 0.15 * (age / 30))
  const accidentalDeathBenefit = Math.round(termLifeCoverage * 2) // 2x the base coverage
  const totalCoverage = termLifeCoverage + (selectedRiders.includes("accidental-death") ? accidentalDeathBenefit : 0)

  const riderCosts = selectedRiders.reduce((total, riderId) => {
    const rider = availableRiders.find((r) => r.id === riderId)
    return total + (rider?.baseCost || 0)
  }, 0)

  const totalMonthlyPremium = basePremiumPerMonth + riderCosts
  const dailyCost = (totalMonthlyPremium / 30).toFixed(2)

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleRiderToggle = (riderId: string) => {
    const rider = availableRiders.find((r) => r.id === riderId)
    if (!rider?.isOptional) return // Can't toggle required riders

    setSelectedRiders((prev) => (prev.includes(riderId) ? prev.filter((id) => id !== riderId) : [...prev, riderId]))
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      // Save plan selections to session storage
      sessionStorage.setItem("selectedTermLifeCoverage", termLifeCoverage.toString())
      sessionStorage.setItem("selectedRiders", JSON.stringify(selectedRiders))
      sessionStorage.setItem("totalMonthlyPremium", totalMonthlyPremium.toString())
      sessionStorage.setItem("totalCoverage", totalCoverage.toString())
      sessionStorage.setItem("dailyCost", dailyCost)

      // Save plan selection timestamp
      sessionStorage.setItem("planSelectedAt", new Date().toISOString())

      // Simulate API call
      setTimeout(() => {
        // Navigate to account creation page (updated navigation flow)
        router.push("/create-account")
      }, 1000)
    },
    [termLifeCoverage, selectedRiders, totalMonthlyPremium, totalCoverage, dailyCost, router],
  )

  return (
    <div>
      <SimpleHeader />
      {/* Ensure the parent div has position: relative */}
      <div className="min-h-screen bg-white relative overflow-hidden">
        <SimpleParticles
          className="absolute inset-0 -z-10 pointer-events-none"
          quantity={100}
          color="#fc3893"
          size={0.5}
        />

        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Container to align BackButton with card */}
          <div className="max-w-xl mx-auto mb-0 h-10">
            <BackButton />
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 relative z-10 max-w-xl mx-auto">
            {/* Position Birdy AI button at the top right corner of the card */}
            <div className="absolute -top-4 -right-4 z-20">
              <BirdyAIFloatingButton
                title="Ameritas Life Insurance Help"
                explanation="Get instant answers about Ameritas life insurance, policy options, and riders."
                tips={[
                  "What are insurance riders?",
                  "How much coverage do I need?",
                  "Explain accidental death benefit",
                  "What is waiver of premium?",
                ]}
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Choose your coverage
              </h1>
              <p className="text-gray-600">Customize your Ameritas Term Life Insurance policy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Coverage Summary Card */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Total Coverage Summary */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Total Coverage</h2>
                    <p className="text-sm text-gray-600">Until age 80</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCoverage)}</div>
                    <div className="text-sm text-gray-600">${dailyCost}/day</div>
                  </div>
                </div>

                <hr className="border-gray-300" />

                {/* Term Life Coverage Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Term Life</h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{formatCurrency(termLifeCoverage)}</div>
                      <div className="text-xs text-green-600 font-medium">Recommended</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Slider
                      value={[termLifeCoverage]}
                      onValueChange={(value) => setTermLifeCoverage(value[0])}
                      max={1000000}
                      min={50000}
                      step={25000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$50K</span>
                      <span>$1M</span>
                    </div>
                  </div>
                </div>

                {/* Included Riders */}
                {availableRiders
                  .filter((rider) => rider.isIncluded)
                  .map((rider) => (
                    <div key={rider.id}>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between items-center pt-4">
                        <h3 className="text-lg font-semibold text-gray-900">{rider.name}</h3>
                        <div className="text-xl font-bold text-gray-900">
                          {rider.id === "accidental-death" ? formatCurrency(accidentalDeathBenefit) : "Included"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Optional Riders */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800">Optional Riders</label>
                <div className="space-y-3">
                  {availableRiders
                    .filter((rider) => rider.isOptional)
                    .map((rider) => {
                      const isSelected = selectedRiders.includes(rider.id)
                      return (
                        <div
                          key={rider.id}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                            isSelected
                              ? "border-purple-400 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300 bg-white",
                          )}
                          onClick={() => handleRiderToggle(rider.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-colors",
                                    isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300",
                                  )}
                                >
                                  {isSelected && (
                                    <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
                                      <path
                                        d="M1 4L4.5 7.5L11 1"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900">{rider.name}</h4>
                              </div>
                              <p className="text-xs text-gray-600 ml-7">{rider.description}</p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-sm font-bold text-gray-900">+${rider.baseCost}/mo</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* How Coverage Works */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start mb-2">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-900">How does my coverage work?</h3>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed ml-7">
                  Your policy includes Ameritas Term Life Insurance with optional riders to enhance your coverage. The
                  Accidental Death Benefit provides additional protection in case of an accident, while other riders can
                  be added to customize your policy for your specific needs.
                </p>
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-6 rounded-lg transition-all duration-300",
                  "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/20",
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
