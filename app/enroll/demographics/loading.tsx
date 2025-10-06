import { Skeleton } from "@/components/ui/skeleton"
import SimpleHeader from "@/components/SimpleHeader"

export default function DemographicsLoading() {
  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Back button skeleton */}
          <Skeleton className="h-10 w-40 mb-6" />

          {/* Progress Stepper skeleton */}
          <div className="flex justify-center mb-6">
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="text-center">
                <Skeleton className="h-8 w-64 mx-auto mb-2" />
                <Skeleton className="h-4 w-80 mx-auto" />
              </div>
            </div>

            <div className="space-y-8">
              {/* Hispanic Origin Question skeleton */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>

              {/* Race/Ethnicity Question skeleton */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>

                <Skeleton className="h-14 w-full rounded-lg" />
                <div className="h-12"></div>
              </div>

              {/* Separator skeleton */}
              <Skeleton className="h-px w-full" />

              {/* Button skeleton */}
              <div className="pt-4 flex justify-center">
                <Skeleton className="h-14 w-full md:w-2/3 rounded-full" />
              </div>

              {/* Information Message skeleton */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-64" />
                </div>

                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
