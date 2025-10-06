"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { animate, inView } from "motion"
import { motionAnimations } from "@/theme/animations"
import FooterLogo from "./FooterLogo"

interface FooterContainerProps {
  children: React.ReactNode
}

const FooterContainer: React.FC<FooterContainerProps> = ({ children }) => {
  const footerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate footer on scroll into view
    if (footerRef.current) {
      inView(footerRef.current, () => {
        animate(footerRef.current, { y: [30, 0] }, { duration: 0.7 })
        return () => {} // Cleanup function
      })
    }

    // Animate logo with popIn effect
    if (logoRef.current) {
      inView(logoRef.current, () => {
        animate(logoRef.current, motionAnimations.popIn, { duration: 0.7 })
        return () => {} // Cleanup function
      })
    }
  }, [])

  return (
    <div
      ref={footerRef}
      className="bg-gradient-to-br from-pink-500/90 via-purple-600/90 to-pink-600/90 rounded-3xl shadow-xl backdrop-blur-sm p-8 md:p-12 relative overflow-hidden"
    >
      {/* Bird Logo in top right - absolute positioned */}
      <div ref={logoRef} className="absolute top-4 right-4 w-12 h-12 group transition-all duration-300 hover:scale-105">
        <div className="relative w-full h-full">
          {/* Ambient glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 transform-gpu scale-150" />

          {/* Base layer with logo */}
          <FooterLogo className="w-full h-full object-contain brightness-0 invert opacity-90 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.3)] filter group-hover:drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]" />
        </div>
      </div>
      {children}
    </div>
  )
}

export default FooterContainer
