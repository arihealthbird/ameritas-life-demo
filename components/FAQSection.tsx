"use client"

import type React from "react"
import { useState } from "react"
import { Particles } from "@/components/ui/particles"
import { faqCategories } from "@/data/faqData"
import SectionHeader from "./faq/SectionHeader"
import CategoryTabs from "./faq/CategoryTabs"
import FAQList from "./faq/FAQList"
import BirdyAIWidget from "./faq/BirdyAIWidget"
import { useLanguage } from "@/contexts/LanguageContext"

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("general")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const { language } = useLanguage()

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setExpandedFAQ(null) // Close any open FAQ when changing categories
  }

  const handleToggleFAQ = (question: string) => {
    setExpandedFAQ(expandedFAQ === question ? null : question)
  }

  // Get the FAQs for the active category
  const activeFAQs = faqCategories.find((category) => category.id === activeCategory)?.faqs || []

  return (
    <section className="w-full py-16 md:py-24 relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Particles background */}
      <Particles
        className="absolute inset-0 opacity-30"
        quantity={70}
        staticity={40}
        size={1}
        color="#9b87f5"
        ease={80}
        vx={0.2}
        vy={0.1}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 top-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <SectionHeader />

        <CategoryTabs
          categories={faqCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="space-y-8">
          <FAQList faqs={activeFAQs} expandedFAQ={expandedFAQ} onToggleFAQ={handleToggleFAQ} />

          <div className="max-w-2xl mx-auto">
            <BirdyAIWidget />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
