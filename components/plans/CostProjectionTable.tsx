"use client"

import { Calculator, HelpCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UsageLevel } from "@/types/costProjection"
import { useCostProjection } from "@/hooks/useCostProjection"

interface CostProjectionTableProps {
  planId: string
}

export function CostProjectionTable({ planId }: CostProjectionTableProps) {
  const { costProjection, usageLevel, setUsageLevel } = useCostProjection(planId)

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const handleUsageLevelChange = (value: string) => {
    setUsageLevel(value as UsageLevel)
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden text-sm">
      {/* Header */}
      <div className="bg-blue-50 p-3">
        <div className="flex items-start gap-2">
          <div className="text-purple-600 mt-0.5">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Cost Projection</h3>
            <p className="text-xs text-gray-600 mt-0.5">Estimated annual healthcare costs based on your profile.</p>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 p-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-1 text-purple-600 text-xs font-medium">Expected use:</span>
          </div>
          <div className="w-24">
            <Select value={usageLevel} onValueChange={handleUsageLevelChange}>
              <SelectTrigger className="border-gray-200 h-7 text-xs">
                <SelectValue placeholder="Select usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A little">A little</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="A lot">A lot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end items-center text-purple-600 text-xs font-medium">
          Sticker price
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-48 text-xs">The full cost of services before insurance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex justify-end items-center text-purple-600 text-xs font-medium">
          Insurance pays
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-48 text-xs">The amount covered by your insurance plan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex justify-end items-center text-purple-600 text-xs font-medium">
          You pay
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-48 text-xs">Your estimated out-of-pocket cost</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Table Rows */}
      <div className="bg-white">
        {costProjection.services.map((service, index) => (
          <div
            key={service.name}
            className={`grid grid-cols-4 py-2 border-b border-gray-100 ${
              service.name === "Monthly Premium" ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center gap-2 pl-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                  service.count > 0 ? "bg-purple-600" : "bg-gray-200 text-gray-600"
                }`}
              >
                {service.count}
              </div>
              <span className="text-gray-800 text-xs">{service.name}</span>
            </div>
            <div className="text-right text-gray-800 text-xs">{formatCurrency(service.stickerPrice)}</div>
            <div className="text-right text-gray-800 text-xs">{formatCurrency(service.insurancePays)}</div>
            <div className="text-right font-medium pr-2">
              {service.youPay === 0 && service.name !== "Monthly Premium" ? (
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">FREE</span>
              ) : (
                <span className="text-purple-600 text-xs">{formatCurrency(service.youPay)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Totals */}
      <div className="bg-purple-50 p-3">
        <div className="grid grid-cols-4">
          <div className="font-semibold text-gray-800 text-xs">Total estimate</div>
          <div className="text-right font-medium text-gray-800 text-xs">
            {formatCurrency(costProjection.totalStickerPrice)}
            <div className="text-xs text-gray-500">/year</div>
          </div>
          <div className="text-right font-medium text-gray-800 text-xs">
            {formatCurrency(costProjection.totalInsurancePays)}
            <div className="text-xs text-gray-500">/year</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-purple-600 text-sm">
              {formatCurrency(costProjection.totalYouPay)}
              <span className="text-xs">/year</span>
            </div>
            <div className="text-purple-600 font-medium text-xs">{formatCurrency(costProjection.monthlyYouPay)}/mo</div>
          </div>
        </div>
      </div>
    </div>
  )
}
