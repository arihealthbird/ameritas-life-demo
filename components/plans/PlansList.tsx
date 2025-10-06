"use client"

import type React from "react"
import { useState } from "react"
import PlanCard from "./PlanCard"
import type { InsurancePlan } from "@/types/plans"

interface PlansListProps {
  plans: InsurancePlan[]
  sortOption: string
  onToggleCompare: (planId: string) => void // Added onToggleCompare prop
}

const PlansList: React.FC<PlansListProps> = ({ plans, sortOption, onToggleCompare }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [plansToCompare, setPlansToCompare] = useState<string[]>([])

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleEnrollPlan = (planId: string) => {
    // In a real app, this would navigate to enrollment
    console.log(`Enrolling in plan: ${planId}`)
    setSelectedPlan(planId)
  }

  return (
    <div className="space-y-6">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          selectedPlan={selectedPlan}
          onSelectPlan={handleSelectPlan}
          onEnrollPlan={handleEnrollPlan}
          sortOption={sortOption}
          plansToCompare={plansToCompare}
          onToggleCompare={onToggleCompare} // Pass onToggleCompare to PlanCard
        />
      ))}
    </div>
  )
}

export default PlansList
