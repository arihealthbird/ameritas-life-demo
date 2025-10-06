"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { Particles } from "@/components/ui/particles"
import ZipCodeForm from "./ZipCodeForm"
import HeroCarousel from "./HeroCarousel"
import Typed from "typed.js"

interface HeroProps {
  zipCodeFormRef: React.RefObject<HTMLDivElement>
}

const Hero: React.FC<HeroProps> = ({ zipCodeFormRef }) => {
  const typedEl = useRef<HTMLSpanElement>(null)
  const typed = useRef<Typed | null>(null)

  useEffect(() => {
    if (typedEl.current) {
      typed.current = new Typed(typedEl.current, {
        strings: ["secure", "simple", "affordable", "reliable"],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: false,
        smartBackspace: true,
        startDelay: 500,
        preStringTyped: () => {
          if (typedEl.current) {
            typedEl.current.classList.add("opacity-0")
            setTimeout(() => {
              if (typedEl.current) {
                typedEl.current.classList.remove("opacity-0")
                typedEl.current.classList.add("opacity-100")
              }
            }, 100)
          }
        },
      })
    }

    return () => {
      if (typed.current) {
        typed.current.destroy()
      }
    }
  }, [])

  return (
    <section ref={zipCodeFormRef} className="w-full py-12 md:py-24 lg:min-h-[85vh] px-4 relative overflow-hidden">
      <Particles
        className="absolute inset-0 opacity-40"
        quantity={100}
        staticity={40}
        ease={90}
        size={1}
        color="#fc3893"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 h-full">
        <div className="lg:col-span-7 space-y-10 animate-fade-in">
          <div className="space-y-6">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-200">
              <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Protect your future with Ameritas Life Insurance
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Ameritas Life Insurance
              </span>
              <br />
              <span className="text-gray-900">made </span>
              <span
                ref={typedEl}
                className="text-gray-900 inline-block min-w-[2.5ch] transition-all duration-500 transform"
              ></span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg font-light leading-relaxed">
              Secure your family's financial future with tailored life insurance plans from Ameritas. Get peace of mind,
              effortlessly.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-80"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(252,56,147,0.1)] border border-white/60">
              <ZipCodeForm />
            </div>
          </div>

          <div className="pt-2">
            <button className="inline-flex items-center text-gray-700 hover:text-pink-500 transition-colors group">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-pink-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Already have an account? Sign in
              </span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-[500px] md:h-[550px] lg:h-[600px] relative rounded-2xl overflow-hidden">
          <HeroCarousel />
        </div>
      </div>
    </section>
  )
}

export default Hero
