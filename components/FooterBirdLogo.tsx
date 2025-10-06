"use client"

import type React from "react"

interface FooterBirdLogoProps {
  isMobile?: boolean
  refProp: React.RefObject<HTMLDivElement>
}

const FooterBirdLogo: React.FC<FooterBirdLogoProps> = ({ isMobile = false, refProp }) => {
  const topClass = isMobile ? "-top-10" : "-top-12"
  const sizeClass = isMobile ? "w-20 h-20" : "w-24 h-24"
  const positionClass = isMobile
    ? "absolute left-1/2 transform -translate-x-1/2"
    : "hidden md:block absolute left-1/2 transform -translate-x-1/2"

  return (
    <div className={`${positionClass} ${topClass} z-10`}>
      <div className={`relative ${sizeClass}`} ref={refProp}>
        {/* Logo and glow effects removed as requested */}
      </div>
    </div>
  )
}

export default FooterBirdLogo
