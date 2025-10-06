"use client"

import type React from "react"
import { motion } from "framer-motion"
import FAQItem from "./FAQItem"
import { useLanguage } from "@/contexts/LanguageContext"

interface FAQListProps {
  faqs: Array<{
    question: string
    questionEs: string
    answer: string
    answerEs: string
  }>
  expandedFAQ: string | null
  onToggleFAQ: (question: string) => void
}

const FAQList: React.FC<FAQListProps> = ({ faqs, expandedFAQ, onToggleFAQ }) => {
  const { language } = useLanguage()

  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={language === "en" ? faq.question : faq.questionEs}
          answer={language === "en" ? faq.answer : faq.answerEs}
          isExpanded={expandedFAQ === (language === "en" ? faq.question : faq.questionEs)}
          onToggle={() => onToggleFAQ(language === "en" ? faq.question : faq.questionEs)}
        />
      ))}
    </motion.div>
  )
}

export default FAQList
