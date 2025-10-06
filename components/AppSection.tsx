"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Particles } from "@/components/ui/particles"

const AppSection: React.FC = () => {
  return (
    <section id="app-section" className="relative w-full py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50"></div>

      {/* Particles background */}
      <Particles
        className="absolute inset-0 opacity-40"
        quantity={60}
        staticity={30}
        size={1}
        color="#9b87f5"
        ease={70}
        vx={0.2}
        vy={0.1}
      />

      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 top-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <div>
            <div className="space-y-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-purple-600 font-medium text-sm px-3 py-1 bg-purple-600/10 rounded-full mb-3">
                  THE HEALTHBIRD APP
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-gray-900">
                  Where insurance meets{" "}
                  <span className="relative inline-block">
                    awesome
                    <span className="absolute bottom-0 left-0 w-full h-2.5 bg-pink-500/20 -z-10 transform -rotate-1"></span>
                  </span>{" "}
                  and boring becomes{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    brilliantly
                  </span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    simple
                  </span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-base text-gray-700">
                    Access your insurance card, find in-network doctors, and track your claims with just a few taps
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-base text-gray-700">
                    Get medication reminders, prescription savings, and easy refill requests at your favorite pharmacy
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-base text-gray-700">
                    Chat with BirdyAI for 24/7 guidance on benefits, finding care, and understanding medical bills
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <a
                href="#"
                className={cn(
                  "group inline-flex items-center justify-center gap-2 text-base py-4 sm:py-5 px-5 sm:px-7 rounded-full w-full sm:w-auto",
                  "bg-gradient-to-r from-purple-600 to-pink-500 text-white",
                  "hover:shadow-lg hover:shadow-purple-600/20 transform transition-all duration-300 hover:-translate-y-1",
                )}
              >
                <span>See what else the app can do</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <div className="flex flex-wrap gap-4 pt-2 justify-center sm:justify-start">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button className="bg-black hover:bg-black/90 text-white rounded-lg h-14 pl-4 pr-6 flex items-center gap-2">
                    <img src="/images/app/apple-app-store-logo.png" alt="App Store" className="h-6 w-6" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-xs">Download on the</span>
                      <span className="text-lg font-semibold">App Store</span>
                    </div>
                  </Button>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button className="bg-black hover:bg-black/90 text-white rounded-lg h-14 pl-4 pr-6 flex items-center gap-2">
                    <img src="/images/app/google-play-logo.png" alt="Google Play" className="h-6 w-6" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-xs">GET IT ON</span>
                      <span className="text-lg font-semibold">Google Play</span>
                    </div>
                  </Button>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Right column - App image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center"
          >
            <div className="relative w-full max-w-[1500px] mx-auto">
              {/* Phone mockup with clean background */}
              <div className="relative overflow-hidden transform scale-150">
                <img
                  alt="HealthBird App Interface"
                  className="relative z-10 w-full h-auto rounded-[30px] shadow-2xl"
                  src="/images/app/healthbird-app-screen.png"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AppSection
