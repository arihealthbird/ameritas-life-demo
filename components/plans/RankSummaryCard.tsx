"use client"

import type React from "react"
import { getOrdinal } from "@/utils/planCardUtils"
import { SparklesIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"

interface RankSummaryCardProps {
  rank: number
  description: string
  metric: string
  improvement: "positive" | "negative" | "neutral"
  planName: string
}

const RankSummaryCard: React.FC<RankSummaryCardProps> = ({ rank, description, metric, improvement, planName }) => {
  // Get appropriate sentiment color based on improvement
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-gradient-to-r from-green-500/90 to-emerald-600/90"
      case "negative":
        return "bg-gradient-to-r from-red-500/90 to-rose-600/90"
      case "neutral":
        return "bg-gradient-to-r from-amber-400/90 to-amber-500/90"
      default:
        return "bg-gradient-to-r from-slate-400/90 to-slate-500/90"
    }
  }

  // Get appropriate text color for the badge
  const getTextColor = (sentiment: string) => {
    return "text-white"
  }

  // Get appropriate icon based on sentiment
  const getImprovementIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUpIcon className="w-5 h-5" />
      case "negative":
        return <TrendingDownIcon className="w-5 h-5" />
      case "neutral":
        return <MinusIcon className="w-5 h-5" />
      default:
        return <MinusIcon className="w-5 h-5" />
    }
  }

  // Format the metric to show whole numbers if it's a percentage
  const formattedMetric = metric.includes("%")
    ? metric.replace(/(\d+\.?\d*)%/, (match, number) => `${Math.round(Number.parseFloat(number))}%`)
    : metric

  // Format description to ensure percentages are displayed as whole numbers
  const formattedDescription = description.replace(
    /(\d+\.\d+)%/g,
    (match, number) => `${Math.round(Number.parseFloat(number))}%`,
  )

  return (
    <div className="relative overflow-hidden backdrop-blur-sm border border-gray-200/50 rounded-2xl mb-6 shadow-lg">
      {/* Background gradient based on improvement */}
      <div className="absolute inset-0 opacity-[0.07] bg-gradient-to-br from-purple-500/30 to-pink-500/30" />

      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Rank Badge */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <div className="bg-white dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold relative">
              <SparklesIcon className="absolute w-full h-full p-2 text-pink-500/20" />
              <span className="relative z-10 bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent">
                #{rank}
              </span>
            </div>
          </div>

          {/* Plan info */}
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {planName} is ranked{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {getOrdinal(rank || 0)}
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{formattedDescription}</p>
          </div>

          {/* Metric card */}
          <div className="glass relative overflow-hidden rounded-xl p-4 border border-gray-100 shadow-sm w-full md:w-auto">
            <div className={`absolute inset-0 ${getSentimentColor(improvement)} opacity-[0.07]`} />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Key Metric</p>
            <div className="flex items-center gap-1.5">
              <div className={`p-1.5 rounded-lg ${getSentimentColor(improvement)} ${getTextColor(improvement)}`}>
                {getImprovementIcon(improvement)}
              </div>
              <p
                className={`text-xl font-bold bg-gradient-to-r 
                ${
                  improvement === "positive"
                    ? "from-green-600 to-emerald-700"
                    : improvement === "negative"
                      ? "from-red-600 to-rose-700"
                      : "from-amber-500 to-amber-600"
                } 
                bg-clip-text text-transparent`}
              >
                {formattedMetric}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankSummaryCard
