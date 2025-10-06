"use client"

import type React from "react"
import { Phone, Menu, User, LogOut, LogIn, Home, Mail, FileText, ChevronRight, X } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Logo from "../Logo"
import ProfileButton from "./ProfileButton"
import LoginButton from "./LoginButton"
import LanguageToggle from "./LanguageToggle"

interface MobileNavigationProps {
  isHomePage: boolean
  isPlanMatchPage: boolean
  isAuthenticated: boolean
  authUser: any | null
  handleSaveProgress: () => void
  logout: () => void
  getUserDisplayName: () => string
  getUserInitials: () => string
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
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
  const displayName = getUserDisplayName()
  const initials = getUserInitials()

  const scrollToAppSection = () => {
    const appSection = document.getElementById("app-section")
    if (appSection) {
      appSection.scrollIntoView({ behavior: "smooth" })
      // Close the mobile menu drawer after navigation
      const closeButton = document.querySelector("[data-radix-collection-item]")
      if (closeButton instanceof HTMLElement) {
        closeButton.click()
      }
    }
  }

  return (
    <div className="md:hidden flex items-center space-x-1">
      {/* Language Toggle */}
      <LanguageToggle isMobile={true} />

      <a href="tel:8333842473" className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
        <Phone size={18} className="text-pink-500" />
      </a>

      {isAuthenticated ? (
        <ProfileButton
          displayName={displayName}
          email={authUser?.email}
          initials={initials}
          logout={logout}
          isMobile={true}
        />
      ) : (
        <LoginButton isHomePage={isHomePage} onClick={handleSaveProgress} isMobile={true} />
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-pink-500 hover:bg-pink-500/5">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0 flex flex-col">
          <div className="py-5 px-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <SheetClose className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
              <X size={20} />
            </SheetClose>
          </div>

          {isAuthenticated && (
            <div className="mt-4 mx-4 p-4 bg-gradient-to-r from-purple-600/10 to-pink-500/10 rounded-xl">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{authUser?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <a
                  href="/profile"
                  className="flex items-center justify-center px-3 py-2 text-sm text-purple-600 bg-white rounded-lg border border-purple-600/20 shadow-sm hover:bg-purple-600/5 transition-all"
                >
                  <User size={16} className="mr-2" />
                  {t("profile.myProfile")}
                </a>

                <button
                  onClick={logout}
                  className="flex items-center justify-center px-3 py-2 text-sm text-pink-500 bg-white rounded-lg border border-pink-500/20 shadow-sm hover:bg-pink-500/5 transition-all"
                >
                  <LogOut size={16} className="mr-2" />
                  {t("profile.signOut")}
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto py-2 px-4">
            {isHomePage && (
              <div className="space-y-1.5 py-2">
                <a
                  href="/"
                  className="flex items-center justify-between py-2.5 px-4 text-gray-700 hover:text-pink-500 bg-white hover:bg-pink-500/5 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Home size={18} className="mr-3 text-purple-600" />
                    <span className="font-medium">Home</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </a>

                <div className="mt-2 mb-2">
                  <div className="px-4 py-2">
                    <span className="block text-sm font-semibold text-gray-700 mb-1.5">Shop</span>
                    <div className="pl-4 space-y-2.5 mt-2">
                      <a
                        href="#"
                        className="flex items-center py-1.5 text-sm text-gray-600 hover:text-pink-500 transition-colors"
                      >
                        <ChevronRight size={14} className="mr-1 text-pink-500" />
                        {t("nav.shopHealthPlans")}
                      </a>
                      <a
                        href="#"
                        className="flex items-center py-1.5 text-sm text-gray-600 hover:text-pink-500 transition-colors"
                      >
                        <ChevronRight size={14} className="mr-1 text-pink-500" />
                        {t("nav.shopDental")}
                      </a>
                      <a
                        href="#"
                        className="flex items-center py-1.5 text-sm text-gray-600 hover:text-pink-500 transition-colors"
                      >
                        <ChevronRight size={14} className="mr-1 text-pink-500" />
                        {t("nav.shopVision")}
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href="#app-section"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToAppSection()
                  }}
                  className="flex items-center py-2.5 px-4 text-gray-700 hover:text-pink-500 bg-white hover:bg-pink-500/5 rounded-lg transition-colors"
                >
                  <Mail size={18} className="mr-3 text-purple-600" />
                  <span className="font-medium">{t("nav.app")}</span>
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center py-2.5 px-4 text-gray-700 hover:text-pink-500 bg-white hover:bg-pink-500/5 rounded-lg transition-colors"
                >
                  <FileText size={18} className="mr-3 text-purple-600" />
                  <span className="font-medium">{t("nav.blog")}</span>
                </a>

                <Separator className="my-3 bg-gray-200" />
              </div>
            )}

            <a
              href="tel:8333842473"
              className="flex items-center py-2.5 px-4 text-gray-700 hover:text-pink-500 bg-white hover:bg-pink-500/5 rounded-lg transition-colors mt-1"
            >
              <Phone size={18} className="mr-3 text-pink-500" />
              <span className="font-medium">(833) 384-2473</span>
            </a>

            {!isAuthenticated && (
              <div className="mt-4 px-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full h-11 border border-purple-600 text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:border-transparent transition-all duration-300"
                  onClick={handleSaveProgress}
                >
                  <LogIn size={16} className="mr-2" />
                  <span>{isHomePage ? t("nav.login") : t("nav.saveProgress")}</span>
                </Button>
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-gray-200 pt-4 pb-6 px-6">
            <div className="text-xs text-gray-500 mb-2.5 font-medium">{t("nav.quickLinks")}</div>
            <div className="flex justify-between">
              <a href="/privacy-policy" className="text-xs text-gray-600 hover:text-pink-500">
                {t("nav.privacyPolicy")}
              </a>
              <a href="/terms-of-service" className="text-xs text-gray-600 hover:text-pink-500">
                {t("nav.termsOfService")}
              </a>
              <a href="/data-subject" className="text-xs text-gray-600 hover:text-pink-500">
                {t("nav.ccpa")}
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavigation
