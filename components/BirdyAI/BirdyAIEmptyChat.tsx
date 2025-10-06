"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const BirdyAIEmptyChat: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-[300px] text-center px-4"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-500/10 flex items-center justify-center mb-4">
        <Sparkles className="h-8 w-8 text-purple-600/70" />
      </div>
      <h4 className="text-gray-700 font-medium mb-2">Ask me anything!</h4>
      <p className="text-gray-500 text-sm max-w-[280px]">
        I'm here to simplify health insurance for you. Ask about coverage options, explain form fields, or help navigate
        your healthcare journey.
      </p>
    </motion.div>
  )
}

export default BirdyAIEmptyChat
