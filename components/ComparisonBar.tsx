"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InsurancePlan } from "@/types/plans"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface ComparisonBarProps {
  plansToCompare: string[]
  plans: InsurancePlan[]
  onRemovePlan: (planId: string) => void
  onClearAll: () => void
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ plansToCompare, plans, onRemovePlan }) => {
  const router = useRouter()
  // Get the plan objects for the selected plan IDs
  const selectedPlans = plans.filter((plan) => plansToCompare.includes(plan.id))

  const canCompare = selectedPlans.length >= 2

  const handleCompare = () => {
    if (canCompare) {
      const planIds = selectedPlans.map((plan) => plan.id).join(",")
      router.push(`/plan-comparison?plans=${planIds}`)
    }
  }

  const handleClearAll = () => {
    plansToCompare.forEach((planId) => onRemovePlan(planId))
  }

  return (
    <AnimatePresence>
      {plansToCompare.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-2 bg-gradient-to-r from-purple-600/90 to-pink-500/80 backdrop-blur-sm border-t border-white/20 shadow-md"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between px-2 py-1 gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-center">
                <span className="text-white text-sm font-medium">
                  {plansToCompare.length === 1 ? "1 Plan Selected" : `${plansToCompare.length} Plans`}
                </span>

                {!canCompare && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="ml-2 text-white/80">
                          <AlertCircle size={14} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Select at least 2 plans to compare</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2">
                {selectedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center bg-white/20 rounded-lg px-3 py-1.5 text-sm text-white"
                  >
                    <span className="truncate max-w-[120px] md:max-w-[200px]">
                      {plan.carrier} {plan.name}
                    </span>
                    <button
                      onClick={() => onRemovePlan(plan.id)}
                      className="ml-2 text-white/70 hover:text-white transition-colors"
                      aria-label="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-white hover:text-white hover:bg-white/20 h-8 px-2"
              >
                Clear
              </Button>

              <Button
                onClick={handleCompare}
                disabled={!canCompare}
                size="sm"
                className={cn(
                  "bg-white text-healthbird-purple hover:bg-white/90 shadow-lg shadow-healthbird-purple/10 h-8",
                  !canCompare && "opacity-50 cursor-not-allowed",
                )}
              >
                Compare Plans
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ComparisonBar
