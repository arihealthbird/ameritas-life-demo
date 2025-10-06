"use client"

import React from "react"
import { useState } from "react"
import { Bot, Shield, Coins, MessageCircleQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Particles } from "@/components/ui/particles"

interface AIPoweredSectionProps {
  onGetStartedClick: () => void
}

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
  bgGradient: string
  expandedContent: React.ReactNode
}

const AIPoweredSection: React.FC<AIPoweredSectionProps> = ({ onGetStartedClick }) => {
  // Add this style element for the particle animation
  React.useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes float-particle {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
      50% { transform: translateY(-10px) translateX(5px); opacity: 0.5; }
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const featureItems: FeatureItem[] = [
    {
      icon: <Shield className="text-purple-600" size={28} />,
      title: "Personalized Coverage Calculation",
      description: "Our AI helps estimate the right amount of Ameritas life insurance for your needs.",
      bgGradient: "bg-gradient-to-r from-[#e5deff]/50 to-[#d3e4fd]/50",
      expandedContent: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Answer a few questions, and our AI will help estimate a suitable coverage amount based on your income,
            debts, and family needs.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Income replacement analysis</li>
            <li>Debt and mortgage coverage estimation</li>
            <li>Future education expenses for dependents</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Bot className="text-pink-500" size={28} />,
      title: "AI-Powered Plan Matching",
      description: "Our assistant helps you understand and compare Ameritas Term, Whole, and Universal life plans.",
      bgGradient: "bg-gradient-to-r from-[#ffdee2]/40 to-[#fef7cd]/50",
      expandedContent: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Birdy AI simplifies complex life insurance terms and highlights key differences between Ameritas plan types.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Clear explanations of Term vs. Whole vs. Universal life</li>
            <li>Side-by-side comparison of Ameritas plan features</li>
            <li>Guidance on choosing based on long-term goals</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Coins className="text-green-500" size={28} />,
      title: "Premium Estimates",
      description: "Get an idea of potential premiums for various Ameritas coverage options.",
      bgGradient: "bg-gradient-to-r from-[#f2fce2]/50 to-[#d3fdea]/50",
      expandedContent: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Our platform provides estimated premium ranges for different Ameritas life insurance scenarios to help you
            budget.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Estimated premiums for different coverage amounts</li>
            <li>Impact of term length on Term Life premiums</li>
            <li>Understanding factors affecting life insurance costs</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <MessageCircleQuestion className="text-blue-500" size={28} />,
      title: "Smart Support for Ameritas Policies",
      description: "Get answers to your questions about Ameritas life insurance instantly.",
      bgGradient: "bg-gradient-to-r from-[#d3e4fd]/50 to-[#fde1d3]/50",
      expandedContent: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Our AI-powered support helps you understand Ameritas policy details, beneficiary options, and more.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Instant answers to common life insurance questions</li>
            <li>Guidance on beneficiary designations</li>
            <li>Information on policy riders and options</li>
          </ul>
        </div>
      ),
    },
  ]

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else {
      setExpandedIndex(index)
    }
  }

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <Particles
        className="absolute inset-0 opacity-40"
        quantity={100}
        staticity={40}
        ease={90}
        size={1}
        color="#fc3893"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              AI-Powered
            </span>{" "}
            Life Insurance Guidance
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Our intelligent platform makes finding the perfect Ameritas life insurance plan easier than ever.
          </motion.p>
        </div>

        <div className="space-y-4">
          {featureItems.map((item, index) => (
            <motion.div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100",
                item.bgGradient,
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2"
                aria-expanded={expandedIndex === index}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="text-2xl text-gray-400">{expandedIndex === index ? "−" : "+"}</div>
              </button>

              {expandedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 border-t border-gray-100"
                >
                  {item.expandedContent}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={onGetStartedClick}
            className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8 py-3 h-auto text-base font-medium shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.03] overflow-hidden"
          >
            {/* Subtle particle effect background */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    opacity: Math.random() * 0.5 + 0.2,
                    animation: `float-particle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <span className="relative z-10 flex items-center gap-2">
              Explore Ameritas Plans with Birdy AI
              <span className="relative inline-block">
                <span className="absolute inset-0 animate-ping opacity-75 text-yellow-300">✨</span>
                <span className="relative z-10 animate-pulse text-yellow-300">✨</span>
              </span>
            </span>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default AIPoweredSection
