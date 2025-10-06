"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import AgreementLayout from "@/components/agreements/AgreementLayout"
import AgreementStatement from "@/components/agreements/AgreementStatement"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SignAndSubmitPage() {
  const [agreements, setAgreements] = useState<Record<string, string>>({
    notification: "",
    medicare: "",
  })
  const [signature, setSignature] = useState("")
  const [medicareOption, setMedicareOption] = useState<string>("")
  const [applicantName, setApplicantName] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [signatureError, setSignatureError] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const validationAttempted = useRef(false)

  // Format the current date
  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    setCurrentDate(formattedDate)
  }, [])

  // Load saved agreements and applicant data from session storage on mount
  useEffect(() => {
    // Load agreements
    const savedAgreements = sessionStorage.getItem("signSubmitAgreements")
    if (savedAgreements) {
      try {
        setAgreements(JSON.parse(savedAgreements))
      } catch (e) {
        console.error("Error parsing saved agreements:", e)
      }
    }

    // Load Medicare option
    const savedMedicareOption = sessionStorage.getItem("medicareOption")
    if (savedMedicareOption) {
      setMedicareOption(savedMedicareOption)
    }

    // Load applicant data first
    try {
      // Try to get first name and last name directly from session storage
      const firstName = sessionStorage.getItem("firstName")
      const lastName = sessionStorage.getItem("lastName")

      if (firstName && lastName) {
        // Trim any whitespace to ensure clean comparison
        const fullName = `${firstName.trim()} ${lastName.trim()}`
        setApplicantName(fullName)
        console.log("Loaded applicant name:", fullName)

        // Now load signature after we have the applicant name
        const savedSignature = sessionStorage.getItem("signature")
        if (savedSignature) {
          setSignature(savedSignature.trim())
          // Don't validate immediately to avoid initial error messages
        }
      } else {
        // Fallback to personalInfo if individual fields aren't available
        const personalInfo = sessionStorage.getItem("personalInfo")
        if (personalInfo) {
          try {
            const { firstName, lastName } = JSON.parse(personalInfo)
            if (firstName && lastName) {
              const fullName = `${firstName.trim()} ${lastName.trim()}`
              setApplicantName(fullName)
              console.log("Loaded applicant name from personalInfo:", fullName)

              // Load signature
              const savedSignature = sessionStorage.getItem("signature")
              if (savedSignature) {
                setSignature(savedSignature.trim())
              }
            }
          } catch (e) {
            console.error("Error parsing personalInfo:", e)
            setDebugInfo("Error parsing personalInfo")
          }
        } else {
          setDebugInfo("No personal information found in session storage")
        }
      }
    } catch (e) {
      console.error("Error loading applicant data:", e)
      setDebugInfo(`Error loading applicant data: ${e.message}`)
    }
  }, [])

  // Fixed validation function that properly handles whitespace and comparison
  const validateSignature = (signatureValue: string, nameToMatch: string): boolean => {
    validationAttempted.current = true

    // Reset error first
    setSignatureError("")

    if (!nameToMatch) {
      setSignatureError("Unable to retrieve your name for validation")
      return false
    }

    // Check if empty
    if (!signatureValue.trim()) {
      setSignatureError("Signature is required")
      return false
    }

    // Trim both values for comparison to avoid whitespace issues
    const trimmedSignature = signatureValue.trim()
    const trimmedName = nameToMatch.trim()

    // Check for exact match (case-sensitive)
    if (trimmedSignature !== trimmedName) {
      // For debugging, show the exact values being compared
      console.log(`Signature validation failed: "${trimmedSignature}" !== "${trimmedName}"`)
      setSignatureError(`Signature must exactly match your full name: ${trimmedName}`)
      return false
    }

    // All validation passed
    return true
  }

  const handleAgreementChange = (id: string, value: string) => {
    const newAgreements = { ...agreements, [id]: value }
    setAgreements(newAgreements)
    sessionStorage.setItem("signSubmitAgreements", JSON.stringify(newAgreements))
  }

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSignature = e.target.value

    // Filter out numbers and special characters as the user types
    // Allow letters, spaces, hyphens, and apostrophes (common in names)
    const filteredSignature = newSignature.replace(/[^a-zA-Z\s\-']/g, "")

    if (filteredSignature !== newSignature) {
      // If we filtered something out, show an error
      setSignatureError("Signature cannot contain numbers or special characters")
    } else {
      // Clear this specific error if no invalid characters
      if (signatureError === "Signature cannot contain numbers or special characters") {
        setSignatureError("")
      }
    }

    // Update with the filtered value
    setSignature(filteredSignature)
    sessionStorage.setItem("signature", filteredSignature)

    // Validate against applicant name
    if (applicantName) {
      validateSignature(filteredSignature, applicantName)
    }
  }

  const handleMedicareOptionChange = (option) => {
    setMedicareOption(option)
    sessionStorage.setItem("medicareOption", option)
  }

  // Fixed logic to determine if the Submit button should be enabled
  const isSignatureValid = applicantName && signature.trim() === applicantName.trim() && !signatureError

  const isComplete = agreements.notification === "agree" && medicareOption !== "" && isSignatureValid

  const notificationStatement = `I know that I must tell the program I'll be enrolled in within 30 days if information I listed on this application changes. I know I can make changes in my Marketplace account or by calling the Marketplace Call Center at 1-800-318-2596 (TTY: 1-855-889-4325). I know a change in my information could affect eligibility for member(s) of my household.`

  const medicareStatement = `If anyone on your application is enrolled in Marketplace coverage and is also found to have Medicare coverage, the Marketplace will automatically end their Marketplace plan coverage. They will get a notice before Marketplace terminates their coverage in case they need to keep it or make changes. During all the months of overlapping coverage, they're responsible for paying the full cost for the Marketplace plan premium and covered services.`

  const signatureStatement = `I'm signing this application under penalty of perjury, which means I've provided true answers to all of the questions to the best of my knowledge. I know I may be subject to penalties under federal law if I intentionally provide false information.`

  return (
    <AgreementLayout
      title="Sign and Submit"
      description="Please read and acknowledge the following statements"
      currentStep="agreements"
      backPath="/enroll/agreements/tax-attestation"
      nextPath="/enroll/complete"
      isNextDisabled={!isComplete}
      nextButtonText="Submit"
    >
      <div className="space-y-8">
        {/* Notification Agreement */}
        <div className="space-y-4">
          <AgreementStatement
            statement={notificationStatement}
            id="notification"
            onChange={handleAgreementChange}
            value={agreements.notification}
          />
        </div>

        {/* Medicare Coverage */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="mb-6">
            <p className="text-gray-800 text-lg">{medicareStatement}</p>
          </div>

          <div className="space-y-4">
            <RadioGroup value={medicareOption} onValueChange={handleMedicareOptionChange} className="space-y-3">
              <div className="flex items-start space-x-2 p-3 rounded-md border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50">
                <RadioGroupItem value="allow" id="allow" className="mt-1" />
                <label htmlFor="allow" className="text-base cursor-pointer flex-1">
                  I agree to allow the Marketplace to end the Marketplace coverage
                </label>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-md border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50">
                <RadioGroupItem value="deny" id="deny" className="mt-1" />
                <label htmlFor="deny" className="text-base cursor-pointer flex-1">
                  I don't give the Marketplace permission
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Signature */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="mb-6">
            <p className="text-gray-800 text-lg">{signatureStatement}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-1">
                {applicantName
                  ? `Sign by typing your full name exactly as shown: "${applicantName}"`
                  : "Type your full name below to sign electronically"}
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    id="signature"
                    type="text"
                    value={signature}
                    onChange={handleSignatureChange}
                    className={`w-full p-4 text-lg border-2 ${
                      signatureError ? "border-red-300 focus:border-red-500" : "focus:border-purple-300"
                    }`}
                    placeholder={applicantName || "Your full name"}
                    aria-invalid={signatureError ? "true" : "false"}
                    aria-describedby={signatureError ? "signature-error" : undefined}
                  />
                  {signatureError && (
                    <div id="signature-error" className="mt-2 flex items-center text-red-600 text-sm" role="alert">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{signatureError}</span>
                    </div>
                  )}
                  {!signatureError && signature && signature.trim() !== applicantName.trim() && (
                    <div className="mt-2 flex items-center text-amber-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Your signature must match your full name exactly to continue.</span>
                    </div>
                  )}
                  {isSignatureValid && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Signature valid</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md text-gray-700 whitespace-nowrap">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{currentDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button status explanation */}
        {!isComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-amber-800 font-medium mb-2">The Submit button is disabled because:</p>
            <ul className="text-amber-800 text-sm list-disc pl-5 space-y-1">
              {!agreements.notification && <li>You need to acknowledge the notification statement</li>}
              {!medicareOption && <li>You need to select a Medicare coverage option</li>}
              {!signature && <li>You need to provide your signature</li>}
              {signature && !isSignatureValid && (
                <li>Your signature must exactly match your full name: "{applicantName}"</li>
              )}
            </ul>
          </div>
        )}

        {/* Debug information - only shown when there's an issue */}
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
            <p className="text-sm font-medium mb-2">Debug Information:</p>
            <p className="text-xs text-gray-700">{debugInfo}</p>
            <p className="text-xs text-gray-700 mt-1">
              Expected: "{applicantName}" (length: {applicantName.length})
            </p>
            <p className="text-xs text-gray-700">
              Entered: "{signature}" (length: {signature.length})
            </p>
          </div>
        )}
      </div>
    </AgreementLayout>
  )
}
