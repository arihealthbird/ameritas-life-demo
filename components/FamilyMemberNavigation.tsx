"use client"

import { useRouter } from "next/navigation"

type FamilyMemberNavigationProps = {
  currentPage: string
  memberId: string
  memberType: string
  memberName: string
  tobaccoUser?: boolean
}

export function FamilyMemberNavigation({
  currentPage,
  memberId,
  memberType,
  memberName,
  tobaccoUser = false,
}: FamilyMemberNavigationProps) {
  const router = useRouter()

  // Define the enrollment flow pages
  const pages = [
    "personal-information",
    "contact-information",
    "address-information",
    "ssn-information",
    "citizenship-information",
    "incarceration-status",
    "demographics",
    "income",
    ...(tobaccoUser ? ["tobacco-usage"] : []),
  ]

  const currentIndex = pages.indexOf(currentPage)

  const navigateToNextPage = () => {
    if (currentIndex < pages.length - 1) {
      // Navigate to the next page in the flow
      const nextPage = pages[currentIndex + 1]
      router.push(
        `/enroll/family-member/${nextPage}?id=${memberId}&type=${memberType}&name=${encodeURIComponent(memberName)}`,
      )
    } else {
      // End of flow, navigate to review page
      router.push("/enroll/review")
    }
  }

  const navigateToPreviousPage = () => {
    if (currentIndex > 0) {
      // Navigate to the previous page in the flow
      const prevPage = pages[currentIndex - 1]
      router.push(
        `/enroll/family-member/${prevPage}?id=${memberId}&type=${memberType}&name=${encodeURIComponent(memberName)}`,
      )
    } else {
      // Beginning of flow, navigate back to main flow
      router.push("/enroll/income")
    }
  }

  return {
    navigateToNextPage,
    navigateToPreviousPage,
    isFirstPage: currentIndex === 0,
    isLastPage: currentIndex === pages.length - 1,
    currentStep: currentIndex + 1,
    totalSteps: pages.length,
  }
}
