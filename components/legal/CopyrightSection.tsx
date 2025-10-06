"use client"

import type React from "react"
import { Separator } from "../../ui/separator"
import { useLanguage } from "@/contexts/LanguageContext"

const CopyrightSection: React.FC = () => {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Copyright",
      text: "Apple®, the Apple logo®, and the App Store®, are trademarks of Apple, Inc.; Google Play and the Google Play logo are trademarks of Google, Inc.",
    },
    es: {
      title: "Derechos de Autor",
      text: "Apple®, el logotipo de Apple® y App Store® son marcas comerciales de Apple, Inc.; Google Play y el logotipo de Google Play son marcas comerciales de Google, Inc.",
    },
  }

  return (
    <div>
      <h3 className="font-bold text-white mb-2 text-base">{content[language].title}</h3>
      <Separator className="mb-2 bg-white/20" />
      <p>{content[language].text}</p>
    </div>
  )
}

export default CopyrightSection
