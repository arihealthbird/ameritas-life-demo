"use client"

import type React from "react"
import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "framer-motion"

// Import our modular components
import BirdyAITriggerButton from "./BirdyAI/BirdyAITriggerButton"
import BirdyAIHeader from "./BirdyAI/BirdyAIHeader"
import BirdyAIInfoTab from "./BirdyAI/BirdyAIInfoTab"
import BirdyAIChat from "./BirdyAI/BirdyAIChat"
import BirdyAIFooter from "./BirdyAI/BirdyAIFooter"

interface AskBirdyAIButtonProps {
  title: string
  explanation: string
  tips?: string[]
}

const AskBirdyAIButton: React.FC<AskBirdyAIButtonProps> = ({ title, explanation, tips = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"info" | "chat">("info")

  // Animation variants for tab transitions
  const tabContentVariants = {
    hidden: {
      opacity: 0,
      x: activeTab === "info" ? -20 : 20,
      scale: 0.98,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      x: activeTab === "info" ? 20 : -20,
      scale: 0.98,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <BirdyAITriggerButton />

      <SheetContent
        className={cn(
          "border-none p-0 overflow-hidden",
          "backdrop-blur-[30px] shadow-xl",
          "w-[90vw] max-w-md rounded-3xl",
          "bg-white/80 dark:bg-black/80",
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Siri-like gradient blur in background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600/20 via-white/10 to-pink-500/20 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_70%)] animate-subtle-glow"></div>
          </div>

          {/* Header with tabs */}
          <BirdyAIHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content - tabbed between Info and Chat with smooth transitions */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "info" ? (
                <BirdyAIInfoTab
                  title={title}
                  explanation={explanation}
                  tips={tips}
                  tabContentVariants={tabContentVariants}
                  onSuggestedQuestionClick={(question) => {
                    setActiveTab("chat")
                  }}
                />
              ) : (
                <BirdyAIChat tabContentVariants={tabContentVariants} />
              )}
            </AnimatePresence>
          </div>

          {/* Footer - only show in info tab */}
          {activeTab === "info" && <BirdyAIFooter />}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AskBirdyAIButton
