"use client"

import type React from "react"
import { Heart } from "lucide-react"

interface FormFooterCopyrightProps {
  isMobile?: boolean
}

const FormFooterCopyright: React.FC<FormFooterCopyrightProps> = ({ isMobile = false }) => {
  const currentYear = new Date().getFullYear()

  const containerClass = isMobile ? "flex flex-col items-center text-center" : "flex items-center justify-center"

  const textClass = isMobile ? "text-xs text-white/80" : "text-sm text-white/90"

  return (
    <div className={containerClass}>
      <span className={textClass}>
        © {currentYear} HealthBird • Made with{" "}
        <Heart size={isMobile ? 10 : 12} className="inline fill-current text-white mx-0.5" /> in Miami
      </span>
    </div>
  )
}

export default FormFooterCopyright
