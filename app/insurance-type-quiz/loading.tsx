import LoadingAnimationDots from "@/components/loading/LoadingAnimationDots"
import SimpleHeader from "@/components/SimpleHeader"
import { SimpleParticles } from "@/components/ui/simple-particles"

export default function Loading() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">
        <SimpleParticles
          className="absolute inset-0 -z-10 pointer-events-none"
          quantity={100}
          color="#fc3893"
          size={0.5}
        />
        <div className="text-center p-4">
          <LoadingAnimationDots />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your questionnaire...</p>
          <p className="text-sm text-gray-500">Just a moment while we prepare everything for you.</p>
        </div>
      </div>
    </>
  )
}
