"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface LoadingStageProps {
  stageNum: number
  currentStage: number
  isComplete: boolean
  icon: LucideIcon
  title: string
  plansFound?: number
  zipCode?: string
}

const LoadingStage: React.FC<LoadingStageProps> = ({
  stageNum,
  currentStage,
  isComplete,
  icon: StageIcon,
  title,
  plansFound,
  zipCode,
}) => {
  const isActive = stageNum === currentStage
  const isCompleted = stageNum < currentStage || isComplete

  return (
    <motion.div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        isActive
          ? "bg-healthbird-purple/10 border-healthbird-purple/30"
          : isCompleted
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"
      }`}
      initial={{ opacity: 0.7 }}
      animate={{
        opacity: 1,
        y: isActive ? 0 : 0,
      }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isActive
            ? "bg-gradient-to-br from-healthbird-purple to-healthbird-blue text-white"
            : isCompleted
              ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        <StageIcon size={20} />
      </div>
      <div className="flex-1">
        <p
          className={`font-medium ${
            isActive ? "text-healthbird-purple" : isCompleted ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isActive && zipCode ? `Finding plans in ${zipCode}` : title}
        </p>
        {isActive && (
          <motion.div className="flex items-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-sm text-healthbird-gray-500">
              {currentStage === 2 && plansFound !== undefined ? `Found ${plansFound} plans so far` : "Processing"}
            </span>
            <div className="flex space-x-1 ml-2 items-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-healthbird-purple/60"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        {isCompleted && (
          <motion.p className="text-sm text-green-600 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Complete
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default LoadingStage
