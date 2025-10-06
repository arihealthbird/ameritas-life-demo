"use client"

import { Button } from "@/components/ui/button"

import type React from "react"
import { useState } from "react"
import { ArrowRight, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { isZipCodeSupported } from "@/utils/zipCodeValidation"
import { Input } from "@/components/ui/input"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { getMainFlowNextStep } from "@/utils/routeUtils"

const ZipCodeForm: React.FC = () => {
  const [zipCode, setZipCode] = useState("")
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUnsupportedArea, setIsUnsupportedArea] = useState(false)
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false)
  const [waitlistError, setWaitlistError] = useState<string | null>(null)
  const router = useRouter()

  const handleZipCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic ZIP code validation (5 digits)
    if (!/^\d{5}$/.test(zipCode)) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    setIsSubmitting(true)

    // Check if the ZIP code is in a supported area
    if (isZipCodeSupported(zipCode)) {
      // ZIP code is supported, proceed with the normal flow
      // Simulate API call to validate ZIP code
      setTimeout(() => {
        // In a real app, you would save the ZIP code to state/context or API
        console.log("Submitting ZIP code:", zipCode)

        // Navigate to the next step in the main flow
        const nextStep = getMainFlowNextStep("/") // Current path is home "/"
        if (nextStep) {
          router.push(nextStep)
        } else {
          // Fallback or error handling if next step is not found, though unlikely here
          console.error("Next step not found from home page")
          router.push("/date-of-birth") // Or a generic error page
        }
      }, 1000)
    } else {
      // ZIP code is not supported, show the unsupported area message
      setTimeout(() => {
        setIsSubmitting(false)
        setIsUnsupportedArea(true)
      }, 1000)
    }
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes("@")) {
      setWaitlistError("Please enter a valid email address")
      return
    }

    setWaitlistError(null)
    setIsSubmitting(true)

    try {
      // Simulate API call to add to waitlist
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would call an API endpoint here
      console.log("Adding to waitlist:", { email, zipCode })

      setIsWaitlistSubmitted(true)
    } catch (err) {
      console.error("Error submitting to waitlist:", err)
      setWaitlistError("Failed to join waitlist. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTryDifferentZip = () => {
    setZipCode("")
    setIsUnsupportedArea(false)
    setIsWaitlistSubmitted(false)
    setWaitlistError(null)
  }

  // Render the ZIP code input form
  const renderZipCodeForm = () => (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Get a Life Insurance Quote</h3>

      <form onSubmit={handleZipCodeSubmit} className="space-y-4">
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your ZIP code to see available Ameritas plans
          </label>
          <div className="relative">
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              className={`w-full px-4 py-3 rounded-lg border ${!isValid ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
              maxLength={5}
              disabled={isSubmitting}
            />
            {!isValid && <p className="text-red-500 text-sm mt-1">Please enter a valid 5-digit ZIP code</p>}
          </div>
        </div>

        <RainbowButton
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1 h-auto"
        >
          <span>{isSubmitting ? "Processing..." : "Get Started"}</span>
          <ArrowRight size={18} />
        </RainbowButton>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">Free, no obligation quotes. Your information is secure.</p>
    </>
  )

  // Render the unsupported area message with waitlist form
  const renderUnsupportedAreaForm = () => (
    <div className="flex flex-col items-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
        <Mail className="h-6 w-6 text-purple-600" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        Ameritas plans may not be available in your area yet
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-center mb-6">
        We're working to expand Ameritas Life Insurance coverage. We've noted your interest for ZIP code{" "}
        <span className="font-medium">{zipCode}</span>.
      </p>

      {isWaitlistSubmitted ? (
        <div className="text-center space-y-4 w-full">
          <div className="bg-green-50 text-green-700 p-4 rounded-lg">
            <p className="font-medium">Thank you for joining our waitlist!</p>
            <p className="text-sm">We'll notify you when we expand to your area.</p>
          </div>

          <Button onClick={handleTryDifferentZip} variant="outline" className="w-full">
            Try Different ZIP
          </Button>
        </div>
      ) : (
        <>
          <p className="text-gray-700 text-center mb-4">
            Join our waitlist to be notified when we expand to your area:
          </p>

          <form onSubmit={handleWaitlistSubmit} className="w-full space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${waitlistError ? "border-red-500" : ""}`}
              />
              {waitlistError && <p className="text-red-500 text-xs mt-1">{waitlistError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="mr-2">Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Notify Me
                    <ArrowRight size={16} className="ml-2" />
                  </span>
                )}
              </Button>

              <Button type="button" variant="outline" onClick={handleTryDifferentZip}>
                Try Different ZIP
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )

  return <div className="w-full">{isUnsupportedArea ? renderUnsupportedAreaForm() : renderZipCodeForm()}</div>
}

export default ZipCodeForm
