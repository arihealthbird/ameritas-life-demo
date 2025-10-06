import { Skeleton } from "@/components/ui/skeleton"
import SimpleHeader from "@/components/SimpleHeader"

export default function Loading() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button skeleton */}
          <Skeleton className="h-10 w-32 mb-6" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header skeleton */}
            <div className="flex flex-col items-center mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>

            {/* Form skeleton */}
            <div className="space-y-8">
              {/* Personal Details Section */}
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              {/* Contact Information Section */}
              <div>
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              {/* Address Section */}
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-80" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
