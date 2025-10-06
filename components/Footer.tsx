"use client"

import type React from "react"
import { useRef } from "react"
import { Heart } from "lucide-react"
import FooterContainer from "./FooterContainer"
import FooterLinks from "./FooterLinks"
import FooterSocialLinks from "./FooterSocialLinks"
import FooterLegal from "./FooterLegal"
import FooterBirdLogo from "./FooterBirdLogo"
import MobileFormFooter from "./MobileFormFooter"
import DesktopFormFooter from "./DesktopFormFooter"

const Footer: React.FC = () => {
  const birdRef = useRef<HTMLDivElement>(null)
  const mobileBirdRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const mobileLinksRef = useRef<HTMLDivElement>(null)

  return (
    <footer className="bg-gray-50 py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Bird logo positioned at the top center */}
        <FooterBirdLogo refProp={birdRef} />
        <FooterBirdLogo refProp={mobileBirdRef} isMobile={true} />

        <FooterContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Ready to find your perfect life insurance plan?</h2>
              <p className="text-white/80">
                Join thousands of satisfied customers who found affordable life insurance coverage with HealthBird.
              </p>
              <a
                href="#"
                className="inline-flex items-center bg-white text-purple-600 hover:text-pink-500 px-6 py-3 rounded-full font-medium transition-colors duration-300"
              >
                Get Started <Heart className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Connect with us</h3>
                <FooterSocialLinks />
              </div>
              <div>
                <p className="text-white/80">
                  Questions? Call us at{" "}
                  <a href="tel:8333842473" className="text-white font-medium hover:underline">
                    (833) 384-2473
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 pb-4">
            <FooterLinks />
          </div>

          <div className="border-t border-white/10 pt-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-sm text-white/90">© {new Date().getFullYear()} HealthBird. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <a href="/privacy" className="text-sm text-white/75 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-sm text-white/75 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="/accessibility" className="text-sm text-white/75 hover:text-white transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <FooterLegal />
          </div>
        </FooterContainer>
      </div>

      {/* Form Footer for mobile and desktop */}
      <div className="hidden">
        <MobileFormFooter mobileBirdRef={mobileBirdRef} mobileLinksRef={mobileLinksRef} />
        <DesktopFormFooter birdRef={birdRef} linksRef={linksRef} />
      </div>
    </footer>
  )
}

export default Footer
