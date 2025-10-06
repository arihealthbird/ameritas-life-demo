"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type TobaccoUsageRouterProps = {
  memberId: string
  memberType: string
  memberName: string
}

export function TobaccoUsageRouter({ memberId, memberType, memberName }: TobaccoUsageRouterProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would determine if the tobacco page is needed
    // based on age, state regulations, etc.
    const checkTobaccoPageNeeded = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demonstration purposes, we'll use age as a factor
        // In a real app, this would be based on actual rules
        const isTobaccoPageNeeded = true // Simplified for this example

        if (isTobaccoPageNeeded) {
          router.push(
            `/enroll/family-member/tobacco-usage?id=${memberId}&type=${memberType}&name=${encodeURIComponent(memberName)}`,
          )
        } else {
          // Skip to review if tobacco page not needed
          router.push("/enroll/review")
        }
      } catch (error) {
        console.error("Error checking tobacco page requirement:", error)
        // Default to showing the page in case of error
        router.push(
          `/enroll/family-member/tobacco-usage?id=${memberId}&type=${memberType}&name=${encodeURIComponent(memberName)}`,
        )
      } finally {
        setIsLoading(false)
      }
    }

    checkTobaccoPageNeeded()
  }, [memberId, memberType, memberName, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return null
}
