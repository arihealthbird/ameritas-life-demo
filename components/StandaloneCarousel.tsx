"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

interface CarouselSlide {
  image: string
  title: string
  description: string
}

interface StandaloneCarouselProps {
  slides?: CarouselSlide[]
  images?: string[]
}

const defaultSlides: CarouselSlide[] = [
  {
    image: "/images/carousel/mother-child-boat.jpeg",
    title: "Family Moments",
    description: "Health coverage that protects your loved ones during life's most precious moments together.",
  },
  {
    image: "/images/carousel/beach-picnic.jpeg",
    title: "Coastal Getaways",
    description: "Plans that follow you wherever you go, from seaside lunches to sunset adventures.",
  },
  {
    image: "/images/carousel/winter-child.jpeg",
    title: "Winter Wellness",
    description: "Year-round coverage that keeps your family protected in every season of life.",
  },
  {
    image: "/images/carousel/dock-feet.jpeg",
    title: "Summer Escapes",
    description: "Insurance that understands the importance of relaxation and rejuvenation by the water.",
  },
  {
    image: "/images/carousel/cowboy-boots.jpeg",
    title: "Outdoor Traditions",
    description: "Coverage for families who find their happiness in shared experiences and outdoor gatherings.",
  },
]

export default function StandaloneCarousel({ slides = defaultSlides, images }: StandaloneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Setup embla with options and plugins
  const options = { loop: true }
  const autoplayPlugin = Autoplay({ delay: 4000, stopOnInteraction: false })

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplayPlugin])

  const scrollNext = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="w-full h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] h-full min-w-0">
              <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/80 via-pink-500/60 to-transparent" />

              <div className="absolute top-0 left-0 p-8 text-white w-full">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">{slide.title}</h3>
                <p className="text-lg text-white/90 max-w-md backdrop-blur-sm bg-black/5 rounded-lg p-3 font-normal">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
              activeIndex === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/60",
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
