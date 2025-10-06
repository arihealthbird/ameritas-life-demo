"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { animate, stagger, inView } from "motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"

interface FooterLinkItem {
  text: string
  textEs: string
  href: string
}

interface FooterSection {
  title: string
  titleEs: string
  links: FooterLinkItem[]
}

const FooterLinks: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  // Track open/closed state for each collapsible section
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
  const { language } = useLanguage()

  const footerSections: FooterSection[] = [
    {
      title: "Company",
      titleEs: "Empresa",
      links: [
        {
          text: "About Us",
          textEs: "Sobre Nosotros",
          href: "/about",
        },
        {
          text: "Contact",
          textEs: "Contacto",
          href: "/contact",
        },
        {
          text: "Careers",
          textEs: "Carreras",
          href: "/careers",
        },
        {
          text: "Features",
          textEs: "Características",
          href: "/features",
        },
      ],
    },
    {
      title: "Product",
      titleEs: "Producto",
      links: [
        {
          text: "Health",
          textEs: "Salud",
          href: "/health",
        },
        {
          text: "Dental",
          textEs: "Dental",
          href: "/dental",
        },
        {
          text: "Vision",
          textEs: "Visión",
          href: "/vision",
        },
        {
          text: "TravelBird",
          textEs: "TravelBird",
          href: "/travelbird",
        },
      ],
    },
    {
      title: "Resources",
      titleEs: "Recursos",
      links: [
        {
          text: "Blog",
          textEs: "Blog",
          href: "/blog",
        },
        {
          text: "Help Center",
          textEs: "Centro de Ayuda",
          href: "/help-center",
        },
        {
          text: "Security",
          textEs: "Seguridad",
          href: "/security",
        },
        {
          text: "Status",
          textEs: "Estado",
          href: "/status",
        },
      ],
    },
    {
      title: "Legal",
      titleEs: "Legal",
      links: [
        {
          text: "Privacy Policy",
          textEs: "Política de Privacidad",
          href: "/privacy-policy",
        },
        {
          text: "Terms of Service",
          textEs: "Términos de Servicio",
          href: "/terms-of-service",
        },
        {
          text: "Cookie Policy",
          textEs: "Política de Cookies",
          href: "/cookie-policy",
        },
        {
          text: "EULA",
          textEs: "EULA",
          href: "/eula",
        },
      ],
    },
  ]

  // Toggle the open state of a section
  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  useEffect(() => {
    // Animate sections with staggered fade-in
    if (sectionRefs.current.length) {
      const sections = sectionRefs.current.filter(Boolean)
      sections.forEach((section) => {
        if (section) {
          const links = section.querySelectorAll("li")
          inView(section, () => {
            animate(section, { y: [10, 0] }, { duration: 0.4 })

            animate(
              links,
              { x: [-5, 0] },
              {
                delay: stagger(0.05),
                duration: 0.3,
              },
            )
            return () => {} // Cleanup function
          })
        }
      })
    }
  }, [])

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:grid md:grid-cols-4 gap-5">
        {footerSections.map((section, index) => (
          <div key={section.title} className="flex flex-col gap-2.5" ref={(el) => (sectionRefs.current[index] = el)}>
            <h3 className="font-semibold text-white/90">{language === "en" ? section.title : section.titleEs}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className="text-white/75 hover:text-white text-sm transition-all duration-200 ease-in-out hover:translate-x-1 inline-block"
                  >
                    {language === "en" ? link.text : link.textEs}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile view with collapsible sections */}
      <div className="md:hidden space-y-1.5">
        {footerSections.map((section, index) => (
          <Collapsible
            key={section.title}
            open={openSections[section.title] || false}
            onOpenChange={() => toggleSection(section.title)}
            className="border-b border-white/10 pb-1.5 last:border-b-0"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5">
              <h3 className="font-semibold text-white/90">{language === "en" ? section.title : section.titleEs}</h3>
              {openSections[section.title] ? (
                <ChevronUp className="h-4 w-4 text-white/75" />
              ) : (
                <ChevronDown className="h-4 w-4 text-white/75" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 py-1.5">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="text-white/75 hover:text-white text-sm transition-all duration-200 inline-block"
                    >
                      {language === "en" ? link.text : link.textEs}
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  )
}

export default FooterLinks
