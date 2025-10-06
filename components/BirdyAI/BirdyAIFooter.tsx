"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const BirdyAIFooter: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="p-6 pt-4"
    >
      <SheetClose asChild>
        <Button
          className={cn(
            "w-full rounded-full py-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white",
            "shadow-[0_4px_20px_rgba(155,135,245,0.3)] hover:shadow-[0_6px_25px_rgba(155,135,245,0.5)]",
            "transition-all duration-300 hover:translate-y-[-1px]",
          )}
        >
          Got it, thanks!
        </Button>
      </SheetClose>
    </motion.div>
  )
}

export default BirdyAIFooter
