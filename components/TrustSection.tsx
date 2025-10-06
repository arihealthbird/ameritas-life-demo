"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Rocket, Clock, Sparkles, Shield, Zap, Star, CheckCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import StandaloneCarousel from "./StandaloneCarousel"
import { Particles } from "@/components/ui/particles"
import Typed from "typed.js"
import { useLanguage } from "@/contexts/LanguageContext"

const TrustSection: React.FC = () => {
  const { t } = useLanguage()
  const typedRef = useRef<HTMLSpanElement>(null)
  const typedInstance = useRef<Typed | null>(null)

  useEffect(() => {
    if (typedRef.current) {
      typedInstance.current = new Typed(typedRef.current, {
        strings: ["uncertainty", "financial burden", "complexity", "confusion", "stress"],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 1000,
        startDelay: 300,
        loop: true,
        smartBackspace: true,
        showCursor: true,
        cursorChar: "|",
        autoInsertCss: true,
      })
    }

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy()
      }
    }
  }, [])

  const scrollToZipForm = () => {
    const zipCodeForm = document.getElementById("zip-code-form")
    if (zipCodeForm) {
      zipCodeForm.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const features = [
    {
      icon: <Sparkles size={32} className="text-pink-500" />,
      title: "AI-Powered Needs Analysis",
      description: "Our smart tools help you find the right Ameritas coverage amount for your unique situation.",
    },
    {
      icon: <Clock size={32} className="text-purple-600" />,
      title: "Quick & Easy Process",
      description: "Get an Ameritas life insurance quote in minutes with our streamlined application.",
    },
    {
      icon: <Zap size={32} className="text-blue-500" />,
      title: "Trusted Coverage",
      description: "Partner with Ameritas, a reputable provider, for reliable life insurance solutions.",
    },
  ]

  const benefits = [
    "Compare Ameritas Term, Whole, and Universal life plans",
    "Understand your policy options clearly",
    "Get expert support throughout the process",
  ]

  const trustItems = [
    { icon: <Shield size={18} className="text-blue-500" />, text: "Secure Application" },
    { icon: <Star size={18} className="text-purple-600" />, text: "A-Rated Carrier (Ameritas)" },
    { icon: <CheckCircle size={18} className="text-pink-500" />, text: "Transparent Policies" },
  ]

  return (
    <section className="w-full py-24 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      <Particles
        className="absolute inset-0 opacity-30"
        quantity={80}
        staticity={50}
        ease={80}
        size={1}
        color="#7c3aed"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ameritas Life Insurance Without The{" "}
            <span
              ref={typedRef}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
            ></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've reimagined the life insurance experience with Ameritas to make it simple, transparent, and
            stress-free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-500/20 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-600/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-125" />
              <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            className="h-[450px] relative rounded-3xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <StandaloneCarousel />
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-transparent" />
              <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-purple-600/10 to-transparent" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                  <Heart size={20} className="text-white" />
                </div>
                <div className="ml-4 text-sm font-medium text-purple-600 px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full">
                  Loved By Thousands
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Get{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  peace of mind
                </span>
                , effortlessly
              </h3>

              <div className="space-y-4 mb-8">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle size={20} className="text-pink-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full px-8 py-6 h-auto text-lg shadow-xl hover:shadow-pink-500/30 transition-all duration-300 w-full md:w-auto"
                onClick={scrollToZipForm}
              >
                <Rocket className="mr-2 h-5 w-5" /> Find Your Ameritas Plan
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              className="group relative flex items-center gap-2.5 bg-white/80 backdrop-blur-sm py-2.5 px-5 rounded-full shadow-lg border border-gray-100/50 hover:border-pink-500/20 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/5 via-purple-600/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 p-1 rounded-full bg-white/80 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              <span className="relative z-10 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TrustSection
