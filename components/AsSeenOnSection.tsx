"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PartnerReference {
  name: string
  logo: string
  width: string
}

const partners: PartnerReference[] = [
  {
    name: "MarketWatch",
    logo: "/images/partners/marketwatch.png",
    width: "w-32 md:w-40",
  },
  {
    name: "Tech Times",
    logo: "/images/partners/tech-times.png",
    width: "w-32 md:w-40",
  },
  {
    name: "Fox 40",
    logo: "/images/partners/fox40.png",
    width: "w-24 md:w-32",
  },
  {
    name: "eMerge Americas",
    logo: "/images/partners/emerge-americas.png",
    width: "w-32 md:w-40",
  },
  {
    name: "Morningstar",
    logo: "/images/partners/morningstar.png",
    width: "w-32 md:w-40",
  },
  {
    name: "Yahoo Finance",
    logo: "/images/partners/yahoo-finance.png",
    width: "w-32 md:w-40",
  },
]

const AsSeenOnSection: React.FC = () => {
  // Container and item animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      filter: "grayscale(0%)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="relative inline-block text-lg font-bold text-purple-600 bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 uppercase tracking-wider mb-2 pb-1">
            <span className="relative z-10">As Seen On</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Trusted by leading publications and media outlets for our innovative approach to health insurance.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(252,56,147,0.03),transparent_35%)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(155,135,245,0.03),transparent_35%)] pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 relative">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                whileHover="hover"
                className="grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-md p-2">
                  <motion.div
                    className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 rounded-md"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    className={cn("h-auto object-contain", partner.width)}
                  />
                </div>
                <motion.span
                  className="block text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 text-center"
                  initial={{ opacity: 0, y: -5 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {partner.name}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-sm text-gray-400 mt-10 max-w-xl mx-auto font-light italic"
        >
          "HealthBird is revolutionizing how Americans shop for and purchase health insurance." —
          <span className="not-italic font-medium">Healthcare Innovation Magazine</span>
        </motion.p>
      </div>
    </section>
  )
}

export default AsSeenOnSection
