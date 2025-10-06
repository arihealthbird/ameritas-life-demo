"use client"

import type React from "react"
import FooterBirdLogo from "./FooterBirdLogo"
import FormFooterCopyright from "./FormFooterCopyright"
import FormFooterLinks from "./FormFooterLinks"
import FormFooterLegal from "./FormFooterLegal"

interface MobileFormFooterProps {
  mobileBirdRef: React.RefObject<HTMLDivElement>
  mobileLinksRef: React.RefObject<HTMLDivElement>
}

const MobileFormFooter: React.FC<MobileFormFooterProps> = ({ mobileBirdRef, mobileLinksRef }) => {
  return (
    <div className="md:hidden bg-gradient-to-br from-pink-500/90 via-purple-600/90 to-pink-600/90 rounded-t-[40px] px-4 py-6 relative">
      <FooterBirdLogo isMobile refProp={mobileBirdRef} />

      <div className="max-w-7xl mx-auto pt-2">
        <div className="flex flex-col space-y-6">
          <FormFooterCopyright isMobile />
          <FormFooterLinks isMobile refProp={mobileLinksRef} />
          <div className="mt-2 pt-2 border-t border-white/20">
            <FormFooterLegal isMobile />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileFormFooter
