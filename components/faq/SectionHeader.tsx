"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"

const SectionHeader: React.FC = () => {
  const { language } = useLanguage()

  const translations = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about finding the perfect health insurance plan with HealthBird.",
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesitas saber sobre cómo encontrar el plan de seguro de salud perfecto con HealthBird.",
    },
  }

  const content = language === "en" ? translations.en : translations.es

  return (
    <motion.div
      className="text-center mb-12 md:mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
        {content.title}
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">{content.subtitle}</p>
    </motion.div>
  )
}

export default SectionHeader
