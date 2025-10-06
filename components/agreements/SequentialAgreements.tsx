"use client"

import { useState, useEffect } from "react"
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import AgreementStatement from "./AgreementStatement"

interface Agreement {
  id: string
  statement: string
}

interface SequentialAgreementsProps {
  agreements: Agreement[]
  onChange: (values: Record<string, string>) => void
  values: Record<string, string>
}

export default function SequentialAgreements({ agreements, onChange, values }: SequentialAgreementsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Initialize the first agreement as expanded
  useEffect(() => {
    if (agreements.length > 0) {
      setExpanded({ [agreements[0].id]: true })
    }
  }, [agreements])

  const handleAgreementChange = (id: string, value: string) => {
    const newValues = { ...values, [id]: value }
    onChange(newValues)

    // If agreed, show the next agreement if available
    if (value === "agree") {
      const currentIdx = agreements.findIndex((a) => a.id === id)
      if (currentIdx < agreements.length - 1) {
        const nextId = agreements[currentIdx + 1].id
        setExpanded((prev) => ({ ...prev, [nextId]: true }))
        setCurrentIndex(currentIdx + 1)
      }
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isAgreed = (id: string) => values[id] === "agree"

  const allAgreed = agreements.every((agreement) => isAgreed(agreement.id))

  return (
    <div className="space-y-4">
      {agreements.map((agreement, index) => {
        const isCurrentOrCompleted = index <= currentIndex
        const isExpanded = expanded[agreement.id] || false

        return (
          <div
            key={agreement.id}
            className={`border ${isAgreed(agreement.id) ? "border-green-200" : "border-gray-200"} rounded-lg overflow-hidden transition-all ${isCurrentOrCompleted ? "opacity-100" : "opacity-60"}`}
          >
            <div
              className={`p-4 flex justify-between items-center cursor-pointer ${isAgreed(agreement.id) ? "bg-green-50" : "bg-white"}`}
              onClick={() => isCurrentOrCompleted && toggleExpand(agreement.id)}
            >
              <div className="flex items-center">
                <span className="font-medium mr-2">Statement {index + 1}</span>
                {isAgreed(agreement.id) && (
                  <span className="text-green-600 flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Agreed
                  </span>
                )}
              </div>
              {isCurrentOrCompleted &&
                (isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ))}
            </div>

            {isExpanded && (
              <div className="p-4 border-t border-gray-200">
                <AgreementStatement
                  statement={agreement.statement}
                  id={agreement.id}
                  onChange={handleAgreementChange}
                  value={values[agreement.id] || ""}
                />
              </div>
            )}
          </div>
        )
      })}

      {allAgreed && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="flex items-center justify-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">All statements acknowledged</span>
          </div>
        </div>
      )}
    </div>
  )
}
