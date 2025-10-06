"use client"

import type React from "react"
import { motion } from "framer-motion"

const BirdyAITypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 text-gray-800 rounded-2xl px-5 py-3.5 shadow-sm max-w-[85%]">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-600"
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-600"
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-600"
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  )
}

export default BirdyAITypingIndicator
