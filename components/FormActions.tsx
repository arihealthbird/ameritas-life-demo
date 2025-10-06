"use client"

import type React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormActionsProps {
  isSubmitting: boolean
  isDisabled?: boolean
  onNext?: () => void
  onBack?: () => void
  onSkip?: () => void
  nextText?: string
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  isDisabled = false,
  onNext,
  onBack,
  onSkip,
  nextText = "Continue to Next Step",
}) => {
  return (
    <div className="pt-4 flex justify-between">
      <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
        Back
      </Button>
      <Button
        type="button"
        disabled={isSubmitting || isDisabled}
        className={cn(
          "bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        onClick={onNext}
      >
        {isSubmitting ? "Processing..." : nextText}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default FormActions
