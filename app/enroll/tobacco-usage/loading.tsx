import { Skeleton } from "@/components/ui/skeleton"
import SimpleHeader from "@/components/SimpleHeader"

export default function TobaccoUsageLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1 container max-w-screen-md mx-auto px-4 py-8">
        {/* Stepper skeleton */}
        <div className="mb-6">
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-full mb-6" />

        {/* Card skeleton */}
        <div className="border rounded-lg p-6 mb-8 space-y-6">
          <Skeleton className="h-7 w-full mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex justify-between mt-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </main>
    </div>
  )
}
