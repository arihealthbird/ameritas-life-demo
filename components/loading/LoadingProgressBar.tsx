"use client"

import type React from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"

interface LoadingProgressBarProps {
  progress: number
  plansFound: number
  stage: number
  totalPlans: number
  testimonial: string
}

const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({
  progress,
  plansFound,
  stage,
  totalPlans,
  testimonial,
}) => {
  // Extract user info from testimonial if available
  const hasUserInfo = testimonial.includes("||")
  let quote = testimonial
  let userInfo = ""

  if (hasUserInfo) {
    const parts = testimonial.split("||")
    quote = parts[0].trim()
    userInfo = parts[1].trim()
  }

  return (
    <div className="mb-6">
      {/* Enhanced Customer Testimonial */}
      <motion.div
        className="mb-5 text-center px-5 py-4 bg-gradient-to-r from-healthbird-purple/5 to-healthbird-pink/5 rounded-xl border border-healthbird-purple/10 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        key={testimonial} // Key helps with animation when testimonial changes
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <p className="text-sm italic text-gray-700">{quote}</p>
          </div>

          {hasUserInfo && (
            <div className="flex items-center mt-1 text-xs text-healthbird-purple font-medium">
              <User size={12} className="mr-1" />
              <span>{userInfo}</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
        <motion.div
          className="h-full absolute top-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 20,
          }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm font-medium">
        <motion.div className="text-emerald-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="text-lg font-semibold">{Math.floor(progress)}%</span>
        </motion.div>
        <motion.div className="text-healthbird-purple" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {stage >= 2 ? (
            <span className="text-lg font-semibold">
              {plansFound} of {totalPlans}
            </span>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingProgressBar
