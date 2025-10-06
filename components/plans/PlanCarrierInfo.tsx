"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InsurancePlan } from "@/types/plans"

interface PlanCarrierInfoProps {
  plan: InsurancePlan
  className?: string
}

export default function PlanCarrierInfo({ plan, className }: PlanCarrierInfoProps) {
  // Create the abbreviation for the carrier
  const getCarrierAbbreviation = (carrier: string) => {
    const words = carrier.split(" ")
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center mb-1">
        <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center mr-2 text-purple-700 font-bold">
          {getCarrierAbbreviation(plan.carrier)}
        </div>
        <h3 className="font-semibold text-gray-900">{plan.carrier}</h3>
      </div>

      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={cn("mr-0.5", i < Math.floor(plan.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200")}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{plan.rating.toFixed(1)}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            plan.metalLevel.toLowerCase() === "gold"
              ? "bg-yellow-100 text-yellow-800"
              : plan.metalLevel.toLowerCase() === "silver"
                ? "bg-gray-200 text-gray-800"
                : plan.metalLevel.toLowerCase() === "bronze"
                  ? "bg-amber-100 text-amber-800"
                  : plan.metalLevel.toLowerCase() === "platinum"
                    ? "bg-gray-700 text-white"
                    : "bg-blue-100 text-blue-800",
          )}
        >
          {plan.metalLevel}
        </span>
        <span className="text-xs text-gray-500">{plan.planType}</span>
      </div>

      <div className="text-xs text-gray-500">
        {plan.carrier} {plan.metalLevel} {plan.planType} {plan.id.substring(0, 4)}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
            plan.coversDoctors ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500",
          )}
        >
          {plan.coversDoctors ? (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 13L9 17L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>Doctors</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
            plan.coversMedications ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500",
          )}
        >
          {plan.coversMedications ? (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 13L9 17L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>Medications</span>
        </div>
      </div>
    </div>
  )
}
