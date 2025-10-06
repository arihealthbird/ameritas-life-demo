"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FAQCategory } from "@/types/faq"
import { useLanguage } from "@/contexts/LanguageContext"

interface CategoryTabsProps {
  categories: FAQCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onCategoryChange }) => {
  const { language } = useLanguage()

  const getCategoryName = (id: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        general: "General",
        plans: "Plans & Coverage",
        enrollment: "Enrollment & Subsidies",
        support: "Support & Resources",
      },
      es: {
        general: "General",
        plans: "Planes y Cobertura",
        enrollment: "Inscripción y Subsidios",
        support: "Soporte y Recursos",
      },
    }

    return translations[language][id] || id
  }

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={cn(
            "rounded-full text-sm md:text-base font-medium transition-colors duration-300",
            activeCategory === category.id
              ? "bg-purple-600/10 text-purple-600 hover:bg-purple-600/20"
              : "text-gray-500 hover:bg-gray-100",
          )}
          onClick={() => onCategoryChange(category.id)}
        >
          {getCategoryName(category.id)}
        </Button>
      ))}
    </motion.div>
  )
}

export default CategoryTabs
