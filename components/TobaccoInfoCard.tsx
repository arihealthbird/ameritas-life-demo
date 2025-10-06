"use client"

import type React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TobaccoInfoCardProps {
  variant?: "info" | "warning"
  className?: string
}

export const TobaccoInfoCard: React.FC<TobaccoInfoCardProps> = ({ variant = "info", className }) => {
  const isWarning = variant === "warning"

  return (
    <div
      className={cn(
        "rounded-lg p-4 flex items-start gap-2",
        isWarning ? "bg-amber-50 border border-amber-200" : "bg-blue-50 border border-blue-200",
        className,
      )}
    >
      <AlertCircle className={cn("h-4 w-4 flex-shrink-0", isWarning ? "text-amber-600" : "text-blue-600")} />
      <div className="space-y-1">
        <h4 className={cn("font-medium text-sm", isWarning ? "text-amber-700" : "text-blue-700")}>
          {isWarning ? "Tobacco Usage May Affect Your Premium" : "Tobacco Usage"}
        </h4>
        <p className="text-xs text-gray-700">
          {isWarning
            ? "Health insurance companies may charge higher premiums for tobacco users. Providing accurate information ensures you receive the correct pricing."
            : "Accurate reporting of tobacco usage is essential for determining your eligibility and premium costs."}
        </p>
      </div>
    </div>
  )
}
