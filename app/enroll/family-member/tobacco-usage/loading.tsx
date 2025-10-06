import { Skeleton } from "@/components/ui/skeleton"
import FamilyMemberEnrollmentLayout from "@/components/FamilyMemberEnrollmentLayout"

export default function Loading() {
  return (
    <FamilyMemberEnrollmentLayout
      currentStep="tobacco"
      title="Loading..."
      description="Please wait while we load your information"
      aiTitle="Tobacco Usage Information"
      aiExplanation="Get instant answers about how tobacco usage affects health insurance."
      aiTips={[]}
    >
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </FamilyMemberEnrollmentLayout>
  )
}
