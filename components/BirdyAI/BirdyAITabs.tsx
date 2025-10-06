"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BirdyAITabsProps {
  activeTab: "info" | "chat"
  setActiveTab: (tab: "info" | "chat") => void
}

const BirdyAITabs: React.FC<BirdyAITabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mt-3 mx-auto px-1 py-1 bg-gray-100/30 backdrop-blur-md rounded-full w-full max-w-[190px] relative shadow-sm">
      {/* Animated background pill with proper positioning */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-purple-600/90 to-pink-500/90 shadow-sm z-0"
        initial={false}
        animate={{
          left: activeTab === "info" ? "2%" : "51%",
          right: activeTab === "info" ? "51%" : "2%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Tab buttons with improved styling */}
      <button
        onClick={() => setActiveTab("info")}
        className={cn(
          "flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all duration-300 z-10 relative",
          activeTab === "info" ? "text-white" : "text-gray-600 hover:text-gray-800",
        )}
      >
        Info
      </button>
      <button
        onClick={() => setActiveTab("chat")}
        className={cn(
          "flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all duration-300 z-10 relative",
          activeTab === "chat" ? "text-white" : "text-gray-600 hover:text-gray-800",
        )}
      >
        Chat
      </button>
    </div>
  )
}

export default BirdyAITabs
