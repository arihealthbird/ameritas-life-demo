"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface PartnerReference {
  name: string
  logo: string
  width: string
  article: {
    title: string
    date: string
    url: string
    excerpt: string
  }
}

interface PressReferenceContentProps {
  partner: PartnerReference
}

const PressReferenceContent: React.FC<PressReferenceContentProps> = ({ partner }) => {
  const { t } = useLanguage()

  return (
    <div className="p-6 sm:p-8 h-full overflow-auto">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <img
            src={partner.logo || "/placeholder.svg"}
            alt={partner.name}
            className="h-12 sm:h-14 w-auto object-contain"
          />
          <div className="h-10 w-px bg-gray-200" />
          <h3 className="text-xl font-bold text-gray-800">{partner.name}</h3>
        </div>

        <div className="mt-1">
          <span className="text-sm font-medium text-purple-600">{partner.article.date}</span>
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mt-1">{partner.article.title}</h4>
        </div>

        <div className="mt-2 prose prose-sm max-w-none">
          <blockquote className="pl-4 border-l-2 border-pink-500/60 italic text-gray-600">
            "{partner.article.excerpt}"
          </blockquote>
        </div>

        <a
          href={partner.article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1.5 text-purple-600 hover:text-pink-500 transition-colors duration-300 font-medium"
        >
          Read Full Article
          <ExternalLink className="h-4 w-4" />
        </a>

        <div className="mt-auto pt-4 text-xs text-gray-400">Feature and mention may vary by publication</div>
      </motion.div>
    </div>
  )
}

export default PressReferenceContent
