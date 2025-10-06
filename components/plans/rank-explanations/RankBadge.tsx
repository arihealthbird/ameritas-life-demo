"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trophy, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { InsurancePlan } from "@/types/plans"
import RankSummaryCard from "@/components/plans/RankSummaryCard"
import CategoryComparisonTable from "@/components/plans/CategoryComparisonTable"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DetailedAnalysisContent from "./DetailedAnalysisContent"
import { EstimatedCostTab } from "@/components/plans/EstimatedCostTab"

interface RankBadgeProps {
  rank: number
  showIcon?: boolean
  plan?: InsurancePlan
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, showIcon = true, plan }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("comparison")

  // Prevent body scrolling when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isPanelOpen])

  const handleOpenPanel = () => {
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  const panelVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closed: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpenPanel}
        className={cn(
          "inline-flex items-center rounded-full text-sm font-medium transition-opacity hover:opacity-90",
          "bg-purple-50 text-gray-800 border border-gray-200 shadow-sm",
          "px-3 py-1 relative",
        )}
      >
        <Trophy size={12} className="text-amber-500 mr-1" />
        Ranked #{rank}
        <Info size={12} className="text-purple-400 ml-1" />
      </button>

      {/* Overlay for closing panel when clicking outside */}
      {isPanelOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={handleClosePanel} aria-hidden="true" />}

      {/* Side Panel */}
      <motion.div
        className={cn(
          "fixed top-0 right-0 w-full sm:w-[90%] md:w-[600px] lg:w-[700px] h-full bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto",
          "transform transition-transform duration-300",
          isPanelOpen ? "translate-x-0" : "translate-x-full",
        )}
        variants={panelVariants}
        initial="closed"
        animate={isPanelOpen ? "open" : "closed"}
        exit="closed"
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 left-0 right-0 bg-white z-50 p-6 pb-2 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Personalized Analysis</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClosePanel}
            className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Close panel"
          >
            <X className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          <div className="p-6 pt-4">
            {plan && (
              <RankSummaryCard
                rank={rank}
                description={`With a match score of 89%, this plan ranks #${rank} based on how well it aligns with your specific healthcare needs.`}
                metric="89% match"
                improvement="positive"
                planName={`${plan.carrier} ${plan.metalLevel} ${plan.type} ${plan.name}`}
              />
            )}
          </div>

          {/* Fixed Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-6">
            <TabsList className="grid w-full grid-cols-3 mb-4 rounded-full bg-gray-100 p-1">
              <TabsTrigger
                value="comparison"
                className="text-sm rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                Comparison
              </TabsTrigger>
              <TabsTrigger
                value="detailed"
                className="text-sm rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                Detailed Analysis
              </TabsTrigger>
              <TabsTrigger
                value="estimated"
                className="text-sm rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                Estimated Cost
              </TabsTrigger>
            </TabsList>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="comparison" className="space-y-6 mt-0">
                {plan && <CategoryComparisonTable plan={plan} />}
              </TabsContent>

              <TabsContent value="detailed" className="space-y-6 mt-0">
                {plan && <DetailedAnalysisContent plan={plan} />}
              </TabsContent>

              <TabsContent value="estimated" className="space-y-6 mt-0">
                {plan && <EstimatedCostTab planId={plan.id} />}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}

export default RankBadge
