"use client"

import type React from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import HealthInsuranceSection from "./legal/HealthInsuranceSection"
import CaliforniaSection from "./legal/CaliforniaSection"
import CopyrightSection from "./legal/CopyrightSection"
import { ExternalLink } from "lucide-react"

interface FormFooterLegalProps {
  isMobile?: boolean
}

const FormFooterLegal: React.FC<FormFooterLegalProps> = ({ isMobile = false }) => {
  const { language } = useLanguage()

  // For mobile, show improved and complete version
  if (isMobile) {
    return (
      <div className="text-[11px] text-white/80 mx-auto leading-tight space-y-3 max-w-full px-2">
        <div className="space-y-2">
          <p>
            {language === "en"
              ? "This website is operated by InsuranceBird and is not the Health Insurance Marketplace® website."
              : "Este sitio web es operado por InsuranceBird y no es el sitio web del Mercado de Seguros Médicos®."}
          </p>
          <p>
            {language === "en"
              ? "InsuranceBird complies with Federal law under 45 CFR 155.220(c) and (d) and 45 CFR 155.260."
              : "InsuranceBird cumple con la ley federal bajo 45 CFR 155.220(c) y (d) y 45 CFR 155.260."}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            {language === "en"
              ? "This site is not affiliated with Covered California. Contact information belongs to InsuranceBird."
              : "Este sitio no está afiliado a Covered California. La información de contacto pertenece a InsuranceBird."}
          </p>
        </div>

        <p className="flex items-center justify-center gap-1">
          <span>{language === "en" ? "For all QHP options, visit" : "Para todas las opciones de QHP, visite"}</span>
          <a
            href="https://HealthCare.gov"
            className="text-white hover:underline inline-flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            HealthCare.gov
            <ExternalLink size={8} className="ml-0.5" />
          </a>
        </p>

        <p className="text-center text-[10px] text-white/70">
          {language === "en"
            ? "Apple®, App Store®, Google Play and their logos are trademarks of their respective owners."
            : "Apple®, App Store®, Google Play y sus logotipos son marcas comerciales de sus respectivos propietarios."}
        </p>
      </div>
    )
  }

  // Desktop version - using our modular components
  return (
    <div className="text-[11px] text-white/90 max-w-4xl mx-auto backdrop-blur-sm">
      <div className="space-y-6">
        <HealthInsuranceSection />
        <CaliforniaSection />
        <CopyrightSection />
      </div>
    </div>
  )
}

export default FormFooterLegal
