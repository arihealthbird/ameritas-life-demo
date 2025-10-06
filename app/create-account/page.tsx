"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SimpleHeader from "@/components/SimpleHeader"
import BirdyAIFloatingButton from "@/components/BirdyAI/BirdyAIFloatingButton"
import BackButton from "@/components/BackButton"
import { SimpleParticles } from "@/components/ui/simple-particles"
import { cn } from "@/lib/utils"

export default function CreateAccountPage() {
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  // Check if user came from plans page
  useEffect(() => {
    const planSelectedAt = sessionStorage.getItem("planSelectedAt")
    const selectedCoverage = sessionStorage.getItem("selectedTermLifeCoverage")

    // If no plan selection data, redirect back to plans
    if (!planSelectedAt || !selectedCoverage) {
      router.replace("/plans")
      return
    }

    // Check if plan selection is recent (within last 30 minutes)
    const selectionTime = new Date(planSelectedAt).getTime()
    const now = new Date().getTime()
    const thirtyMinutes = 30 * 60 * 1000

    if (now - selectionTime > thirtyMinutes) {
      // Plan selection expired, redirect to plans
      router.replace("/plans")
      return
    }
  }, [router])

  const validateForm = useCallback(() => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}

    // Email validation
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [email, password, confirmPassword])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        // Store user account information
        sessionStorage.setItem("userEmail", email)
        sessionStorage.setItem("accountCreated", "true")
        sessionStorage.setItem("accountCreatedAt", new Date().toISOString())

        // Navigate to enrollment process
        router.push("/enroll/personal-information")
      }, 1500)
    },
    [validateForm, email, router],
  )

  const handleSocialLogin = useCallback(
    (provider: string) => {
      // Simulate social login
      setIsSubmitting(true)
      setTimeout(() => {
        sessionStorage.setItem("socialLogin", provider)
        sessionStorage.setItem("accountCreated", "true")
        sessionStorage.setItem("accountCreatedAt", new Date().toISOString())
        router.push("/enroll/personal-information")
      }, 1000)
    },
    [router],
  )

  const handleBack = useCallback(() => {
    // Go back to plans page to allow plan modification
    router.push("/plans")
  }, [router])

  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-white relative overflow-hidden">
        <SimpleParticles
          className="absolute inset-0 -z-10 pointer-events-none"
          quantity={100}
          color="#fc3893"
          size={0.5}
        />

        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Container to align BackButton with card */}
          <div className="max-w-xl mx-auto mb-0 h-10">
            <BackButton onClick={handleBack} />
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 relative z-10 max-w-xl mx-auto">
            {/* Position Birdy AI button at the top right corner of the card */}
            <div className="absolute -top-4 -right-4 z-20">
              <BirdyAIFloatingButton
                title="Account Creation Help"
                explanation="Get instant answers about creating your HealthBird account and the enrollment process."
                tips={[
                  "Learn about password requirements",
                  "Understand account security features",
                  "Get help with social login options",
                  "Learn about data protection",
                  "Understand the enrollment process",
                ]}
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Create your account
              </h1>
              <p className="text-gray-600">Start your enrollment process</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Social Login Options */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-3 border-gray-200 hover:bg-gray-50"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-3 border-gray-200 hover:bg-gray-50"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-3 border-gray-200 hover:bg-gray-50"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.557.37 4.697.594 3.953.89c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.884.11 5.744-.054 6.978-.218 8.214-.262 8.585-.262 12.207s.044 3.993.207 5.228c.163 1.234.387 2.094.683 2.838.306.789.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.744.296 1.604.52 2.838.684 1.235.164 1.606.207 5.228.207s3.993-.043 5.228-.207c1.234-.164 2.094-.388 2.838-.684.789-.305 1.459-.718 2.126-1.384.666-.667 1.079-1.337 1.384-2.126.296-.744.52-1.604.684-2.838.164-1.235.207-1.606.207-5.228s-.043-3.993-.207-5.228c-.164-1.234-.388-2.094-.684-2.838-.305-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.744-.297-1.604-.52-2.838-.684C15.787.043 15.416 0 12.017 0zm0 2.17c3.557 0 3.97.016 5.37.081 1.297.059 2.003.277 2.472.46.621.242 1.065.531 1.532.998.467.467.756.911.998 1.532.183.469.401 1.175.46 2.472.065 1.4.081 1.813.081 5.37s-.016 3.97-.081 5.37c-.059 1.297-.277 2.003-.46 2.472-.242.621-.531 1.065-.998 1.532-.467.467-.911.756-1.532.998-.469.183-1.175.401-2.472.46-1.4.065-1.813.081-5.37.081s-3.97-.016-5.37-.081c-1.297-.059-2.003-.277-2.472-.46-.621-.242-1.065-.531-1.532-.998-.467-.467-.756-.911-.998-1.532-.183-.469-.401-1.175-.46-2.472-.065-1.4-.081-1.813-.081-5.37s.016-3.97.081-5.37c.059-1.297.277-2.003.46-2.472.242-.621.531-1.065.998-1.532.467-.467.911-.756 1.532-.998.469-.183 1.175-.401 2.472-.46 1.4-.065 1.813-.081 5.37-.081z" />
                    <path d="M12.017 5.838a6.369 6.369 0 1 0 0 12.738 6.369 6.369 0 0 0 0-12.738zm0 10.5a4.131 4.131 0 1 1 0-8.262 4.131 4.131 0 0 1 0 8.262zM19.846 5.595a1.488 1.488 0 1 1-2.976 0 1.488 1.488 0 0 1 2.976 0z" />
                  </svg>
                  <span>Continue with Apple</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={cn(
                      "pl-10 pr-10 h-12 rounded-lg",
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-200",
                    )}
                  />
                  {email && !errors.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "pl-10 pr-10 h-12 rounded-lg",
                      errors.password ? "border-red-500 bg-red-50" : "border-gray-200",
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black rounded-full flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-3 w-3 text-white" /> : <Eye className="h-3 w-3 text-white" />}
                  </button>
                </div>
                {!errors.password && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Info className="h-3 w-3 mr-1" />
                    Password must be at least 8 characters long
                  </div>
                )}
                {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "pl-10 pr-10 h-12 rounded-lg",
                      errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-200",
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3 w-3 text-white" />
                    ) : (
                      <Eye className="h-3 w-3 text-white" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-6 rounded-lg transition-all duration-300",
                  "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/20",
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Terms and Privacy */}
              <div className="text-center text-xs text-gray-500 mt-6">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
