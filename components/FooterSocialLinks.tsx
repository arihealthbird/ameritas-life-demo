"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Twitter, Instagram, Youtube } from "lucide-react"
import { animate, stagger, inView } from "motion"

const TiktokLogo: React.FC<{
  className?: string
}> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const FooterSocialLinks: React.FC = () => {
  const socialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate social icons
    if (socialRef.current) {
      const icons = socialRef.current.querySelectorAll("a")
      inView(socialRef.current, () => {
        animate(
          icons,
          {
            scale: [0.8, 1],
            y: [10, 0],
          },
          {
            delay: stagger(0.1),
            duration: 0.4,
          },
        )
        return () => {} // Cleanup function
      })
    }
  }, [])

  return (
    <div ref={socialRef} className="flex gap-6">
      <a
        href="https://twitter.com/healthbird"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/75 hover:text-white transition-all duration-200 hover:scale-110"
      >
        <Twitter size={20} />
      </a>
      <a
        href="https://www.tiktok.com/@healthbirdapp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/75 hover:text-white transition-all duration-200 hover:scale-110"
      >
        <TiktokLogo className="h-5 w-5" />
      </a>
      <a
        href="https://instagram.com/healthbird"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/75 hover:text-white transition-all duration-200 hover:scale-110"
      >
        <Instagram size={20} />
      </a>
      <a
        href="https://youtube.com/healthbird"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/75 hover:text-white transition-all duration-200 hover:scale-110"
      >
        <Youtube size={20} />
      </a>
    </div>
  )
}

export default FooterSocialLinks
