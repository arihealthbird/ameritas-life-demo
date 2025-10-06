"use client"

import type React from "react"
import { Globe } from "lucide-react"
import { useLanguage, type Language } from "@/contexts/LanguageContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  isMobile?: boolean
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ isMobile = false }) => {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full text-purple-600 hover:text-white overflow-hidden"
        onClick={() => handleLanguageChange(language === "en" ? "es" : "en")}
      >
        <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
        <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-purple-600 to-pink-500 transition-opacity duration-300"></span>
        <Globe size={20} className="relative z-10 hover:scale-110 transition-transform duration-300" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative group overflow-hidden rounded-full text-purple-600 hover:text-white",
            "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500",
            "transition-all duration-300 flex items-center px-4 py-2",
          )}
        >
          <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600 to-pink-500 transition-opacity duration-300"></span>
          <Globe size={16} className="mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10 font-medium">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          className={cn("cursor-pointer", language === "en" ? "bg-purple-600/10" : "")}
          onClick={() => handleLanguageChange("en")}
        >
          {t("language.en")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", language === "es" ? "bg-purple-600/10" : "")}
          onClick={() => handleLanguageChange("es")}
        >
          {t("language.es")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageToggle
