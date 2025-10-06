import { Skeleton } from "@/components/ui/skeleton"
import SimpleHeader from "@/components/SimpleHeader"

export default function Loading() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back button and title skeleton */}
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-24 mr-3" />
            <Skeleton className="h-8 w-40" />
          </div>

          {/* Plan Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Plan Header Skeleton */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <Skeleton className="h-7 w-40 mb-2" />
                  <Skeleton className="h-5 w-32 mb-2" />

                  <Skeleton className="h-4 w-20 mt-2" />
                </div>

                {/* Plan Details Skeleton */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>

                {/* Coverage Indicators Skeleton */}
                <div className="px-4 pb-2 flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Rating Skeleton */}
                <div className="px-4 pb-2">
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Cost View Toggle Skeleton */}
          <div className="flex justify-center mb-6">
            <Skeleton className="h-10 w-64 rounded-full" />
          </div>

          {/* Comparison Sections Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-5 w-5" />
                </div>

                {i === 0 && (
                  <div className="border-t border-gray-100 p-4">
                    <div className="space-y-4">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="flex items-center">
                          <Skeleton className="h-6 w-32 mr-auto" />
                          <Skeleton className="h-6 w-20 mx-4" />
                          <Skeleton className="h-6 w-20 mx-4" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
