"use client"

import type React from "react"
import { Separator } from "../../ui/separator"
import { useLanguage } from "@/contexts/LanguageContext"

const CaliforniaSection: React.FC = () => {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Health Insurance (California)",
      text: "This site is not maintained by or affiliated with Covered California, and Covered California bears no responsibility for its content. The e-mail addresses and telephone number that appears throughout this site belong to HealthBird / InsuranceBird a Division of Reflekt Technologies Corporation and cannot be used to contact Covered California.",
    },
    es: {
      title: "Seguro de Salud (California)",
      text: "Este sitio no es mantenido ni está afiliado a Covered California, y Covered California no se hace responsable de su contenido. Las direcciones de correo electrónico y el número de teléfono que aparecen en este sitio pertenecen a HealthBird / InsuranceBird, una División de Reflekt Technologies Corporation y no pueden utilizarse para contactar a Covered California.",
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

export default CaliforniaSection
