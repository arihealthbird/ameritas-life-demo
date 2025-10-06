"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import BirdyAIContent from "../faq/BirdyAIContent"

interface BirdyAIFloatingButtonProps {
  title: string
  explanation: string
  tips?: string[]
}

const BirdyAIFloatingButton: React.FC<BirdyAIFloatingButtonProps> = ({ title, explanation, tips = [] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 overflow-hidden group"
          aria-label="Ask Birdy AI"
          // Remove the jumping animation to make it more appropriate for a header position
          whileHover={{ scale: 1.05 }}
          transition={{
            duration: 0.2,
          }}
        >
          {/* Shimmering effect overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />

          {/* Continuous shimmer animation */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Sparkle icon with its own subtle animation */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-5 w-5 z-10" />
          </motion.div>
        </motion.button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "border-none p-0 overflow-hidden",
          "backdrop-blur-[30px] shadow-xl",
          "w-[90vw] max-w-md rounded-3xl",
          "bg-white/80 dark:bg-black/80",
        )}
      >
        <BirdyAIContent />
      </SheetContent>
    </Sheet>
  )
}

export default BirdyAIFloatingButton
