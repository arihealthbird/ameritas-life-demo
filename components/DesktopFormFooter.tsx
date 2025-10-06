"use client"

import type React from "react"
import FooterBirdLogo from "./FooterBirdLogo"
import FormFooterCopyright from "./FormFooterCopyright"
import FormFooterLinks from "./FormFooterLinks"
import FormFooterLegal from "./FormFooterLegal"

interface DesktopFormFooterProps {
  birdRef: React.RefObject<HTMLDivElement>
  linksRef: React.RefObject<HTMLDivElement>
}

const DesktopFormFooter: React.FC<DesktopFormFooterProps> = ({ birdRef, linksRef }) => {
  return (
    <div className="hidden md:block bg-gradient-to-br from-pink-500/90 via-purple-600/90 to-pink-600/90 rounded-t-[40px] px-8 py-10 relative">
      <FooterBirdLogo refProp={birdRef} />

      <div className="max-w-7xl mx-auto pt-4">
        <div className="flex flex-col space-y-8">
          <FormFooterCopyright />
          <FormFooterLinks refProp={linksRef} />
          <div className="mt-4 pt-4 border-t border-white/20">
            <FormFooterLegal />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopFormFooter
