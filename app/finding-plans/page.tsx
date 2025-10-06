"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SimpleHeader from "@/components/SimpleHeader"
import { motion, AnimatePresence } from "framer-motion"
import { Particles } from "@/components/ui/particles-interactive"
import { Check, Loader2, Network, SearchCheck, Award, Star } from "lucide-react"
import { cn } from "@/lib/utils"

// Luxury testimonials with real-sounding names and specific savings
const testimonials = [
  "The personalized recommendations matched exactly what our growing family needed. We're saving $3,200 this year! || David & Emma Thornton, New Parents",
  "I found a plan that covered all my medications for $150 less per month than what I was paying before. || Michael Richardson, Retiree",
  "As someone with chronic conditions, finding the right coverage was crucial. Healthbird made it simple. || Sarah Thompson, Teacher",
  "After comparing plans side-by-side, I found one that saved me over $2,000 annually. || James Keller, Small Business Owner",
  "The AI-powered recommendations found me a plan that covered my specialists and saved me $1,800 this year. || Jennifer Wu, Marketing Director",
]

// Stage configuration with timing percentages
const stages = [
  {
    id: "connecting",
    title: "Connecting to the health insurance marketplace",
    icon: Network,
    timePercentage: 15, // 15% of total time
    description: "Establishing secure connection to find available plans",
  },
  {
    id: "analyzing",
    title: "Analyzing the plans",
    icon: SearchCheck,
    timePercentage: 55, // 55% of total time
    description: "Evaluating coverage options and benefits",
  },
  {
    id: "ranking",
    title: "Ranking for your perfect match",
    icon: Award,
    timePercentage: 30, // 30% of total time
    description: "Personalizing results based on your needs",
  },
]

// Stage state types
type StageState = "pending" | "processing" | "completed"

export default function FindingPlansPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [stageStates, setStageStates] = useState<StageState[]>(["processing", "pending", "pending"])
  const [plansFound, setPlansFound] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [zipCode, setZipCode] = useState("10001") // Default zip code
  const totalPlans = 175 // Total number of plans to find
  const [showPlansCount, setShowPlansCount] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(0)

  useEffect(() => {
    // Get zip code from session storage if available
    const savedZipCode = sessionStorage.getItem("zipCode")
    if (savedZipCode) {
      setZipCode(savedZipCode)
    }

    // Rotate testimonials every 6 seconds
    const testimonialInterval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    // Calculate total duration based on stage percentages
    const totalDuration = 15000 // 15 seconds total
    const accumulatedProgress = 0
    let currentStage = 0

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        // More precise progress calculation to ensure we reach exactly 100%
        const increment = prevProgress < 95 ? 0.8 : 0.2
        const newProgress = Math.min(prevProgress + increment, 100)

        // Calculate plans found with precise synchronization to progress
        const newPlansFound = Math.floor((newProgress / 100) * totalPlans)

        // Ensure we reach exactly 175 plans when progress is 100%
        const finalPlansFound = newProgress >= 100 ? totalPlans : newPlansFound
        setPlansFound(finalPlansFound)

        // Calculate thresholds for stage transitions
        const stage1Threshold = stages[0].timePercentage
        const stage2Threshold = stage1Threshold + stages[1].timePercentage

        // Update stage based on progress with precise thresholds
        if (newProgress >= stage2Threshold && currentStage < 2) {
          currentStage = 2
          setCurrentStageIndex(2)
          setStageStates(["completed", "completed", "processing"])
          setShowPlansCount(true)
        } else if (newProgress >= stage1Threshold && currentStage < 1) {
          currentStage = 1
          setCurrentStageIndex(1)
          setStageStates(["completed", "processing", "pending"])
          setShowPlansCount(true)
        }

        // Only navigate when we reach exactly 100% progress AND 175 plans
        if (newProgress >= 100 && finalPlansFound >= totalPlans) {
          clearInterval(progressInterval)
          clearInterval(testimonialInterval)

          // Set all stages to completed
          setStageStates(["completed", "completed", "completed"])

          // Navigate to plans page after ensuring completion is visible
          setTimeout(() => {
            router.push("/plans")
          }, 1500) // Slightly longer delay to show completion

          return 100
        }

        return newProgress
      })
    }, 120) // Slightly slower interval for more precise control

    // Clean up intervals
    return () => {
      clearInterval(progressInterval)
      clearInterval(testimonialInterval)
    }
  }, [router])

  useEffect(() => {
    if (showPlansCount && displayedCount < plansFound) {
      const interval = setInterval(() => {
        setDisplayedCount((prev) => {
          // More precise counting to ensure we reach the exact target
          const remaining = plansFound - prev
          const increment = remaining > 10 ? Math.max(2, Math.floor(remaining * 0.15)) : 1
          const newCount = Math.min(prev + increment, plansFound)

          // Ensure we reach exactly the target count
          return newCount >= plansFound ? plansFound : newCount
        })
      }, 40) // Faster updates for smoother counting
      return () => clearInterval(interval)
    }
  }, [showPlansCount, displayedCount, plansFound])

  // Extract user info from testimonial if available
  const hasUserInfo = testimonials[testimonialIndex].includes("||")
  let quote = testimonials[testimonialIndex]
  let userInfo = ""

  if (hasUserInfo) {
    const parts = testimonials[testimonialIndex].split("||")
    quote = parts[0].trim()
    userInfo = parts[1].trim()
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={100}
          staticity={30}
          ease={70}
          color="#8a2be2"
          size={0.5}
        />
        <div className="max-w-xl mx-auto px-4 py-6">
          <motion.div
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  Finding Your Perfect Plan
                </h1>
                <p className="text-gray-600">We're searching for the best healthcare plans for you in {zipCode}</p>
              </motion.div>
            </div>

            {/* Luxury Testimonial */}
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                className="mb-4 text-center px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100/50 shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-2 relative">
                    <Star className="absolute -top-6 -left-6 text-yellow-400 w-4 h-4 opacity-70" />
                    <Star className="absolute -top-4 -right-8 text-yellow-400 w-3 h-3 opacity-50" />
                    <p className="text-md italic text-gray-700 leading-relaxed">{quote}</p>
                    <Star className="absolute -bottom-3 -right-5 text-yellow-400 w-4 h-4 opacity-60" />
                  </div>

                  {hasUserInfo && (
                    <div className="flex items-center mt-2 text-sm text-purple-700 font-medium">
                      <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs mr-2">
                        {userInfo.split(",")[0][0]}
                      </span>
                      <span>{userInfo}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                <motion.div
                  className="h-full absolute top-0 left-0 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 20,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm font-medium">
                <motion.div className="text-purple-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-lg font-semibold">{Math.floor(progress)}%</span>
                </motion.div>
                <motion.div
                  className="text-purple-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showPlansCount ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-lg font-semibold">
                    {showPlansCount ? `${displayedCount} of ${totalPlans} plans` : ""}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-4 mt-4">
              {stages.map((stage, index) => {
                const stageState = stageStates[index]
                const isActive = stageState === "processing"
                const isCompleted = stageState === "completed"
                const isPending = stageState === "pending"

                return (
                  <motion.div
                    key={stage.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl border transition-all",
                      isActive
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md"
                        : isCompleted
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-white border-gray-200",
                    )}
                    initial={{ opacity: 0.7, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isActive ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shadow-md",
                        isActive
                          ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white"
                          : isCompleted
                            ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                            : "bg-gray-100 text-gray-400",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Loader2 className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <stage.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "font-medium text-lg",
                          isActive ? "text-purple-700" : isCompleted ? "text-green-700" : "text-gray-400",
                        )}
                      >
                        {index === 0
                          ? "Connecting to the Health Insurance Marketplace"
                          : index === 1
                            ? `Finding and Analyzing Plans in ${zipCode}`
                            : stage.title}
                      </p>
                      {isActive && (
                        <motion.div
                          className="flex items-center mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <span className="text-sm text-gray-500">{stage.description}</span>
                          <div className="flex space-x-1 ml-2 items-center">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-purple-500"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {isCompleted && (
                        <motion.p
                          className="text-sm text-green-600 mt-1 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Check className="w-4 h-4 mr-1" /> Complete
                        </motion.p>
                      )}
                      {isPending && <p className="text-sm text-gray-400 mt-1">Waiting to begin...</p>}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Animated dots at bottom */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
