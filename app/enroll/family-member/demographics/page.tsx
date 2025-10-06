"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"
import { getFamilyMemberById, updateFamilyMember } from "@/utils/familyMemberUtils"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function FamilyMemberDemographicsPage() {
  const [hispanicOrigin, setHispanicOrigin] = useState<string>("")
  const [race, setRace] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const familyMemberId = searchParams.get("familyMemberId") || ""
  const planId = searchParams.get("planId") || ""
  const memberType = (searchParams.get("type") as "spouse" | "dependent") || "dependent"

  // Check if form is valid (both questions answered)
  const isFormValid = useMemo(() => {
    return hispanicOrigin !== "" && race !== ""
  }, [hispanicOrigin, race])

  // Prefetch the next page to speed up navigation
  useEffect(() => {
    // Construct the next page URL
    const nextPageUrl = `/enroll/family-member/income?planId=${encodeURIComponent(planId)}&familyMemberId=${encodeURIComponent(familyMemberId)}&type=${encodeURIComponent(memberType)}`

    // Prefetch the next page
    router.prefetch(nextPageUrl)
  }, [router, planId, familyMemberId, memberType])

  useEffect(() => {
    // Load family member data
    if (familyMemberId) {
      const member = getFamilyMemberById(familyMemberId)
      if (member) {
        if (member.hispanicOrigin) setHispanicOrigin(member.hispanicOrigin)
        if (member.race) setRace(member.race)
      }
    }

    // Simulate a smooth transition in
    setTimeout(() => {
      setLoading(false)
    }, 300)

    // Mark page as fully ready after a short delay
    setTimeout(() => {
      setPageReady(true)
    }, 500)
  }, [familyMemberId])

  // Optimized navigation with transition
  const navigateToNextPage = () => {
    // Start transition animation
    setIsTransitioning(true)

    // Construct the URL with all necessary parameters
    const nextUrl = `/enroll/family-member/income?planId=${encodeURIComponent(planId)}&familyMemberId=${encodeURIComponent(familyMemberId)}&type=${encodeURIComponent(memberType)}`

    // Use Next.js router for client-side navigation
    setTimeout(() => {
      router.push(nextUrl)
    }, 100) // Short delay to allow transition to start
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Don't submit if form is invalid
    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      // Update family member data
      if (familyMemberId) {
        const member = getFamilyMemberById(familyMemberId)
        if (member) {
          const updatedMember = {
            ...member,
            hispanicOrigin,
            race,
          }
          updateFamilyMember(updatedMember)
        }
      }

      // Show success toast
      toast({
        title: "Information Saved",
        description: `${memberType === "spouse" ? "Spouse" : "Dependent"} demographics information has been saved successfully`,
      })

      // Use optimized navigation
      navigateToNextPage()
    } catch (error) {
      console.error("Error saving demographics information:", error)
      toast({
        title: "Error",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Get the previous step for the back button
  const backUrl = `/enroll/family-member/incarceration-status?planId=${planId}&familyMemberId=${familyMemberId}&type=${memberType}`
  const backText = "Back to Incarceration Status"

  // Create the next page URL for prefetching
  const nextPageUrl = `/enroll/family-member/income?planId=${encodeURIComponent(planId)}&familyMemberId=${encodeURIComponent(familyMemberId)}&type=${encodeURIComponent(memberType)}`

  return (
    <>
      {/* Prefetch link for the next page */}
      <Link href={nextPageUrl} prefetch={true} className="hidden" />

      <div
        className={`page-transition ${isTransitioning ? "page-transition-exit" : ""} ${pageReady ? "opacity-100" : "opacity-0"}`}
      >
        <FamilyMemberEnrollmentLayout
          currentStep="demographics"
          title={`${memberType === "spouse" ? "Spouse" : "Dependent"} Demographics Information`}
          description={`Please provide your ${memberType === "spouse" ? "spouse's" : "dependent's"} demographics information`}
          aiTitle={`${memberType === "spouse" ? "Spouse" : "Dependent"} Demographics Information Help`}
          aiExplanation={`Get instant answers about providing your ${memberType === "spouse" ? "spouse's" : "dependent's"} demographics information for health insurance enrollment.`}
          aiTips={[
            `Learn why we collect ${memberType === "spouse" ? "spouse" : "dependent"} demographics information`,
            "Understand how this information is used",
            "Learn about privacy protections for your information",
            "Get help with demographics questions",
          ]}
          backUrl={backUrl}
          backText={backText}
          showSkip={false}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Hispanic Origin Question */}
                  <div className="space-y-2">
                    <Label htmlFor="hispanic-origin" className="text-base">
                      Is this person of Hispanic or Latino origin?
                    </Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full rounded" />
                    ) : (
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
                    )}
                  </div>

                  {/* Race and Ethnicity Question */}
                  <div className="space-y-2">
                    <Label htmlFor="race" className="text-base">
                      Race and ethnicity
                    </Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full rounded" />
                    ) : (
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
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form completion status */}
            {!isFormValid && !loading && (
              <div className="text-center text-amber-600 text-sm">Please answer both questions to continue</div>
            )}

            {/* Submit button - Conditionally enabled */}
            <div className="pt-4 flex justify-center">
              {loading ? (
                <Skeleton className="h-14 w-full md:w-2/3 rounded-full" />
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-6 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || isTransitioning ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>{isSubmitting ? "Saving..." : "Loading..."}</span>
                    </div>
                  ) : (
                    <>
                      Continue to Next Step
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FamilyMemberEnrollmentLayout>
      </div>
    </>
  )
}
