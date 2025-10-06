"use client"

import type React from "react"
import { Sparkles, X } from "lucide-react"
import { SheetClose } from "@/components/ui/sheet"
import BirdyAITabs from "./BirdyAITabs"

interface BirdyAIHeaderProps {
  activeTab: "info" | "chat"
  setActiveTab: (tab: "info" | "chat") => void
}

const BirdyAIHeader: React.FC<BirdyAIHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="pt-8 pb-4 px-6 flex flex-col items-center justify-center border-b border-gray-200/40">
      <div className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 rounded-full w-14 h-14 mb-4 shadow-lg">
        <Sparkles className="h-7 w-7 text-white" />
      </div>
      <h3 className="font-semibold text-xl text-gray-900">Birdy AI Assistant</h3>

      {/* Enhanced tabs for Info and Chat with smoother transitions */}
      <BirdyAITabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Single close button in the top-right corner */}
      <SheetClose className="absolute top-4 right-4 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100/50 transition-colors">
        <X className="h-4 w-4 text-gray-500" />
      </SheetClose>
    </div>
  )
}

export default BirdyAIHeader
