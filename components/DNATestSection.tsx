"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Particles } from "@/components/ui/particles"

interface DNATestSectionProps {
  scrollToZipForm: () => void
}

const DNATestSection: React.FC<DNATestSectionProps> = ({ scrollToZipForm }) => {
  return (
    <section className="relative w-full pt-0 pb-12 md:pb-16 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50"></div>

      {/* Add Particles */}
      <Particles
        className="absolute inset-0 opacity-40"
        quantity={100}
        staticity={40}
        ease={90}
        size={1}
        color="#fc3893"
      />

      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 top-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-medium leading-tight mb-2">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-5xl md:text-7xl">
              Personalized
            </span>
            <br />
            <span className="text-gray-900 font-bold">health plans for your DNA</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6 mb-8">
            Our advanced AI analyzes your health profile to recommend plans that perfectly match your unique needs and
            genetic predispositions.
          </p>

          <Button
            onClick={scrollToZipForm}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-8 py-2.5 h-auto text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
          >
            Find My Perfect Plan
          </Button>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="Health App Interface"
            className="w-full max-w-[800px] mx-auto h-auto"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default DNATestSection
