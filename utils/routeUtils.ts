export function getStepUrl(step: string): string {
  const baseUrl = "/enroll/family-member"

  switch (step) {
    case "personal":
      return `${baseUrl}/personal-information`
    case "contact":
      return `${baseUrl}/contact-information`
    case "ssn":
      return `${baseUrl}/ssn-information`
    case "citizenship":
      return `${baseUrl}/citizenship-information`
    case "incarceration":
      return `${baseUrl}/incarceration-status`
    case "demographics":
      return `${baseUrl}/demographics`
    case "income":
      return `${baseUrl}/income`
    case "tobacco":
      return `${baseUrl}/tobacco-usage`
    default:
      return "/enroll/review"
  }
}

export function getNextEnrollmentStep(currentPath: string): string | null {
  // Primary applicant flow
  // Financial dependents are now captured in the insurance quiz
  if (currentPath === "/date-of-birth") {
    return "/household"
  }
  if (currentPath === "/enroll/incarceration-status") {
    return "/enroll/demographics"
  }

  // Family member flow
  if (currentPath === "/enroll/family-member/incarceration-status") {
    return "/enroll/family-member/demographics"
  }

  return null
}

export function getMainFlowNextStep(currentPath: string): string | null {
  // Main application flow routing
  switch (currentPath) {
    case "/":
      return "/insurance-type-quiz"
    case "/insurance-type-quiz": // This now includes dependents
      return "/date-of-birth"
    // Financial dependents handled in quiz flow
    case "/date-of-birth":
      return "/household"
    case "/household":
      return "/qualification"
    case "/qualification":
      return "/plans"
    case "/plans":
      return "/create-account" // Updated navigation flow
    case "/create-account":
      return "/enroll/personal-information"
    default:
      return null
  }
}
