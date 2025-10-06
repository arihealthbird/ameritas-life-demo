"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Home, MapPin, Building2, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Stepper, type Step } from "@/components/Stepper"

// Define the enrollment steps
const enrollmentSteps: Step[] = [
  { id: "personal", name: "Personal Info" },
  { id: "contact", name: "Contact Info" },
  { id: "address", name: "Address" },
  { id: "verify", name: "Verify" },
  { id: "plan", name: "Plan Selection" },
  { id: "payment", name: "Payment" },
  { id: "confirm", name: "Confirmation" },
]

// Mock address search results
const mockAddressResults = [
  {
    id: "1",
    fullAddress: "123 Main St, Orlando, FL 32801",
    streetAddress: "123 Main St",
    city: "Orlando",
    state: "FL",
    zipCode: "32801",
  },
  {
    id: "2",
    fullAddress: "456 Oak Ave, Miami, FL 33101",
    streetAddress: "456 Oak Ave",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
  },
  {
    id: "3",
    fullAddress: "789 Pine Blvd, Tampa, FL 33602",
    streetAddress: "789 Pine Blvd",
    city: "Tampa",
    state: "FL",
    zipCode: "33602",
  },
  {
    id: "4",
    fullAddress: "101 Beach Dr, Jacksonville, FL 32202",
    streetAddress: "101 Beach Dr",
    city: "Jacksonville",
    state: "FL",
    zipCode: "32202",
  },
  {
    id: "5",
    fullAddress: "555 Palm St, Naples, FL 34102",
    streetAddress: "555 Palm St",
    city: "Naples",
    state: "FL",
    zipCode: "34102",
  },
]

interface AddressResult {
  id: string
  fullAddress: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

export default function AddressInformationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()
  const addressInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Form state
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)

  // Track which fields have been touched (interacted with)
  const [touchedFields, setTouchedFields] = useState({
    address1: false,
    city: false,
    state: false,
    zipCode: false,
  })

  // Track if form submission has been attempted
  const [submissionAttempted, setSubmissionAttempted] = useState(false)

  // Address search state
  const [searchResults, setSearchResults] = useState<AddressResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [originalZipCode, setOriginalZipCode] = useState("")
  const [zipCodeMismatch, setZipCodeMismatch] = useState(false)

  // Form errors
  const [errors, setErrors] = useState({
    address1: false,
    city: false,
    state: false,
    zipCode: false,
  })

  // Load pre-filled data from session storage
  useEffect(() => {
    const storedAddress1 = sessionStorage.getItem("address1")
    const storedAddress2 = sessionStorage.getItem("address2")
    const storedCity = sessionStorage.getItem("city")
    const storedState = sessionStorage.getItem("state")
    const storedZipCode = sessionStorage.getItem("zipCode")

    // Get the original ZIP code from the ZIP code form
    // This is the ZIP code entered at the beginning of the process
    const quoteZipCode = sessionStorage.getItem("zipCode") || "33055" // Default for demo
    setOriginalZipCode(quoteZipCode)
    console.log("Original ZIP code loaded:", quoteZipCode)

    if (storedAddress1) setAddress1(storedAddress1)
    if (storedAddress2) setAddress2(storedAddress2)
    if (storedCity) setCity(storedCity)
    if (storedState) setState(storedState)
    if (storedZipCode) {
      setZipCode(storedZipCode)
      // Check for mismatch on initial load
      if (storedZipCode !== quoteZipCode) {
        console.log("ZIP code mismatch on load:", { stored: storedZipCode, original: quoteZipCode })
        setZipCodeMismatch(true)
      }
    }
  }, [])

  // Validate form whenever fields change
  useEffect(() => {
    validateForm()
  }, [address1, city, state, zipCode])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const validateForm = () => {
    const zipRegex = /^\d{5}$/

    const newErrors = {
      address1: !address1.trim(),
      city: !city.trim(),
      state: !state.trim(),
      zipCode: !zipCode.trim() || !zipRegex.test(zipCode),
    }

    setErrors(newErrors)

    // Set form validity based on errors
    const isValid = !Object.values(newErrors).some(Boolean)
    setFormIsValid(isValid)

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched and set submission attempted to true
    setTouchedFields({
      address1: true,
      city: true,
      state: true,
      zipCode: true,
    })
    setSubmissionAttempted(true)

    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save data to session storage
      sessionStorage.setItem("address1", address1)
      sessionStorage.setItem("address2", address2)
      sessionStorage.setItem("city", city)
      sessionStorage.setItem("state", state)
      sessionStorage.setItem("zipCode", zipCode)

      // Show success toast
      toast({
        title: "Address Saved",
        description: "Your address information has been saved successfully",
      })

      // Redirect to the next step
      router.push(`/enroll/ssn-information?planId=${planId}`)
    } catch (error) {
      console.error("Error saving address information:", error)
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
    router.push(`/enroll/contact-information?planId=${planId}`)
  }

  const handleAddressSearch = (query: string) => {
    setAddress1(query)

    // Mark address1 as touched when user interacts with it
    setTouchedFields((prev) => ({
      ...prev,
      address1: true,
    }))

    if (query.length < 3) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      // Filter mock results based on query
      const filteredResults = mockAddressResults.filter((address) =>
        address.fullAddress.toLowerCase().includes(query.toLowerCase()),
      )

      setSearchResults(filteredResults)
      setShowResults(true)
      setIsSearching(false)
    }, 500)
  }

  const handleAddressSelect = (address: AddressResult) => {
    // Update form fields
    setAddress1(address.streetAddress)
    setCity(address.city)
    setState(address.state)
    setZipCode(address.zipCode)

    // Mark all fields as touched when an address is selected
    setTouchedFields({
      address1: true,
      city: true,
      state: true,
      zipCode: true,
    })

    // Hide results
    setShowResults(false)

    console.log("ZIP Code comparison on address select:", {
      selectedZip: address.zipCode,
      originalZip: originalZipCode,
      match: address.zipCode === originalZipCode,
    })

    // Check if selected zip code matches original zip code
    if (originalZipCode && address.zipCode !== originalZipCode) {
      console.log("Setting ZIP code mismatch to true")
      setZipCodeMismatch(true)
    } else {
      setZipCodeMismatch(false)
    }
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const value = e.target.value.replace(/\D/g, "")

    // Restrict to 5 digits
    const newZipCode = value.slice(0, 5)
    setZipCode(newZipCode)

    // Mark zipCode as touched when user interacts with it
    setTouchedFields((prev) => ({
      ...prev,
      zipCode: true,
    }))

    // Check for zip code mismatch when we have a complete ZIP code
    if (newZipCode.length === 5) {
      console.log("ZIP Code comparison on manual entry:", {
        enteredZip: newZipCode,
        originalZip: originalZipCode,
        match: newZipCode === originalZipCode,
      })

      if (originalZipCode && newZipCode !== originalZipCode) {
        console.log("Setting ZIP code mismatch to true")
        setZipCodeMismatch(true)
      } else {
        setZipCodeMismatch(false)
      }
    }
  }

  // Handle field blur (when user leaves a field)
  const handleBlur = (field: "address1" | "city" | "state" | "zipCode") => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  // Handle field change for city and state
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: "city" | "state") => {
    if (field === "city") {
      setCity(e.target.value)
    } else {
      setState(e.target.value)
    }

    // Mark field as touched when user interacts with it
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const dismissZipCodeWarning = () => {
    setZipCodeMismatch(false)
  }

  // Helper function to determine if an error should be shown
  const shouldShowError = (field: "address1" | "city" | "state" | "zipCode") => {
    return (touchedFields[field] || submissionAttempted) && errors[field]
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contact Information
          </Button>

          {/* Progress Stepper */}
          <Stepper steps={enrollmentSteps} currentStep="address" className="mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header with Birdy AI Button */}
            <div className="relative mb-8">
              <div className="absolute top-[-40px] right-[-20px]">
                <BirdyAIFloatingButton
                  title="Address Information Help"
                  explanation="Get instant answers about providing your address information for health insurance enrollment."
                  tips={[
                    "Learn why we need your address information",
                    "Get help with filling out address information",
                    "Understand how your address affects your coverage",
                    "Learn about address verification",
                  ]}
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Address Information</h1>
                <p className="text-gray-500">Please provide your address details to continue with your enrollment</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Address Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Home className="mr-2 h-5 w-5 text-purple-500" />
                  Address Information
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {/* Street Address with Search */}
                  <div className="space-y-2 relative">
                    <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="address1"
                        ref={addressInputRef}
                        value={address1}
                        onChange={(e) => handleAddressSearch(e.target.value)}
                        onBlur={() => handleBlur("address1")}
                        onFocus={() => {
                          if (address1.length >= 3) {
                            setShowResults(true)
                          }
                        }}
                        className={`pl-10 ${shouldShowError("address1") ? "border-red-500" : ""}`}
                        placeholder="Start typing for address suggestions"
                        autoComplete="off"
                      />
                      {isSearching && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                        </div>
                      )}
                    </div>
                    {shouldShowError("address1") && (
                      <p className="text-red-500 text-xs">Please enter your street address</p>
                    )}

                    {/* Address Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
                      >
                        <ul className="py-1">
                          {searchResults.map((result) => (
                            <li
                              key={result.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => handleAddressSelect(result)}
                            >
                              <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <span className="text-sm">{result.fullAddress}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Apartment/Unit */}
                  <div className="space-y-2">
                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                      Apartment/Unit (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        className="pl-10"
                        placeholder="Apt #, Suite, Unit, etc."
                      />
                    </div>
                  </div>

                  {/* City, State, ZIP Code in a row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* City */}
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => handleFieldChange(e, "city")}
                          onBlur={() => handleBlur("city")}
                          className={`pl-10 ${shouldShowError("city") ? "border-red-500" : ""}`}
                          placeholder="City"
                        />
                      </div>
                      {shouldShowError("city") && <p className="text-red-500 text-xs">Please enter your city</p>}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => handleFieldChange(e, "state")}
                        onBlur={() => handleBlur("state")}
                        className={shouldShowError("state") ? "border-red-500" : ""}
                        placeholder="State"
                      />
                      {shouldShowError("state") && <p className="text-red-500 text-xs">Please enter your state</p>}
                    </div>

                    {/* ZIP Code */}
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={handleZipCodeChange}
                          onBlur={() => handleBlur("zipCode")}
                          className={`pl-10 ${shouldShowError("zipCode") ? "border-red-500" : ""}`}
                          placeholder="ZIP Code"
                          maxLength={5}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </div>
                      {shouldShowError("zipCode") && (
                        <p className="text-red-500 text-xs">Please enter a valid 5-digit ZIP code</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* ZIP Code Mismatch Warning - Now positioned above the Continue button */}
              {zipCodeMismatch && (
                <div className="bg-amber-50 border border-amber-500 p-4 rounded-md shadow-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h3 className="text-sm font-bold text-amber-800">ZIP Code Mismatch Warning</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          The ZIP code you've entered (<strong>{zipCode}</strong>) does not match the ZIP code used for
                          your original quote (<strong>{originalZipCode}</strong>).
                        </p>
                        <p className="mt-2 font-medium">
                          This may affect plan availability and pricing. You may need to get a new quote.
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={dismissZipCodeWarning}
                          className="inline-flex rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-50"
                        >
                          <span className="sr-only">Dismiss</span>
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
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
    </>
  )
}
