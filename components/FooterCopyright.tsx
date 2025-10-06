"use client"

import type React from "react"
import { Heart } from "lucide-react"

const FooterCopyright: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col items-center md:items-start md:flex-row md:space-x-3">
      <img
        src="/images/healthbird-logo.png"
        alt="HealthBird"
        className="h-6 w-auto object-contain brightness-0 invert opacity-90 mb-2 md:mb-0"
      />
      <span className="text-sm text-white/90 text-center md:text-left whitespace-normal">
        © {currentYear} - HealthBird • OneNest • Made with{" "}
        <Heart size={14} className="inline fill-current text-white" /> in Miami
      </span>
    </div>
  )
}

export default FooterCopyright
