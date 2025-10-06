"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  ChevronDown,
  Check,
  HelpCircle,
  StampIcon as Passport,
  FileCheck,
  CreditCard,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Stepper, type Step } from "@/components/Stepper"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"

// Define the enrollment steps with the new citizenship step
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "ssn", name: "SSN" },
  { id: "citizenship", name: "Citizenship" },
  { id: "verify", name: "Verify" },
  { id: "plan", name: "Plan Selection" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

// Immigration document types with icons
const immigrationDocumentTypes = [
  {
    id: "green-card",
    name: 'Permanent Resident Card ("Green Card", I-551)',
    icon: "card",
  },
  {
    id: "reentry-permit",
    name: "Reentry Permit (I-327)",
    icon: "document",
  },
  {
    id: "refugee-travel",
    name: "Refugee Travel Document (I-571)",
    icon: "document",
  },
  {
    id: "employment-auth",
    name: "Employment Authorization Document (I-766)",
    icon: "card",
  },
  {
    id: "machine-readable",
    name: "Machine Readable Immigrant Visa (with temporary I-551 language)",
    icon: "document",
  },
  {
    id: "temp-stamp",
    name: "Temporary I-551 Stamp (on passport or I-94/I-94A)",
    icon: "document",
  },
  {
    id: "arrival-record",
    name: "Arrival/Departure Record (I-94/I-94A)",
    icon: "document",
  },
  {
    id: "arrival-passport",
    name: "Arrival/Departure Record in foreign passport (I-94)",
    icon: "document",
  },
  {
    id: "foreign-passport",
    name: "Foreign Passport",
    icon: "document",
  },
  {
    id: "student-status",
    name: "Certificate of Eligibility for Nonimmigrant Student Status (I-20)",
    icon: "document",
  },
  {
    id: "exchange-visitor",
    name: "Certificate of Eligibility for Exchange Visitor Status (DS-2019)",
    icon: "document",
  },
  {
    id: "notice-action",
    name: "Notice of Action (I-797)",
    icon: "document",
  },
  {
    id: "indian-tribe",
    name: "Document indicating membership in a federally recognized Indian tribe or American Indian born in Canada",
    icon: "document",
  },
  {
    id: "hhs-certification",
    name: "Certification from U.S. Department of Health and Human Services (HHS) Office of Refugee Resettlement (ORR)",
    icon: "document",
  },
  {
    id: "withholding-removal",
    name: "Document indicating withholding of removal",
    icon: "document",
  },
  {
    id: "orr-letter",
    name: "Office of Refugee Resettlement (ORR) eligibility letter (if under 18)",
    icon: "document",
  },
  {
    id: "alien-number",
    name: "Alien number (also called alien registration number or USCIS number) or I-94 number",
    icon: "document",
  },
  {
    id: "uscis-receipt",
    name: "USCIS Acknowledgement of Receipt (I-797C)",
    icon: "document",
  },
  {
    id: "none",
    name: "None of these",
    icon: "document",
  },
]

export default function CitizenshipInformationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()

  // Form state
  const [isUSCitizen, setIsUSCitizen] = useState<string | null>(null)
  const [documentType, setDocumentType] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [isMounted, setIsMounted] = useState(false)

  // Refs for dropdown positioning
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTriggerRef = useRef<HTMLDivElement>(null)
  const dropdownContainerRef = useRef<HTMLDivElement>(null)

  // Load pre-filled data from session storage if available
  useEffect(() => {
    const storedCitizenship = sessionStorage.getItem("isUSCitizen")
    const storedDocumentType = sessionStorage.getItem("immigrationDocumentType")

    if (storedCitizenship) {
      setIsUSCitizen(storedCitizenship)
    }

    if (storedDocumentType) {
      setDocumentType(storedDocumentType)
    }

    setIsMounted(true)
  }, [])

  // Validate form whenever values change
  useEffect(() => {
    validateForm()
  }, [isUSCitizen, documentType])

  // Add animation styles
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out forwards;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Update dropdown position when it's opened and when scrolling
  useEffect(() => {
    if (dropdownOpen && dropdownTriggerRef.current) {
      const updatePosition = () => {
        const rect = dropdownTriggerRef.current?.getBoundingClientRect()
        if (rect) {
          setDropdownPosition({
            top: rect.bottom,
            left: rect.left,
            width: rect.width,
          })
        }
      }

      updatePosition()

      // Add scroll event listener to update position
      window.addEventListener("scroll", updatePosition)

      return () => {
        window.removeEventListener("scroll", updatePosition)
      }
    }
  }, [dropdownOpen])

  // Update dropdown position on window resize
  useEffect(() => {
    function handleResize() {
      if (dropdownOpen && dropdownTriggerRef.current) {
        const rect = dropdownTriggerRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [dropdownOpen])

  const validateForm = () => {
    // Form is valid if user is a US citizen OR has selected a document type
    let isValid = false
    if (isUSCitizen === "yes") {
      isValid = true
    } else if (isUSCitizen === "no" && documentType !== null) {
      isValid = true
    }
    setFormIsValid(isValid)
    return isValid
  }

  const handleCitizenshipChange = (value: string) => {
    setIsUSCitizen(value)
    // Reset document type when changing citizenship status
    if (value === "yes") {
      setDocumentType(null)
    }
  }

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value)
    setDropdownOpen(false)

    // Show warning dialog if "None of these" is selected
    if (value === "None of these") {
      setShowWarningDialog(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Please answer all required questions to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save data to session storage
      sessionStorage.setItem("isUSCitizen", isUSCitizen || "")
      if (isUSCitizen === "no" && documentType) {
        sessionStorage.setItem("immigrationDocumentType", documentType)
      } else {
        sessionStorage.removeItem("immigrationDocumentType")
      }

      // Show success toast
      toast({
        title: "Information Saved",
        description: "Your citizenship information has been saved",
      })

      // Redirect to the next step
      router.push(`/enroll/incarceration-status?planId=${planId}`)
    } catch (error) {
      console.error("Error saving citizenship information:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push(`/enroll/ssn-information?planId=${planId}`)
  }

  // Get the selected document type object
  const selectedDocument = immigrationDocumentTypes.find((doc) => doc.name === documentType)

  // Dropdown component to be rendered in portal
  const DropdownMenu = () => {
    if (!dropdownOpen) return null

    return (
      <div
        ref={dropdownRef}
        className="fixed bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-[9999]"
        style={{
          position: "fixed",
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          maxHeight: "300px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="sticky top-0 p-3 border-b border-gray-100 bg-white z-10">
          <h4 className="text-sm font-medium text-gray-500">Select Document Type</h4>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
          {immigrationDocumentTypes.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-50 transition-colors",
                documentType === doc.name ? "bg-pink-100" : "",
              )}
              onClick={() => handleDocumentTypeChange(doc.name)}
            >
              {doc.icon === "card" ? (
                <CreditCard
                  className={`h-5 w-5 flex-shrink-0 ${documentType === doc.name ? "text-pink-500" : "text-purple-600"}`}
                />
              ) : (
                <FileCheck
                  className={`h-5 w-5 flex-shrink-0 ${documentType === doc.name ? "text-pink-500" : "text-purple-600"}`}
                />
              )}
              <span className={`${documentType === doc.name ? "text-pink-600 font-medium" : "text-gray-800"}`}>
                {doc.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to SSN Information
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="citizenship" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton
                  title="Citizenship Information Help"
                  explanation="Get instant answers about providing your citizenship status for health insurance enrollment."
                  tips={[
                    "Learn why we need your citizenship information",
                    "Understand how immigration status affects eligibility",
                    "Learn about document requirements for non-citizens",
                    "Get help with citizenship verification issues",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Citizenship Information</h1>
                <p className="text-gray-500">Please provide your citizenship status to continue with your enrollment</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Citizenship Question */}
              <div className="space-y-4">
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Passport className="h-5 w-5 text-purple-600" />
                    </div>
                    <label className="block text-base font-semibold text-gray-800">Are you a U.S. citizen?</label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant={isUSCitizen === "yes" ? "default" : "outline"}
                      className={`w-full py-6 text-base ${
                        isUSCitizen === "yes"
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                          : "border-2 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                      onClick={() => handleCitizenshipChange("yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={isUSCitizen === "no" ? "default" : "outline"}
                      className={`w-full py-6 text-base ${
                        isUSCitizen === "no"
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                          : "border-2 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                      onClick={() => handleCitizenshipChange("no")}
                    >
                      No
                    </Button>
                  </div>
                </div>

                {/* Immigration Document Type - Only show if not a US citizen */}
                {isUSCitizen === "no" && (
                  <div className="w-full mt-8 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FileCheck className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">Select your immigration document type</h3>
                    </div>

                    <div className="relative" ref={dropdownContainerRef}>
                      {/* Custom dropdown trigger */}
                      <div
                        ref={dropdownTriggerRef}
                        className="w-full border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-colors"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <div className="flex items-center gap-3">
                          {selectedDocument ? (
                            <>
                              {selectedDocument.icon === "card" ? (
                                <CreditCard className="h-5 w-5 text-purple-600" />
                              ) : (
                                <FileCheck className="h-5 w-5 text-purple-600" />
                              )}
                              <span className="text-gray-800">{selectedDocument.name}</span>
                            </>
                          ) : (
                            <>
                              <FileCheck className="h-5 w-5 text-purple-400" />
                              <span className="text-gray-400">Choose your immigration document</span>
                            </>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${dropdownOpen ? "transform rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Add spacing to prevent content from jumping when dropdown opens */}
                    <div className="h-12"></div>
                  </div>
                )}
              </div>

              <Separator className="mt-4" />

              {/* Navigation Buttons */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formIsValid}
                  className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Continue to Next Step"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Render dropdown menu in portal to avoid z-index issues */}
      {isMounted && createPortal(<DropdownMenu />, document.body)}

      {/* Redesigned Warning Dialog for "None of these" selection - More Compact Version */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 max-h-[90vh]">
          {/* Compact Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Immigration Status Notice</h2>
                <p className="text-xs text-white/90">
                  Limited eligibility may apply without qualifying immigration status
                </p>
              </div>
            </div>
          </div>

          {/* Content - More compact */}
          <div className="p-4 space-y-4">
            {/* Information Section */}
            <div className="rounded-lg border border-purple-100 overflow-hidden">
              <div className="bg-purple-50 px-3 py-2 border-b border-purple-100">
                <h3 className="flex items-center text-sm font-medium text-purple-700">
                  <Info className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  <span>Important Information</span>
                </h3>
              </div>
              <div className="p-3">
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-[10px] text-white font-medium">1</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      To qualify for health insurance through the Marketplace, you generally need to be a U.S. citizen
                      or have a qualifying immigration status.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-[10px] text-white font-medium">2</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      Without proper documentation, you may face limitations in coverage options and potential
                      subsidies.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-[10px] text-white font-medium">3</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      You can continue with the application, but please be aware that your eligibility may be limited.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Resources - More compact */}
            <div className="bg-blue-50 rounded-lg p-3 flex items-start">
              <HelpCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-medium text-blue-700">Need assistance?</h4>
                <p className="text-xs text-blue-700/80">Our support team can help you understand your options.</p>
              </div>
            </div>

            {/* Action Button */}
            <DialogFooter className="px-0 pb-0 pt-1">
              <Button
                onClick={() => setShowWarningDialog(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Check className="mr-1.5 h-4 w-4" />
                <span className="text-sm font-medium">I Understand</span>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
