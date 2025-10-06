"use client"

import type React from "react"
import { Shield, Heart, Award, CreditCard } from "lucide-react"

const FeatureList: React.FC = () => {
  const features = [
    {
      icon: <Shield size={16} className="text-blue-500" />,
      title: "Financial Security",
      description: "Ensure your loved ones are financially protected in your absence with Ameritas.",
    },
    {
      icon: <Heart size={16} className="text-pink-500" />,
      title: "Legacy Planning",
      description: "Leave a lasting legacy and cover final expenses, debts, or educational costs.",
    },
    {
      icon: <Award size={16} className="text-amber-500" />,
      title: "Cash Value Growth",
      description: "Select Ameritas plans offer cash value accumulation for future financial flexibility.",
    },
    {
      icon: <CreditCard size={16} className="text-green-500" />,
      title: "Simple Application",
      description: "Experience a streamlined online application process for Ameritas life insurance.",
    },
  ]

  return (
    <div className="space-y-5">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-white hover:to-gray-50 hover:shadow-sm"
        >
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeatureList
