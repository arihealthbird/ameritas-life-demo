"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TobaccoUsageConditional() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get("id") || ""
  const memberType = searchParams.get("type") || "dependent"
  const memberName = searchParams.get("name") || (memberType === "spouse" ? "Your spouse" : "Your dependent")

  const [isTobaccoUser, setIsTobaccoUser] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // For now, we'll just simulate a delay and random determination
    const fetchTobaccoStatus = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demonstration purposes, randomly determine if tobacco page should be shown
        // In a real app, this would be based on age, state regulations, etc.
        const shouldShowTobaccoPage = Math.random() > 0.5
        setIsTobaccoUser(shouldShowTobaccoPage)

        // If not a tobacco user, skip to the next appropriate page
        if (!shouldShowTobaccoPage) {
          router.push("/enroll/review")
        }
      } catch (error) {
        console.error("Error determining tobacco status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTobaccoStatus()
  }, [memberId, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // This component doesn't render anything if the user is a tobacco user
  // as they will be directed to the tobacco usage page
  return null
}
