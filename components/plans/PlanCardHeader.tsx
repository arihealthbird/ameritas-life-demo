import type React from "react"
import type { InsurancePlan } from "@/types/plans"
import { getRankingReason } from "@/utils/planCardUtils"
import RankBadge from "./rank-explanations/RankBadge"

interface PlanCardHeaderProps {
  plan: InsurancePlan
}

const PlanCardHeader: React.FC<PlanCardHeaderProps> = ({ plan }) => {
  const rankingReason = getRankingReason(plan)

  return (
    <div className="flex justify-between items-start mb-4">
      {plan.rank && rankingReason ? (
        <div className="flex items-start gap-2">
          <RankBadge rank={plan.rank} plan={plan} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default PlanCardHeader
