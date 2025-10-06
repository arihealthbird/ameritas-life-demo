"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatePresence } from "framer-motion"
import BirdyAIMessage from "./BirdyAIMessage"
import BirdyAITypingIndicator from "./BirdyAITypingIndicator"
import BirdyAIEmptyChat from "./BirdyAIEmptyChat"
import BirdyAIChatInput from "./BirdyAIChatInput"
import { useToast } from "@/hooks/use-toast"
import type { Message } from "@/hooks/useBirdyAIChat"

interface BirdyAIChatProps {
  tabContentVariants: any
}

const BirdyAIChat: React.FC<BirdyAIChatProps> = ({ tabContentVariants }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true) // Start with loading state true
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [firstLoad, setFirstLoad] = useState(true)

  // Create a chat session when component mounts
  useEffect(() => {
    const createSession = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setSessionId("mock-session-id")

        // Add a small delay to simulate the AI "thinking" before first message
        setTimeout(() => {
          setMessages([
            {
              role: "assistant",
              content: "Hello! I'm Birdy AI, your health insurance assistant. How can I help you today?",
              timestamp: new Date(),
            },
          ])
          setIsLoading(false)
          setFirstLoad(false)
        }, 1500)
      } catch (error) {
        console.error("Failed to create chat session:", error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to AI assistant. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
        setFirstLoad(false)
      }
    }

    createSession()
  }, [toast])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isLoading]) // Added isLoading to dependencies to scroll when loading indicator appears/disappears

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    if (!sessionId) {
      toast({
        title: "Not Connected",
        description: "Still connecting to the AI assistant. Please try again in a moment.",
        variant: "destructive",
      })
      return
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("") // Clear input
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response based on user input
      let responseContent =
        "I'm sorry, I don't have specific information about that. Could you try asking something else about health insurance?"

      if (inputMessage.toLowerCase().includes("deductible")) {
        responseContent =
          "A deductible is the amount you pay for covered health care services before your insurance plan starts to pay. For example, with a $2,000 deductible, you pay the first $2,000 of covered services yourself before insurance begins to pay."
      } else if (inputMessage.toLowerCase().includes("premium")) {
        responseContent =
          "A premium is the amount you pay for your health insurance every month. Think of it like a subscription fee for your coverage. Even if you don't use any healthcare services, you still need to pay this monthly amount to maintain your insurance."
      } else if (inputMessage.toLowerCase().includes("copay")) {
        responseContent =
          "A copay (or co-payment) is a fixed amount you pay for a covered healthcare service, usually when you receive the service. For example, you might pay $25 for a doctor visit or $15 for a prescription. Your insurance covers the rest of the cost."
      }

      // Add AI response
      const aiResponse: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error fetching AI response:", error)

      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant. Please try again.",
        variant: "destructive",
      })

      // Fallback response in case of error
      const fallbackResponse: Message = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Add a unique key to the motion.div to ensure proper rerendering
  return (
    <motion.div
      key="chat-tab-content"
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full"
    >
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          isLoading ? (
            <div className="flex items-center justify-center h-full">
              <BirdyAITypingIndicator />
            </div>
          ) : (
            <BirdyAIEmptyChat />
          )
        ) : (
          <div className="space-y-4 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <BirdyAIMessage
                  key={`message-${index}`}
                  message={message}
                  index={index}
                  onSuggestedQuestionClick={(question) => {
                    setInputMessage(question)
                    setTimeout(() => handleSendMessage(), 100)
                  }}
                />
              ))}
            </AnimatePresence>

            {isLoading && <BirdyAITypingIndicator />}
          </div>
        )}
      </ScrollArea>

      <BirdyAIChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        isLoading={isLoading}
      />
    </motion.div>
  )
}

export default BirdyAIChat
