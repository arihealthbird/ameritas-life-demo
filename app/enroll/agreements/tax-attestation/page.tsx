"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AgreementLayout from "@/components/agreements/AgreementLayout"
import SequentialAgreementDisplay from "@/components/agreements/SequentialAgreementDisplay"

export default function TaxAttestationPage() {
  const [agreements, setAgreements] = useState<Record<string, string>>({})
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const taxYear = currentYear + 1

  // Tax attestation statements
  const taxStatements = [
    {
      id: "tax-eligibility",
      statement: `I understand that I'm not eligible for a premium tax credit if I'm found eligible for other qualifying health coverage, like Medicaid, Children's Health Insurance Program (CHIP), or a job-based health plan. I also understand that if I become eligible for other qualifying health coverage, I must contact the Marketplace to end my Marketplace coverage and premium tax credit. If I don't, the person who files taxes in my household may need to pay back my premium tax credit.`,
    },
    {
      id: "tax-filing",
      statement: `I understand that because the premium tax credit will be paid on my behalf to reduce the cost of health coverage for myself and/or my dependents: I must file a federal income tax return for the ${taxYear} tax year. If I'm married at the end of ${taxYear}, I must file a joint income tax return with my spouse.`,
    },
    {
      id: "tax-dependent",
      statement: `I also expect that: No one else will be able to claim me as a dependent on their ${taxYear} federal income tax return. I'll claim a personal exemption deduction on my ${taxYear} federal income tax return for any individual listed on this application as my dependent who is enrolled in coverage through this Marketplace, and whose premium for coverage is paid in whole or in part by advance payments of the premium tax credit.`,
    },
    {
      id: "tax-changes",
      statement: `If any of the above changes: I understand that it may impact my ability to get the premium tax credit. I also understand that when I file my ${taxYear} federal income tax return, the Internal Revenue Service (IRS) will compare the income on my tax return with the income on my application. I understand that if the income on my tax return is lower than the amount of income on my application, I may be eligible to get an additional premium tax credit amount. On the other hand, if the income on my tax return is higher than the amount of income on my application, I may owe additional federal income tax.`,
    },
  ]

  // Check if all agreements are agreed to
  const allAgreed = taxStatements.every((statement) => agreements[statement.id] === "agree")

  const handleAgreementChange = (values: Record<string, string>) => {
    setAgreements(values)

    // Save to session storage
    sessionStorage.setItem("taxAgreements", JSON.stringify(values))
  }

  // Load saved agreements from session storage on mount
  useEffect(() => {
    const savedAgreements = sessionStorage.getItem("taxAgreements")
    if (savedAgreements) {
      try {
        setAgreements(JSON.parse(savedAgreements))
      } catch (e) {
        console.error("Error parsing saved agreements:", e)
      }
    }
  }, [])

  return (
    <AgreementLayout
      title="Tax Attestation"
      description="Please read and acknowledge each of the following statements"
      currentStep="agreements"
      backPath="/enroll/agreements/renewal"
      nextPath="/enroll/agreements/sign-submit"
      isNextDisabled={!allAgreed}
    >
      <SequentialAgreementDisplay agreements={taxStatements} onChange={handleAgreementChange} values={agreements} />
    </AgreementLayout>
  )
}
