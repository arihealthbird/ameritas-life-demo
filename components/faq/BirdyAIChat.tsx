"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Sparkle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/LanguageContext"

interface BirdyAIChatProps {
  tabContentVariants: any
}

interface Message {
  role: "user" | "assistant"
  content: string
}

const BirdyAIChat: React.FC<BirdyAIChatProps> = ({ tabContentVariants }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  // Initialize chat with a welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      const welcomeMessage =
        language === "en"
          ? "Hello! I'm Birdy AI, your health insurance assistant. How can I help you today?"
          : "¡Hola! Soy Birdy AI, tu asistente de seguros de salud. ¿Cómo puedo ayudarte hoy?"

      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [language])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("") // Clear input
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response based on user input
      let responseContent =
        language === "en"
          ? "I'm sorry, I don't have specific information about that. Could you try asking something else about health insurance?"
          : "Lo siento, no tengo información específica sobre eso. ¿Podrías intentar preguntar algo más sobre seguros de salud?"

      if (inputMessage.toLowerCase().includes("deductible")) {
        responseContent =
          language === "en"
            ? "A deductible is the amount you pay for covered health care services before your insurance plan starts to pay. For example, with a $2,000 deductible, you pay the first $2,000 of covered services yourself before insurance begins to pay."
            : "Un deducible es la cantidad que pagas por servicios de atención médica cubiertos antes de que tu plan de seguro comience a pagar. Por ejemplo, con un deducible de $2,000, pagas los primeros $2,000 de servicios cubiertos tú mismo antes de que el seguro comience a pagar."
      } else if (inputMessage.toLowerCase().includes("premium")) {
        responseContent =
          language === "en"
            ? "A premium is the amount you pay for your health insurance every month. Think of it like a subscription fee for your coverage. Even if you don't use any healthcare services, you still need to pay this monthly amount to maintain your insurance."
            : "Una prima es la cantidad que pagas por tu seguro de salud cada mes. Piensa en ello como una tarifa de suscripción por tu cobertura. Incluso si no utilizas ningún servicio de atención médica, aún debes pagar esta cantidad mensual para mantener tu seguro."
      }

      // Add AI response
      const aiResponse: Message = {
        role: "assistant",
        content: responseContent,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error in chat:", error)

      // Fallback response
      const fallbackResponse: Message = {
        role: "assistant",
        content:
          language === "en"
            ? "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
            : "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo en un momento.",
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

  return (
    <motion.div
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full"
    >
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-150"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                <div
                  className={`
                    ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-500/80 text-white"
                        : "bg-white/80 backdrop-blur-sm border border-white/50 text-gray-800"
                    }
                    max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm
                  `}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2.5">
                      <Avatar className="h-6 w-6 bg-purple-600/10 flex items-center justify-center">
                        <Sparkle size={12} className="text-purple-600 animate-pulse" />
                      </Avatar>
                      <span className="text-xs font-semibold text-purple-600">Birdy AI</span>
                    </div>
                  )}
                  <div
                    className={`text-sm leading-relaxed ${message.role === "user" ? "text-white/95" : "text-gray-700"}`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2 mb-4">
                <div className="bg-white/80 backdrop-blur-sm border border-white/50 text-gray-800 rounded-2xl px-5 py-3.5 shadow-sm max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-gray-200/40">
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === "en" ? "Ask me anything..." : "Pregúntame lo que quieras..."}
            className="min-h-[50px] max-h-[150px] resize-none bg-white/70 backdrop-blur-sm border-white/50 focus-visible:ring-purple-600/50"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-[50px] w-[50px] bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-md transition-all duration-200 disabled:opacity-50"
            disabled={!inputMessage.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default BirdyAIChat
