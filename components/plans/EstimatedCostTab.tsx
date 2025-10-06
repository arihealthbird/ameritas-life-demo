import { CostProjectionTable } from "./CostProjectionTable"

interface EstimatedCostTabProps {
  planId: string
}

export function EstimatedCostTab({ planId }: EstimatedCostTabProps) {
  return (
    <div className="space-y-4">
      <CostProjectionTable planId={planId} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="font-medium text-yellow-800 text-xs mb-1">Important Note</h4>
        <p className="text-xs text-yellow-700">
          These estimates are based on average costs and your plan's benefits. Actual costs may vary based on specific
          providers, services, and your plan's network.
        </p>
      </div>
    </div>
  )
}
