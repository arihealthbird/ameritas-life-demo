"use client"

import type React from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const BirdyAITriggerButton: React.FC = () => {
  return (
    <Button
      className={cn(
        "w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white",
        "hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300",
        "rounded-full py-2.5",
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        <span>Ask Birdy AI</span>
      </div>
    </Button>
  )
}

export default BirdyAITriggerButton
