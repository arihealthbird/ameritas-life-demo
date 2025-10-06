"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles, MessageCircle, Phone, ArrowRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import BirdyAIContent from "./BirdyAIContent"

// Create animation variants for smooth transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

const BirdyAIWidget: React.FC = () => {
  const { language } = useLanguage()

  // Translated content
  const translations = {
    en: {
      title: "Still have questions?",
      description:
        "Our AI assistant can help answer any specific questions about health insurance, enrollment, or your coverage options.",
      liveChatSupport: "Live chat support",
      email: "Email our team",
      phoneSupport: "Phone support",
      phoneHours: "Available Monday-Friday, 9 AM to 6 PM ET",
      phoneNumber: "(833) 384-2473",
    },
    es: {
      title: "¿Todavía tienes preguntas?",
      description:
        "Nuestro asistente de IA puede ayudarte a responder cualquier pregunta específica sobre seguros de salud, inscripción o tus opciones de cobertura.",
      liveChatSupport: "Soporte por chat en vivo",
      email: "Correo a nuestro equipo",
      phoneSupport: "Soporte telefónico",
      phoneHours: "Disponible de lunes a viernes, de 9 AM a 6 PM ET",
      phoneNumber: "(833) 384-2473",
    },
  }

  // Select the appropriate translations based on current language
  const content = language === "en" ? translations.en : translations.es

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 backdrop-blur-sm relative"
    >
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-purple-600/10 via-pink-500/5 to-purple-600/10 rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <motion.h3 variants={itemVariants} className="text-2xl font-semibold text-gray-900">
            {content.title}
          </motion.h3>
        </div>

        <motion.p variants={itemVariants} className="text-gray-700 mb-6">
          {content.description}
        </motion.p>

        {/* Birdy AI Icon Button with jumping and shimmering animations */}
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              variants={itemVariants}
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 mx-auto overflow-hidden group"
              aria-label="Ask Birdy AI"
              // Add jumping animation
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
            >
              {/* Shimmering effect overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />

              {/* Continuous shimmer animation */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              {/* Sparkle icon with its own subtle animation */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-6 w-6 z-10" />
              </motion.div>
            </motion.button>
          </SheetTrigger>
          <SheetContent
            className={cn(
              "border-none p-0 overflow-hidden",
              "backdrop-blur-[30px] shadow-xl",
              "w-[90vw] max-w-md rounded-3xl",
              "bg-white/80 dark:bg-black/80",
            )}
          >
            <BirdyAIContent />
          </SheetContent>
        </Sheet>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-5">
        <motion.h4 variants={itemVariants} className="font-medium text-gray-900 mb-1 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-purple-600" />
          <span>{content.liveChatSupport}</span>
        </motion.h4>
        <motion.a
          variants={itemVariants}
          href="mailto:hello@healthbird.com"
          className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:border-purple-600/30 hover:bg-purple-600/5 transition-all group"
        >
          <span className="text-gray-700">{content.email}</span>
          <ArrowRight className="w-4 h-4 text-purple-600 transition-transform group-hover:translate-x-1" />
        </motion.a>

        <motion.h4 variants={itemVariants} className="font-medium text-gray-900 mb-1 flex items-center gap-2 pt-2">
          <Phone className="w-4 h-4 text-purple-600" />
          <span>{content.phoneSupport}</span>
        </motion.h4>
        <motion.p variants={itemVariants} className="text-gray-700 text-sm">
          {content.phoneHours}
        </motion.p>
        <motion.a
          variants={itemVariants}
          href="tel:(833) 384-2473"
          className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:border-purple-600/30 hover:bg-purple-600/5 transition-all group"
        >
          <span className="text-gray-700">{content.phoneNumber}</span>
          <ArrowRight className="w-4 h-4 text-purple-600 transition-transform group-hover:translate-x-1" />
        </motion.a>
      </motion.div>
    </motion.div>
  )
}

export default BirdyAIWidget
