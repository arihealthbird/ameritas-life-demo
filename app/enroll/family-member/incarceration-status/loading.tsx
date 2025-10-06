import { Skeleton } from "@/components/ui/skeleton"
import SimpleHeader from "@/components/SimpleHeader"

export default function IncarcerationStatusLoading() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button skeleton */}
          <Skeleton className="h-10 w-24 mb-6" />

          {/* Progress Stepper skeleton */}
          <div className="flex justify-between items-center mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-16 mt-2" />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header skeleton */}
            <div className="relative mb-8">
              <div className="text-center">
                <Skeleton className="h-8 w-64 mx-auto mb-2" />
                <Skeleton className="h-4 w-full max-w-md mx-auto" />
              </div>
            </div>

            {/* Form skeleton */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full max-w-md" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>

              {/* Submit button skeleton */}
              <div className="pt-4 flex justify-center">
                <Skeleton className="h-14 w-full md:w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
