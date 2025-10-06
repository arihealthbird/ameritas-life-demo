import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Plan } from "@/types"
import { Badge } from "@/components/ui/badge"
import { OverviewTab } from "./OverviewTab"
import { EstimatedCostTab } from "./EstimatedCostTab"

interface PlanDetailsContentProps {
  plan: Plan
}

export const PlanDetailsContent: React.FC<PlanDetailsContentProps> = ({ plan }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          <p className="text-muted-foreground">{plan.description}</p>
        </div>
        <Badge variant="secondary">{plan.status}</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="estimated-cost">Estimated Cost</TabsTrigger>
          {/* Add more tabs here if needed */}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab plan={plan} />
        </TabsContent>
        <TabsContent value="estimated-cost" className="space-y-4">
          <EstimatedCostTab planId={plan.id} />
        </TabsContent>
        {/* Add more tab contents here if needed */}
      </Tabs>
    </div>
  )
}
