"use client"

import type React from "react"
import HouseholdSizeCounter from "./HouseholdSizeCounter"

interface HouseholdSizeSectionProps {
  householdSize: number
  onIncrement: () => void
  onDecrement: () => void
  initialHouseholdSize?: number
}

const HouseholdSizeSection: React.FC<HouseholdSizeSectionProps> = ({
  householdSize,
  onIncrement,
  onDecrement,
  initialHouseholdSize = 1,
}) => {
  return (
    <div>
      <HouseholdSizeCounter
        householdSize={householdSize}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        initialHouseholdSize={initialHouseholdSize}
      />
    </div>
  )
}

export default HouseholdSizeSection
