"use client"

import type React from "react"
import { LogIn, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuthModal } from "@/hooks/use-auth-modal"

interface LoginButtonProps {
  isHomePage: boolean
  onClick?: () => void
  isMobile?: boolean
}

const LoginButton: React.FC<LoginButtonProps> = ({ isHomePage, onClick, isMobile = false }) => {
  const { t } = useLanguage()
  const buttonText = isHomePage ? t("nav.login") : t("nav.saveProgress")
  const authModal = useAuthModal()

  const handleClick = () => {
    authModal.onOpen(isHomePage ? "login" : "signup")
    if (onClick) onClick()
  }

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full text-purple-600 hover:text-white overflow-hidden"
        onClick={handleClick}
      >
        <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
        <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-purple-600 to-pink-500 transition-opacity duration-300"></span>
        {isHomePage ? (
          <LogIn size={20} className="relative z-10 hover:scale-110 transition-transform duration-300" />
        ) : (
          <Save size={20} className="relative z-10 hover:scale-110 transition-transform duration-300" />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative group overflow-hidden rounded-full text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 transition-all duration-300 flex items-center px-5 py-2"
      onClick={handleClick}
    >
      <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600 to-pink-500 transition-opacity duration-300"></span>
      {isHomePage ? (
        <LogIn size={16} className="mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      ) : (
        <Save size={16} className="mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      )}
      <span className="relative z-10 font-medium">{buttonText}</span>
    </Button>
  )
}

export default LoginButton
