"use client"

import type React from "react"

interface FooterLogoProps {
  className?: string
}

const FooterLogo: React.FC<FooterLogoProps> = ({ className }) => {
  return (
    <img
      src="/images/healthbird-logo.png"
      alt="HealthBird"
      className={className || "h-10 w-auto object-contain brightness-0 invert opacity-90"}
    />
  )
}

export default FooterLogo
