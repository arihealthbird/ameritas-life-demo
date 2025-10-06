"use client"

import type React from "react"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface FormFooterLinksProps {
  isMobile?: boolean
  refProp: React.RefObject<HTMLDivElement>
}

const FormFooterLinks: React.FC<FormFooterLinksProps> = ({ isMobile = false, refProp }) => {
  const linksClass = isMobile
    ? "flex flex-wrap justify-center gap-x-2 gap-y-1.5 text-xs px-2"
    : "flex justify-center space-x-4 text-sm"

  return (
    <div className={linksClass} ref={refProp}>
      <Link
        prefetch
        href="/privacy-policy"
        className={`text-white${isMobile ? "/80" : "/90"} hover:text-white transition-colors`}
      >
        Privacy Policy
      </Link>
      <span className={`text-white/${isMobile ? "40" : "50"}`}>|</span>
      <Link
        prefetch
        href="/terms-of-service"
        className={`text-white${isMobile ? "/80" : "/90"} hover:text-white transition-colors`}
      >
        Terms of Service
      </Link>
      <span className={`text-white/${isMobile ? "40" : "50"}`}>|</span>
      <a
        href="https://www.healthbird.com/privacy-choices"
        className={`text-white${isMobile ? "/80" : "/90"} hover:text-white transition-colors inline-flex items-center`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Your Privacy Choices
        <ExternalLink size={isMobile ? 10 : 12} className="ml-1" />
      </a>
    </div>
  )
}

export default FormFooterLinks
