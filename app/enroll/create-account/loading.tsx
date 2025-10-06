import { Loader2 } from "lucide-react"
import SimpleHeader from "@/components/SimpleHeader"

export default function Loading() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading your enrollment...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your account creation page.</p>
        </div>
      </div>
    </>
  )
}
