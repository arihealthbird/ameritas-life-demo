import { Skeleton } from "@/components/ui/skeleton"

export default function ContactInformationLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="h-16 bg-white border-b border-gray-200 shadow-sm"></div>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="h-8 w-24 mb-4">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="relative mb-6">
            <div className="text-center">
              <Skeleton className="h-7 w-48 mx-auto mb-1" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-8 w-full" />
                </div>

                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
