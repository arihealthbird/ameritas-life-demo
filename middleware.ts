import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This ROUTE_FLOW should ideally be imported from navigationUtils.ts
// For simplicity here, it's redefined. Ensure it matches the one in navigationUtils.
const ROUTE_FLOW_PATHS = [
  "/",
  "/insurance-type-quiz", // Includes dependents now
  "/date-of-birth",
  "/household",
  "/healthcare-utilization",
  "/provider-medication-search",
  "/finding-plans",
  "/plans",
  // Add other specific enrollment flow paths if they need similar gating
  // For example:
  // "/enroll/create-account",
  // "/enroll/personal-information",
  // etc.
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the current route is part of the defined flow that needs protection
  const currentRouteIndexInFlow = ROUTE_FLOW_PATHS.indexOf(pathname)

  if (currentRouteIndexInFlow > 0) {
    // Routes after the first one ("/") might need protection
    // Check if the previous step is completed by looking for a conceptual "completion marker"
    // This is a simplified example. A robust solution would involve checking actual session data
    // or a more sophisticated state management approach.
    // For this example, let's assume a cookie `lastCompletedStep` stores the path of the last completed step.

    const lastCompletedStep = request.cookies.get("lastCompletedStep")?.value
    const expectedPreviousStep = ROUTE_FLOW_PATHS[currentRouteIndexInFlow - 1]

    if (lastCompletedStep !== expectedPreviousStep) {
      // If the user tries to access a step without completing the previous one,
      // redirect them to the last known completed step, or the beginning of the flow.
      // This logic needs to be more nuanced based on actual application state.
      // For now, redirecting to the expected previous step if no lastCompletedStep or mismatch.
      // A better approach might be to redirect to `lastCompletedStep` if available and valid,
      // or to the start of the flow (`/insurance-type-quiz` or `/`) if state is inconsistent.
      // This is a placeholder for more complex logic.
      // If you want to strictly enforce the flow:
      // if (!lastCompletedStep || ROUTE_FLOW_PATHS.indexOf(lastCompletedStep) < currentRouteIndexInFlow -1) {
      //    return NextResponse.redirect(new URL(expectedPreviousStep, request.url));
      // }
    }
  }

  // Default: allow the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Specific public assets if needed
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images/).*)", // Added /images/ to exclude public images
  ],
}
