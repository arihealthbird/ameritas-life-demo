"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Logo from "./Logo"
import DesktopNavigation from "./header/DesktopNavigation"
import MobileNavigation from "./header/MobileNavigation"
import { getUserDisplayName, getUserInitials } from "@/utils/headerUtils"

const Header: React.FC = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authUser, setAuthUser] = useState<any | null>(null)

  const isHomePage = pathname === "/"
  const isPlanMatchPage = pathname?.includes("/plans") || false

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSaveProgress = () => {
    console.log("Save progress or login clicked")
    // In a real app, this would open a login modal or redirect to login page
  }

  const logout = () => {
    console.log("Logout clicked")
    setIsAuthenticated(false)
    setAuthUser(null)
    // In a real app, this would handle the logout process
  }

  const handleLogin = () => {
    // Simulate login for demo purposes
    setIsAuthenticated(true)
    setAuthUser({
      email: "user@example.com",
      user_metadata: {
        name: "John Doe",
      },
    })
  }

  // For demo purposes, let's add a way to toggle authentication state
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "l" && e.ctrlKey) {
        if (isAuthenticated) {
          logout()
        } else {
          handleLogin()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isAuthenticated])

  const getDisplayName = () => getUserDisplayName(authUser)
  const getInitials = () => getUserInitials(getDisplayName())

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo className="flex-shrink-0" />

        <DesktopNavigation
          isHomePage={isHomePage}
          isPlanMatchPage={isPlanMatchPage}
          isAuthenticated={isAuthenticated}
          authUser={authUser}
          handleSaveProgress={isAuthenticated ? handleSaveProgress : handleLogin}
          logout={logout}
          getUserDisplayName={getDisplayName}
          getUserInitials={getInitials}
        />

        <MobileNavigation
          isHomePage={isHomePage}
          isPlanMatchPage={isPlanMatchPage}
          isAuthenticated={isAuthenticated}
          authUser={authUser}
          handleSaveProgress={isAuthenticated ? handleSaveProgress : handleLogin}
          logout={logout}
          getUserDisplayName={getDisplayName}
          getUserInitials={getInitials}
        />
      </div>
    </header>
  )
}

export default Header
