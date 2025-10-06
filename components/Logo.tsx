"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ className, onClick }) => {
  return (
    <Link href="/" className={className} onClick={onClick}>
      <div className="flex items-center">
        <Image
          src="/images/healthbird-logo.png"
          alt="Healthbird"
          width={140}
          height={32}
          className="h-auto w-auto max-h-8"
          priority
        />
      </div>
    </Link>
  )
}

export default Logo
