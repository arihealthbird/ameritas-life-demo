"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FAQItemProps {
  question: string
  answer: string
  isExpanded: boolean
  onToggle: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:border-purple-200 transition-colors duration-300">
      <Collapsible open={isExpanded} onOpenChange={onToggle} className="w-full">
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            aria-expanded={isExpanded}
          >
            <span className="font-medium text-gray-900">{question}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform duration-200",
                isExpanded && "transform rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5 text-gray-600"
          >
            <p>{answer}</p>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default FAQItem
