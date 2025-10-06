"use client"

import { useState, useEffect } from "react"
import type { InsurancePlan } from "@/types/plans"
import { useToast } from "@/hooks/use-toast"

export interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function useBirdyAIChat(plan?: InsurancePlan) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize chat with a welcome message
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      const welcomeMessage = plan
        ? `Hello! I'm Birdy AI, your health insurance assistant. I can help you understand the ${plan.name} plan from ${plan.carrier}. What would you like to know about this plan?`
        : "Hello! I'm Birdy AI, your health insurance assistant. How can I help you today?"

      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ])
      setIsLoading(false)
      setFirstLoad(false)
      setSessionId("mock-session-id")
    }, 1500)

    return () => clearTimeout(timer)
  }, [plan])

  // Function to send a message
  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("") // Clear input
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock responses based on user input
      let responseContent =
        "I'm sorry, I don't have specific information about that. Could you try asking something else about health insurance?"

      if (message.toLowerCase().includes("deductible")) {
        responseContent =
          "A deductible is the amount you pay for covered health care services before your insurance plan starts to pay. For example, with a $2,000 deductible, you pay the first $2,000 of covered services yourself before insurance begins to pay."
      } else if (message.toLowerCase().includes("premium")) {
        responseContent =
          "A premium is the amount you pay for your health insurance every month. Think of it like a subscription fee for your coverage. Even if you don't use any healthcare services, you still need to pay this monthly amount to maintain your insurance."
      } else if (message.toLowerCase().includes("copay") || message.toLowerCase().includes("co-pay")) {
        responseContent =
          "A copay (or co-payment) is a fixed amount you pay for a covered healthcare service, usually when you receive the service. For example, you might pay $25 for a doctor visit or $15 for a prescription. Your insurance covers the rest of the cost."
      } else if (message.toLowerCase().includes("network")) {
        responseContent =
          "An insurance network is a group of healthcare providers (doctors, hospitals, labs) that have contracted with your insurance company to provide services at negotiated rates. Staying 'in-network' typically means lower out-of-pocket costs for you."
      }

      // Add AI response
      const aiResponse: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error in chat:", error)

      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })

      // Fallback response
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

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    firstLoad,
    sendMessage,
  }
}
