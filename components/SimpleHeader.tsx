"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Phone } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Logo from "./Logo"
import LanguageToggle from "./header/LanguageToggle"
import LoginButton from "./header/LoginButton"
import { getUserDisplayName, getUserInitials } from "@/utils/headerUtils"
import ProfileButton from "./header/ProfileButton"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"

const SimpleHeader: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authUser, setAuthUser] = useState<any | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSaveProgress = () => {
    console.log("Save progress clicked")
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
        <Logo className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/")} />

        <div className="flex items-center space-x-4">
          {/* Desktop View */}
          <div className="hidden md:flex items-center space-x-4">
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

            <LanguageToggle />

            <BirdyAIFloatingButton
              title="Health Insurance Help"
              explanation="Get instant answers about health insurance, enrollment process, and coverage options."
              tips={[
                "Ask about specific health insurance terms",
                "Find out about available subsidies",
                "Learn about the enrollment process",
              ]}
            />

            {isAuthenticated ? (
              <ProfileButton
                displayName={getDisplayName()}
                email={authUser?.email}
                initials={getInitials()}
                logout={logout}
              />
            ) : (
              <LoginButton isHomePage={false} onClick={isAuthenticated ? handleSaveProgress : handleLogin} />
            )}
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageToggle isMobile={true} />

            <BirdyAIFloatingButton
              title="Health Insurance Help"
              explanation="Get instant answers about health insurance, enrollment process, and coverage options."
              tips={[
                "Ask about specific health insurance terms",
                "Find out about available subsidies",
                "Learn about the enrollment process",
              ]}
            />

            <a href="tel:8333842473" className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
              <Phone size={18} className="text-pink-500" />
            </a>

            {isAuthenticated ? (
              <ProfileButton
                displayName={getDisplayName()}
                email={authUser?.email}
                initials={getInitials()}
                logout={logout}
                isMobile={true}
              />
            ) : (
              <LoginButton
                isHomePage={false}
                onClick={isAuthenticated ? handleSaveProgress : handleLogin}
                isMobile={true}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader
