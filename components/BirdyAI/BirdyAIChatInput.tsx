"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface BirdyAIChatInputProps {
  inputMessage: string
  setInputMessage: (value: string) => void
  handleSendMessage: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  isLoading: boolean
}

const BirdyAIChatInput: React.FC<BirdyAIChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyDown,
  isLoading,
}) => {
  // Use a key for the motion component to avoid stale animations
  return (
    <motion.div
      key="chat-input"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="p-4 border-t border-gray-200/40"
    >
      <div className="flex gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="min-h-[50px] max-h-[150px] resize-none bg-white/70 backdrop-blur-sm border-white/50 focus-visible:ring-purple-600/50"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          size="icon"
          className={cn(
            "h-[50px] w-[50px] bg-gradient-to-r from-purple-600 to-pink-500 text-white",
            "hover:shadow-md transition-all duration-200",
            "disabled:opacity-50",
          )}
          disabled={!inputMessage.trim() || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}

export default BirdyAIChatInput
