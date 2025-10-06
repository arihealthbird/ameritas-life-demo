"use client"

import { useRef } from "react"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import AsSeenOnSection from "@/components/AsSeenOnSection"
import AIPoweredSection from "@/components/AIPoweredSection"
import AppSection from "@/components/AppSection"
import FAQSection from "@/components/FAQSection"
import Footer from "@/components/Footer"
import WorkflowSection from "@/components/WorkflowSection"
import TrustSection from "@/components/TrustSection"
import ReviewsSection from "@/components/ReviewsSection"

export default function Home() {
  const zipCodeFormRef = useRef<HTMLDivElement>(null)

  const scrollToZipForm = () => {
    zipCodeFormRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white overflow-x-hidden">
        <Hero zipCodeFormRef={zipCodeFormRef} />
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col overflow-hidden">
          <div className="space-y-6 text-center mb-12 max-w-3xl mx-auto">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-pink-500">All-in-one</span>
                <br />
                Life Insurance Platform
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Life insurance so simple, it's a breeze. Manage your Ameritas policy and secure your legacy from one
                place, with clear terms and coverage that makes sense.
              </p>
            </div>

            <button
              onClick={scrollToZipForm}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8 py-3 text-lg font-medium shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.03] mx-auto"
            >
              Explore Ameritas Life Plans
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-4xl">
            <div className="relative z-10 flex justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38c32404-69f1-4732-85eb-81947997bfd1-1EEz8bRiqxDmkRHVqfoQpKcOCR3vyc.png"
                alt="HealthBird mobile app interface showing life insurance policy management features"
                className="w-full max-w-full h-auto rounded-3xl object-contain"
              />
            </div>
          </div>
        </div>
        <WorkflowSection onGetStartedClick={scrollToZipForm} />
        <TrustSection />
        <AIPoweredSection onGetStartedClick={scrollToZipForm} />
        <ReviewsSection />
        <AsSeenOnSection />
        <AppSection />
        <FAQSection />
        <Footer />
      </main>
    </>
  )
}
