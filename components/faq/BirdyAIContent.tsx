"use client"

import type React from "react"
import { useState } from "react"
import { Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import BirdyAIChat from "./BirdyAIChat"
import BirdyAIInfo from "./BirdyAIInfo"

const BirdyAIContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"info" | "chat">("info")
  const { language } = useLanguage()

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
    <div className="flex flex-col h-full relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600/20 via-white/10 to-pink-500/20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <div className="pt-8 pb-4 px-6 flex flex-col items-center justify-center border-b border-gray-200/40">
        <div className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 rounded-full w-14 h-14 mb-4 shadow-lg">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h3 className="font-semibold text-xl text-gray-900">Birdy AI Assistant</h3>

        {/* Tabs */}
        <div className="flex mt-3 mx-auto px-1 py-1 bg-gray-100/30 backdrop-blur-md rounded-full w-full max-w-[190px] relative shadow-sm">
          {/* Animated background pill */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-purple-600/90 to-pink-500/90 shadow-sm z-0"
            initial={false}
            animate={{
              left: activeTab === "info" ? "2%" : "51%",
              right: activeTab === "info" ? "51%" : "2%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Tab buttons */}
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all duration-300 z-10 relative ${
              activeTab === "info" ? "text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all duration-300 z-10 relative ${
              activeTab === "chat" ? "text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "info" ? (
            <BirdyAIInfo key="info-tab" tabContentVariants={tabContentVariants} setActiveTab={setActiveTab} />
          ) : (
            <BirdyAIChat key="chat-tab" tabContentVariants={tabContentVariants} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BirdyAIContent
