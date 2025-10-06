import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Toaster } from "@/components/ui/toaster"
import { AuthModalProvider } from "@/components/auth/AuthModalProvider"
import GlobalFooter from "@/components/GlobalFooter"
import PageTransition from "@/components/PageTransition"

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HealthBird",
  description: "Find affordable health insurance with HealthBird",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <PageTransition>{children}</PageTransition>
          <GlobalFooter />
          <AuthModalProvider />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
