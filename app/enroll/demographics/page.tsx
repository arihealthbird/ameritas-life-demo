// Replace the entire component with a simplified version

"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SimpleHeader from "@/components/SimpleHeader"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

export default function DemographicsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const { toast } = useToast()

  // Form state
  const [hispanicOrigin, setHispanicOrigin] = useState("")
  const [race, setRace] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if form is valid (both questions answered)
  const isFormValid = hispanicOrigin !== "" && race !== ""

  // Load pre-filled data from session storage if available
  useEffect(() => {
    try {
      const storedHispanicOrigin = sessionStorage.getItem("hispanicOrigin")
      const storedRace = sessionStorage.getItem("race")

      if (storedHispanicOrigin) setHispanicOrigin(storedHispanicOrigin)
      if (storedRace) setRace(storedRace)
    } catch (error) {
      console.error("Error loading from session storage:", error)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Don't submit if form is invalid
    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      // Save data to session storage
      sessionStorage.setItem("hispanicOrigin", hispanicOrigin)
      sessionStorage.setItem("race", race)

      // Show success toast
      toast({
        title: "Information Saved",
        description: "Your demographic information has been saved",
      })

      // Redirect to the income page
      router.push(`/enroll/income${planId ? `?planId=${planId}` : ""}`)
    } catch (error) {
      console.error("Error saving demographic information:", error)
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
    router.push(`/enroll/incarceration-status${planId ? `?planId=${planId}` : ""}`)
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-purple-600 mb-2">Demographics</h1>
              <p className="text-gray-500">
                Please provide your demographic information to continue with your enrollment
              </p>
              <p className="text-xs text-gray-400 mt-1">
                This information is optional and used for statistical purposes only
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Hispanic Origin Question */}
                    <div className="space-y-2">
                      <Label htmlFor="hispanic-origin" className="text-base">
                        Are you of Hispanic or Latino origin?
                      </Label>
                      <Select value={hispanicOrigin} onValueChange={setHispanicOrigin}>
                        <SelectTrigger id="hispanic-origin" className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="decline">Decline to answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Race and Ethnicity Question */}
                    <div className="space-y-2">
                      <Label htmlFor="race" className="text-base">
                        Race and ethnicity
                      </Label>
                      <Select value={race} onValueChange={setRace}>
                        <SelectTrigger id="race" className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="decline">Decline to answer</SelectItem>
                          <SelectItem value="american-indian">American Indian/Alaskan Native</SelectItem>
                          <SelectItem value="asian-indian">Asian Indian</SelectItem>
                          <SelectItem value="black">Black or African American</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="filipino">Filipino</SelectItem>
                          <SelectItem value="guamanian">Guamanian or Chamorro</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                          <SelectItem value="native-hawaiian">Native Hawaiian</SelectItem>
                          <SelectItem value="samoan">Samoan</SelectItem>
                          <SelectItem value="vietnamese">Vietnamese</SelectItem>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="asian-other">Asian Race not listed above</SelectItem>
                          <SelectItem value="pacific-islander-other">Pacific Islander Race not listed above</SelectItem>
                          <SelectItem value="other">Race not listed above</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form completion status */}
              {!isFormValid && (
                <div className="text-center text-amber-600 text-sm">Please answer both questions to continue</div>
              )}

              {/* Submit Button - Conditionally enabled */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
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
