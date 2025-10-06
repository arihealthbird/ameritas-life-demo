"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FormActions } from "@/components/FormActions"
import { TobaccoInfoCard } from "@/components/TobaccoInfoCard"
import { DateInputField } from "@/components/DateInputField"
import { useToast } from "@/hooks/use-toast"

interface TobaccoUsageFormProps {
  applicantType: "primary" | "spouse" | "dependent"
  applicantName?: string
  initialTobaccoUser?: boolean
  initialLastUsedDate?: string
  onSave: (data: { isTobaccoUser: boolean; lastUsedDate?: string }) => void
  onBack: () => void
  onSkip?: () => void
  canSkip?: boolean
}

export function TobaccoUsageForm({
  applicantType,
  applicantName,
  initialTobaccoUser = false,
  initialLastUsedDate = "",
  onSave,
  onBack,
  onSkip,
  canSkip = false,
}: TobaccoUsageFormProps) {
  const [isTobaccoUser, setIsTobaccoUser] = useState<boolean>(initialTobaccoUser)
  const [lastUsedDate, setLastUsedDate] = useState<string>(initialLastUsedDate)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Form is valid if either not a tobacco user, or if a tobacco user and has a last used date
    setIsFormValid(!isTobaccoUser || (isTobaccoUser && !!lastUsedDate))
  }, [isTobaccoUser, lastUsedDate])

  const handleSubmit = () => {
    if (!isFormValid) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields.",
        variant: "destructive",
      })
      return
    }

    onSave({
      isTobaccoUser,
      lastUsedDate: isTobaccoUser ? lastUsedDate : undefined,
    })
  }

  const getQuestionText = () => {
    if (applicantType === "primary") {
      return "Have you used tobacco 4 or more times a week in the past 6 months?"
    } else if (applicantType === "spouse") {
      return `Has your spouse${applicantName ? ` (${applicantName})` : ""} used tobacco 4 or more times a week in the past 6 months?`
    } else {
      return `Has ${applicantName || "this dependent"} used tobacco 4 or more times a week in the past 6 months?`
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tobacco Usage</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">{getQuestionText()}</h2>
              <RadioGroup
                value={isTobaccoUser ? "yes" : "no"}
                onValueChange={(value) => setIsTobaccoUser(value === "yes")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="tobacco-yes" />
                  <Label htmlFor="tobacco-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="tobacco-no" />
                  <Label htmlFor="tobacco-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {isTobaccoUser && (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  When did{" "}
                  {applicantType === "primary"
                    ? "you"
                    : applicantType === "spouse"
                      ? "your spouse"
                      : applicantName || "this dependent"}{" "}
                  last use tobacco products?
                </h2>
                <DateInputField
                  value={lastUsedDate}
                  onChange={setLastUsedDate}
                  placeholder="MM/DD/YYYY"
                  maxDate={new Date()}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TobaccoInfoCard />

      <FormActions
        onBack={onBack}
        onNext={handleSubmit}
        nextDisabled={!isFormValid}
        onSkip={canSkip ? onSkip : undefined}
      />
    </div>
  )
}
