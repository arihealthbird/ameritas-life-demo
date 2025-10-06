"use client"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EstimatedCostTab } from "./EstimatedCostTab"

interface PersonalizedAnalysisSidebarProps {
  planId: string
  isOpen: boolean
  onClose: () => void
}

export function PersonalizedAnalysisSidebar({ planId, isOpen, onClose }: PersonalizedAnalysisSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Plan Analysis</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Tabs defaultValue="estimated-cost" className="flex-1 overflow-auto">
          <TabsList className="w-full justify-start px-4 pt-2">
            <TabsTrigger value="estimated-cost">Estimated Cost</TabsTrigger>
            <TabsTrigger value="coverage-details">Coverage Details</TabsTrigger>
            <TabsTrigger value="plan-comparison">Plan Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="estimated-cost" className="flex-1 overflow-auto">
            <EstimatedCostTab planId={planId} />
          </TabsContent>

          <TabsContent value="coverage-details" className="p-4">
            <div className="text-center text-gray-500 py-8">Coverage details will be displayed here.</div>
          </TabsContent>

          <TabsContent value="plan-comparison" className="p-4">
            <div className="text-center text-gray-500 py-8">Plan comparison will be displayed here.</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
