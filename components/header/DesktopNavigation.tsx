"use client"

import type React from "react"
import { Phone } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import ShopDropdown from "./ShopDropdown"
import ProfileButton from "./ProfileButton"
import LoginButton from "./LoginButton"
import LanguageToggle from "./LanguageToggle"

interface DesktopNavigationProps {
  isHomePage: boolean
  isPlanMatchPage: boolean
  isAuthenticated: boolean
  authUser: any | null
  handleSaveProgress: () => void
  logout: () => void
  getUserDisplayName: () => string
  getUserInitials: () => string
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isHomePage,
  isPlanMatchPage,
  isAuthenticated,
  authUser,
  handleSaveProgress,
  logout,
  getUserDisplayName,
  getUserInitials,
}) => {
  const { t } = useLanguage()

  const scrollToAppSection = () => {
    const appSection = document.getElementById("app-section")
    if (appSection) {
      appSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="hidden md:flex items-center space-x-6">
      <nav className="flex items-center space-x-6 mr-6">
        {/* Homepage-only navigation items */}
        {isHomePage && (
          <>
            <ShopDropdown />
            <a
              href="#app-section"
              onClick={(e) => {
                e.preventDefault()
                scrollToAppSection()
              }}
              className="text-gray-600 hover:text-pink-500 transition-colors group"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-pink-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                {t("nav.app")}
              </span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-500 transition-colors group"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-pink-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                {t("nav.blog")}
              </span>
            </a>
          </>
        )}

        <a
          href="tel:8333842473"
          className="flex items-center text-gray-600 hover:text-pink-500 transition-colors group"
        >
          <span className="relative flex items-center">
            <Phone size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -inset-2 bg-pink-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          </span>
          <span className="text-sm font-medium hover-text-underline">(833) 384-2473</span>
        </a>
      </nav>

      <div className="flex items-center space-x-4">
        <LanguageToggle />

        {isAuthenticated ? (
          <ProfileButton
            displayName={getUserDisplayName()}
            email={authUser?.email}
            initials={getUserInitials()}
            logout={logout}
          />
        ) : (
          <LoginButton isHomePage={isHomePage} onClick={handleSaveProgress} />
        )}
      </div>
    </div>
  )
}

export default DesktopNavigation
