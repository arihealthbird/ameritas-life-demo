"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer"
import { useEffect, useState } from "react"

export default function GlobalFooter() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Handle client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) return null

  // Exclude footer from specific pages
  const excludedPaths = ["/", "/zipcode"]
  if (excludedPaths.includes(pathname)) {
    return null
  }

  // Log for debugging
  console.log("Rendering footer on path:", pathname)

  return <Footer />
}
