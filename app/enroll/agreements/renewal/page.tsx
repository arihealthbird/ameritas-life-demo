"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AgreementLayout from "@/components/agreements/AgreementLayout"
import AgreementStatement from "@/components/agreements/AgreementStatement"

export default function RenewalAgreementPage() {
  const [agreement, setAgreement] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")

  // Load saved agreement from session storage on mount
  useEffect(() => {
    const savedAgreement = sessionStorage.getItem("renewalAgreement")
    if (savedAgreement) {
      setAgreement(savedAgreement)
    }
  }, [])

  const handleAgreementChange = (id: string, value: string) => {
    setAgreement(value)

    // Save to session storage
    sessionStorage.setItem("renewalAgreement", value)
  }

  const renewalStatement = `To make it easier to determine my eligibility for help paying for coverage in future years, I agree to allow the Marketplace to use my income data, including information from tax returns, for the next 5 years. The Marketplace will send me a notice, let me make any changes, and I can opt out at any time.`

  return (
    <AgreementLayout
      title="Renewal of Eligibility"
      description="Please read and acknowledge the following statement"
      currentStep="agreements"
      backPath={`/enroll/review?planId=${planId}`}
      nextPath="/enroll/agreements/tax-attestation"
      isNextDisabled={agreement !== "agree"}
    >
      <AgreementStatement
        statement={renewalStatement}
        id="renewal"
        onChange={handleAgreementChange}
        value={agreement}
      />
    </AgreementLayout>
  )
}
