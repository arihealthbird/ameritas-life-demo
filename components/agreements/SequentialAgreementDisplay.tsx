"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AgreementStatement from "./AgreementStatement"
import { motion, AnimatePresence } from "framer-motion"

interface Agreement {
  id: string
  statement: string
}

interface SequentialAgreementDisplayProps {
  agreements: Agreement[]
  onChange: (values: Record<string, string>) => void
  values: Record<string, string>
}

export default function SequentialAgreementDisplay({ agreements, onChange, values }: SequentialAgreementDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Find the first unanswered statement index on initial load
  useEffect(() => {
    const firstUnansweredIndex = agreements.findIndex((agreement) => !values[agreement.id])
    if (firstUnansweredIndex !== -1) {
      setCurrentIndex(firstUnansweredIndex)
    }
  }, [])

  const handleAgreementChange = (id: string, value: string) => {
    const newValues = { ...values, [id]: value }
    onChange(newValues)

    // If agreed and there's a next statement, automatically advance after a short delay
    if (value === "agree" && currentIndex < agreements.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 500)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < agreements.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const currentAgreement = agreements[currentIndex]
  const isFirstStatement = currentIndex === 0
  const isLastStatement = currentIndex === agreements.length - 1

  // Calculate progress
  const answeredCount = Object.keys(values).filter((key) => values[key] === "agree").length
  const progress = Math.round((answeredCount / agreements.length) * 100)

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Statement {currentIndex + 1} of {agreements.length}
          </span>
          <span>{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Statement display with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAgreement.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AgreementStatement
            statement={currentAgreement.statement}
            id={currentAgreement.id}
            onChange={handleAgreementChange}
            value={values[currentAgreement.id] || ""}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={isFirstStatement}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={goToNext}
          disabled={isLastStatement || !values[currentAgreement.id]}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
