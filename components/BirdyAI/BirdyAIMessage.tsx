"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import type { Message } from "@/hooks/useBirdyAIChat"
import { Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BirdyAIMessageProps {
  message: Message
  index: number
  onSuggestedQuestionClick?: (question: string) => void
}

// Helper function to find and format suggested questions in AI responses
const findSuggestedQuestions = (content: string): string[] => {
  // This is a basic implementation - it looks for lines starting with "?" or phrases like "you can ask"
  const questions: string[] = []

  // Split by new lines
  const lines = content.split("\n")

  lines.forEach((line) => {
    const trimmedLine = line.trim()

    // If line starts with a question mark or bullet point followed by a question
    if ((trimmedLine.startsWith("?") || trimmedLine.startsWith("•")) && trimmedLine.includes("?")) {
      // Extract the question
      const questionMatch = trimmedLine.match(/[^•?-\s].*\?/)
      if (questionMatch) {
        questions.push(questionMatch[0].trim())
      }
    }

    // If line contains a question in quotes
    const quotedQuestions = trimmedLine.match(/"([^"]*\?[^"]*)"/g)
    if (quotedQuestions) {
      quotedQuestions.forEach((q) => {
        // Remove quotes
        questions.push(q.replace(/"/g, "").trim())
      })
    }
  })

  // Add additional logic for phrases like "you can ask about X"
  // This is a simplified approach
  const askPattern = /you can ask (me )?(about )?[^?.]+\??/gi
  const askMatches = content.match(askPattern)

  if (askMatches) {
    askMatches.forEach((match) => {
      const question = match.replace(/you can ask (me )?(about )?/i, "").trim()
      // Add a question mark if it doesn't have one
      questions.push(question.endsWith("?") ? question : `${question}?`)
    })
  }

  // Return unique questions, up to 3
  return [...new Set(questions)].slice(0, 3)
}

const BirdyAIMessage: React.FC<BirdyAIMessageProps> = ({ message, index, onSuggestedQuestionClick }) => {
  const isUser = message.role === "user"

  // Clean up markdown formatting in the message content
  const cleanContent = message.content.replace(/\*\*/g, "")

  // Improved text formatting with better line breaks and paragraph styling
  const formattedContent = cleanContent
    .replace(/\n\n/g, "\n")
    .split("\n")
    .map((line, i) => {
      // Check if line is a bullet point and apply special styling
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <p key={i} className={`${i > 0 ? "mt-2" : ""} flex`}>
            <span className="mr-2">{line.trim().startsWith("•") ? "•" : "-"}</span>
            <span>{line.trim().replace(/^[•-]\s*/, "")}</span>
          </p>
        )
      }

      // Make title-like sentences bold (sentences that end with a colon)
      if (line.trim().endsWith(":")) {
        return (
          <p key={i} className={`${i > 0 ? "mt-2" : ""} font-bold`}>
            {line}
          </p>
        )
      }

      return (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {line}
        </p>
      )
    })

  // Find suggested questions in AI responses
  const suggestedQuestions = !isUser ? findSuggestedQuestions(cleanContent) : []

  // Generate default suggested questions if none are found in the message content
  const defaultQuestions = [
    "How does the deductible work?",
    "What's covered under this plan?",
    "Is this a good plan for someone like me?",
  ]

  // Use extracted questions if available, otherwise use defaults
  const questionsToShow = suggestedQuestions.length > 0 ? suggestedQuestions : defaultQuestions

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
        ${
          isUser
            ? "bg-gradient-to-r from-purple-600 to-pink-500/80 text-white"
            : "bg-white/80 backdrop-blur-sm border border-white/50 text-gray-800"
        }
        max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm
      `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2.5">
            <Avatar className="h-6 w-6 bg-purple-600/10 flex items-center justify-center">
              <Sparkle size={12} className="text-purple-600 animate-pulse" />
            </Avatar>
            <span className="text-xs font-semibold text-purple-600">Birdy AI</span>
          </div>
        )}

        <div className={`text-sm leading-relaxed ${isUser ? "text-white/95" : "text-gray-700"} tracking-wide`}>
          {formattedContent}
        </div>

        {/* Suggested questions - now with direct send */}
        {!isUser && questionsToShow.length > 0 && onSuggestedQuestionClick && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {questionsToShow.map((question, qIndex) => (
                <Button
                  key={qIndex}
                  variant="ghost"
                  size="sm"
                  className="text-xs bg-purple-600/10 text-purple-600 hover:bg-purple-600/20 px-3 py-1 h-auto rounded-full"
                  onClick={() => {
                    if (onSuggestedQuestionClick) {
                      onSuggestedQuestionClick(question)
                    }
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BirdyAIMessage
