"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ArrowRight, Eye, EyeOff, Mail, Lock, Info } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: "login" | "signup"
}

const AuthModal = ({ isOpen, onClose, initialView = "login" }: AuthModalProps) => {
  const [view, setView] = useState<"login" | "signup">(initialView)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})

  // Reset view when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setView(initialView)
      // Reset form
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setErrors({})
    }
  }, [isOpen, initialView])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}

    if (!email) {
      newErrors.email = "Please fill out this field."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      newErrors.password = "Please fill out this field."
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long."
    }

    if (view === "signup" && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-visible w-[95vw] sm:w-full rounded-xl border-0 shadow-xl">
        <div className="relative flex flex-col p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-purple-600 mb-1">
              {view === "login" ? "Welcome back" : "Join HealthBird"}
            </h2>
            {view === "signup" && (
              <p className="text-gray-400 text-sm">Create an account to save your progress and preferences</p>
            )}
          </div>

          {/* Tab navigation */}
          <div className="flex mb-5 bg-gray-100 rounded-full p-1">
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors rounded-full ${
                view === "login"
                  ? "bg-white text-gray-700 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setView("login")}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors rounded-full ${
                view === "signup"
                  ? "bg-white text-gray-700 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setView("signup")}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "pl-12 py-2 h-12 rounded-xl text-base",
                    errors.email ? "border-red-500 bg-red-50 text-red-900 placeholder:text-red-500" : "border-gray-200",
                  )}
                />
                {errors.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full p-2">
                    <span className="text-yellow-400 text-lg">!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 py-2 h-12 rounded-xl text-base border-gray-200"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white rounded-full p-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {view === "signup" && (
                <p className="text-gray-400 text-sm flex items-center">
                  <Info className="h-4 w-4 mr-2 text-gray-400" />
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Google Sign-in (only for login) */}
            {view === "login" && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
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
                </button>
              </>
            )}

            {/* Confirm Password (only for signup) */}
            {view === "signup" && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 py-2 h-12 rounded-xl text-base border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white rounded-full p-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full text-base font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
            >
              {view === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Terms and Privacy (only for signup) */}
            {view === "signup" && (
              <p className="text-center text-gray-400 text-sm mt-4">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Terms of Service
                </a>{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </form>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              {view === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-pink-500 hover:text-pink-600 font-medium"
                onClick={() => setView(view === "login" ? "signup" : "login")}
              >
                {view === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          <div className="text-center text-xs text-gray-400 mt-4">
            Protected by industry-leading security and encryption
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
