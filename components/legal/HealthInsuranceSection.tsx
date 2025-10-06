"use client"

import type React from "react"
import { ExternalLink } from "lucide-react"
import { Separator } from "../../ui/separator"
import { useLanguage } from "@/contexts/LanguageContext"

const HealthInsuranceSection: React.FC = () => {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Health Insurance",
      text1:
        "Attention: This website is operated by InsuranceBird Agency a Division of Reflekt Technologies Corporation and is not the Health Insurance Marketplace® website. In offering this website, InsuranceBird, as a Division of Reflekt Technologies Corporation, is required to comply with all applicable federal law, including the standards established under 45 CFR §§155.220(c) and (d) and standards established under 45 CFR §155.260 to protect the privacy and security of personally identifiable information. This website may not display all data on Qualified Health Plans (QHPs) being offered in your state through the Health Insurance Marketplace® website. To see all available data on QHP options in your state, go to the Health Insurance Marketplace® website at",
      text2:
        "InsuranceBird offers the opportunity to enroll in either QHPs or off-Marketplace coverage. Please visit HealthCare.gov for information on the benefits of enrolling in a QHP. Off-Marketplace coverage is not eligible for the cost savings offered for coverage through the Marketplaces.",
    },
    es: {
      title: "Seguro de Salud",
      text1:
        "Atención: Este sitio web es operado por InsuranceBird Agency, una División de Reflekt Technologies Corporation y no es el sitio web del Mercado de Seguros Médicos®. Al ofrecer este sitio web, InsuranceBird, como División de Reflekt Technologies Corporation, debe cumplir con todas las leyes federales aplicables, incluidos los estándares establecidos en 45 CFR §§155.220(c) y (d) y los estándares establecidos en 45 CFR §155.260 para proteger la privacidad y seguridad de la información personal identificable. Este sitio web puede no mostrar todos los datos sobre los Planes de Salud Calificados (QHPs) que se ofrecen en su estado a través del sitio web del Mercado de Seguros Médicos®. Para ver todos los datos disponibles sobre las opciones de QHP en su estado, visite el sitio web del Mercado de Seguros Médicos® en",
      text2:
        "InsuranceBird ofrece la oportunidad de inscribirse en QHPs o en cobertura fuera del Mercado. Visite HealthCare.gov para obtener información sobre los beneficios de inscribirse en un QHP. La cobertura fuera del Mercado no es elegible para los ahorros de costos ofrecidos a través de los Mercados.",
    },
  }

  return (
    <div>
      <h3 className="font-semibold mb-2 text-sm text-white">{content[language].title}</h3>
      <Separator className="mb-3 bg-white/20" />
      <p className="mb-3 leading-relaxed">
        {content[language].text1}{" "}
        <a
          href="https://HealthCare.gov"
          className="text-white hover:underline inline-flex items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          HealthCare.gov
          <ExternalLink size={10} className="ml-0.5" />
        </a>
      </p>
      <p className="leading-relaxed">{content[language].text2}</p>
    </div>
  )
}

export default HealthInsuranceSection
