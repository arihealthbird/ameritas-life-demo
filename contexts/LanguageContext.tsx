"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    "nav.login": "Log In",
    "nav.saveProgress": "Save Progress",
    "nav.app": "App",
    "nav.blog": "Blog",
    "nav.shopHealthPlans": "Health Plans",
    "nav.shopDental": "Dental Coverage",
    "nav.shopVision": "Vision Insurance",
    "nav.shopMedicare": "Medicare",
    "nav.quickLinks": "Quick Links",
    "nav.privacyPolicy": "Privacy Policy",
    "nav.termsOfService": "Terms of Service",
    "nav.ccpa": "CCPA",
    "profile.myProfile": "My Profile",
    "profile.signOut": "Sign Out",
    "language.en": "English",
    "language.es": "Spanish",
    // FAQ translations
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Everything you need to know about finding the perfect health insurance plan with HealthBird.",
    "faq.general": "General",
    "faq.plans": "Plans & Coverage",
    "faq.enrollment": "Enrollment & Subsidies",
    "faq.support": "Support & Resources",
  },
  es: {
    "nav.login": "Iniciar Sesión",
    "nav.saveProgress": "Guardar Progreso",
    "nav.app": "Aplicación",
    "nav.blog": "Blog",
    "nav.shopHealthPlans": "Planes de Salud",
    "nav.shopDental": "Cobertura Dental",
    "nav.shopVision": "Seguro de Visión",
    "nav.shopMedicare": "Medicare",
    "nav.quickLinks": "Enlaces Rápidos",
    "nav.privacyPolicy": "Política de Privacidad",
    "nav.termsOfService": "Términos de Servicio",
    "nav.ccpa": "CCPA",
    "profile.myProfile": "Mi Perfil",
    "profile.signOut": "Cerrar Sesión",
    "language.en": "Inglés",
    "language.es": "Español",
    // FAQ translations
    "faq.title": "Preguntas Frecuentes",
    "faq.subtitle":
      "Todo lo que necesitas saber sobre cómo encontrar el plan de seguro de salud perfecto con HealthBird.",
    "faq.general": "General",
    "faq.plans": "Planes y Cobertura",
    "faq.enrollment": "Inscripción y Subsidios",
    "faq.support": "Soporte y Recursos",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
