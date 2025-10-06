"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, Phone, SmartphoneIcon as MobileIcon, Users } from "lucide-react"
import SimpleHeader from "@/components/SimpleHeader"

// Add custom animations
const styles = `
  @keyframes pulse-subtle {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  @keyframes ring {
    0% { transform: rotate(-15deg); }
    2% { transform: rotate(15deg); }
    4% { transform: rotate(-18deg); }
    6% { transform: rotate(18deg); }
    8% { transform: rotate(-22deg); }
    10% { transform: rotate(22deg); }
    12% { transform: rotate(-18deg); }
    14% { transform: rotate(18deg); }
    16% { transform: rotate(-12deg); }
    18% { transform: rotate(12deg); }
    20% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
`

export default function CompletePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [planName, setPlanName] = useState("Kaiser Permanente Gold POS 2000")
  const [planProvider, setPlanProvider] = useState("Kaiser Permanente")
  const [confirmationNumber, setConfirmationNumber] = useState("HB-1897995-0746")
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Get user data from session storage
    try {
      const storedFirstName = sessionStorage.getItem("firstName") || ""
      const storedLastName = sessionStorage.getItem("lastName") || ""
      const storedEmail = sessionStorage.getItem("email") || ""

      setFirstName(storedFirstName)
      setLastName(storedLastName)
      setEmail(storedEmail)

      // In a real app, you would fetch the plan details and confirmation number from an API
      // For now, we'll use placeholders
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }, [])

  return (
    <>
      <SimpleHeader />
      <style jsx global>
        {styles}
      </style>
      <div className="min-h-screen bg-white">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-4 flex items-center justify-center">
          <CheckCircle className="text-white mr-2 h-6 w-6" />
          <h1 className="text-white text-2xl font-medium">Application Submitted!</h1>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Alert box - Enhanced with animation and effects */}
          <div
            className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r shadow-lg animate-pulse-subtle relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
            style={{
              animation: "pulse-subtle 2s infinite",
              background: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
            }}
          >
            {/* Add decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-red-100 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 -mb-8 -ml-8 bg-red-100 rounded-full opacity-20"></div>

            <div className="flex items-start relative z-10">
              <AlertTriangle className="text-red-500 h-6 w-6 mt-0.5 mr-3 flex-shrink-0 animate-bounce-subtle" />
              <div className="space-y-3">
                <h2 className="text-xl font-medium text-red-700">{firstName}, your application is not complete</h2>
                <p className="text-red-700">
                  Our team is calling you right now to finalize your health insurance application. If you don't pick up
                  the phone, you won't be able to complete your application.
                </p>
                <div className="flex items-center mt-2 p-2 bg-white bg-opacity-50 rounded-md border border-red-200">
                  <Phone className="text-red-700 h-5 w-5 mr-2" style={{ animation: "ring 2s infinite 1s" }} />
                  <span className="text-red-700 font-medium">Expect a call from: </span>
                  <a href="tel:+18336542473" className="text-red-700 font-bold ml-1 underline hover:text-red-800">
                    +1 (833) 654-2473
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation number */}
          <div className="border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm uppercase mb-1">YOUR CONFIRMATION NUMBER</p>
            <p className="text-2xl font-mono">{confirmationNumber}</p>
          </div>

          {/* Plan and applicant info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-gray-500 text-sm uppercase mb-1">SELECTED PLAN</p>
              <p className="text-lg font-medium">{planName}</p>
              <p className="text-gray-600">{planProvider}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-gray-500 text-sm uppercase mb-1">PRIMARY APPLICANT</p>
              <p className="text-lg font-medium">
                {firstName} {lastName}
              </p>
              <p className="text-gray-600">Application Holder</p>
            </div>
          </div>

          {/* Email confirmation */}
          <p className="text-gray-600 text-center">
            We've also sent a confirmation email with these details to your registered email address.
          </p>

          {/* Mobile app section */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
            <div className="flex items-start mb-4">
              <MobileIcon className="text-pink-600 h-6 w-6 mt-1 mr-3" />
              <h2 className="text-xl font-medium text-gray-800">Take HealthBird with you</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Download our mobile app to easily access your insurance card, find doctors in your network, track claims,
              and manage your benefits on the go.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <a href="#" className="bg-black text-white rounded-lg px-4 py-3 flex items-center">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-black text-white rounded-lg px-4 py-3 flex items-center">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="white">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
              <div className="flex text-yellow-400 mr-2">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="h-4 w-4 mr-2" />
                <span>Over 50,000+ happy members using our app</span>
              </div>
            </div>
          </div>

          {/* What happens next section */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-gray-800">What happens next?</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r">
              <h3 className="text-lg font-medium text-red-700 mb-2">
                Important: Your application requires agent verification
              </h3>
              <p className="text-gray-700 mb-3">
                Your application will NOT be active until you speak with our Licensed Insurance Agent. They are calling
                you now to verify your information and finalize your enrollment.
              </p>
              <p className="text-gray-700">
                If you miss their call, please contact us immediately at{" "}
                <a href="tel:+18336542473" className="text-red-700 font-medium">
                  +1 (833) 654-2473
                </a>{" "}
                to complete your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
