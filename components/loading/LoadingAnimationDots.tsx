"use client"

import type React from "react"
import { motion } from "framer-motion"

const LoadingAnimationDots: React.FC = () => {
  return (
    <div className="mt-6 flex justify-center">
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-br from-healthbird-purple to-healthbird-blue shadow-md"
            animate={{
              y: [0, -4, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default LoadingAnimationDots
