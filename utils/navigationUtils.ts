// Note: Financial dependents are now captured during the insurance quiz flow
// The /who-depends-on-you page has been removed and integrated into the quiz
// Navigation utilities for the application flow
export const ROUTE_FLOW = [
  { path: "/", title: "Home" },
  { path: "/insurance-type-quiz", title: "Insurance Needs & Dependents" }, // Updated title
  { path: "/date-of-birth", title: "Your Details" },
  { path: "/household", title: "Household Information" },
  { path: "/healthcare-utilization", title: "Healthcare Utilization" },
  { path: "/provider-medication-search", title: "Providers & Medications" },
  { path: "/finding-plans", title: "Finding Plans" },
  { path: "/plans", title: "Available Plans" },
] as const

export function getCurrentStepIndex(currentPath: string): number {
  return ROUTE_FLOW.findIndex((route) => route.path === currentPath)
}

export function getNextStep(currentPath: string): string | null {
  const currentIndex = getCurrentStepIndex(currentPath)
  if (currentIndex >= 0 && currentIndex < ROUTE_FLOW.length - 1) {
    return ROUTE_FLOW[currentIndex + 1].path
  }
  return null
}

export function getPreviousStep(currentPath: string): string | null {
  const currentIndex = getCurrentStepIndex(currentPath)
  if (currentIndex > 0) {
    return ROUTE_FLOW[currentIndex - 1].path
  }
  return null
}

export function validateRouteFlow(routes: string[]): boolean {
  // Validate that all required routes exist
  const requiredRoutes = ROUTE_FLOW.map((route) => route.path)
  return requiredRoutes.every((route) => routes.includes(route))
}
