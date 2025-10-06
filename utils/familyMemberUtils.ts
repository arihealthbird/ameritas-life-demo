import type { FamilyMember } from "@/components/FamilyMemberForm"

// Get a family member by ID from session storage
export function getFamilyMemberById(familyMemberId: string): FamilyMember | null {
  try {
    const familyMembersJson = sessionStorage.getItem("familyMembers")
    if (!familyMembersJson) return null

    const familyMembers = JSON.parse(familyMembersJson) as FamilyMember[]
    return familyMembers.find((member) => member.id === familyMemberId) || null
  } catch (error) {
    console.error("Error getting family member:", error)
    return null
  }
}

// Update a family member in session storage
export function updateFamilyMember(updatedMember: FamilyMember): boolean {
  try {
    const familyMembersJson = sessionStorage.getItem("familyMembers")
    if (!familyMembersJson) return false

    const familyMembers = JSON.parse(familyMembersJson) as FamilyMember[]
    const updatedMembers = familyMembers.map((member) =>
      member.id === updatedMember.id ? { ...member, ...updatedMember } : member,
    )

    sessionStorage.setItem("familyMembers", JSON.stringify(updatedMembers))
    return true
  } catch (error) {
    console.error("Error updating family member:", error)
    return false
  }
}

// Add this function to save enrollment status
export function markFamilyMemberAsEnrolled(familyMemberId: string) {
  try {
    // Get current enrollment status
    const enrolledMembersJson = sessionStorage.getItem("enrolledFamilyMembers") || "{}"
    const enrolledMembers = JSON.parse(enrolledMembersJson)

    // Mark this member as enrolled
    enrolledMembers[familyMemberId] = true

    // Save back to session storage
    sessionStorage.setItem("enrolledFamilyMembers", JSON.stringify(enrolledMembers))

    return true
  } catch (error) {
    console.error("Error marking family member as enrolled:", error)
    return false
  }
}

// Update the getNextStep function to ensure the correct sequence
export function getNextStep(currentStep: string): string | null {
  const steps = ["personal", "contact", "ssn", "citizenship", "incarceration", "demographics", "income", "tobacco"]
  const currentIndex = steps.indexOf(currentStep)

  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null // Last step or invalid step
  }

  return steps[currentIndex + 1]
}

// Update the getPreviousStep function to match the same sequence
export function getPreviousStep(currentStep: string): string | null {
  const steps = ["personal", "contact", "ssn", "citizenship", "incarceration", "demographics", "income", "tobacco"]
  const currentIndex = steps.indexOf(currentStep)

  if (currentIndex <= 0) {
    return null // First step or invalid step
  }

  return steps[currentIndex - 1]
}

// Get the display name for a family member type
export function getFamilyMemberDisplayName(type: "spouse" | "dependent", index?: number): string {
  if (type === "spouse") return "Spouse"
  return index !== undefined ? `Dependent ${index + 1}` : "Dependent"
}

// Add the getStepUrl function to map step names to their URL paths
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

// Add a function to fix tobacco usage detection for family members if needed

// If the file already has export functions, add this function to the exports:
export function isFamilyMemberTobaccoUser(memberId: string): boolean {
  try {
    const member = getFamilyMemberById(memberId)
    if (!member) return false

    // Check all possible tobacco usage indicators
    return (
      member.tobaccoUsage === "yes" ||
      member.tobaccoUsage === "smoker" ||
      member.tobaccoUser === "yes" ||
      member.tobaccoUser === true
    )
  } catch (error) {
    console.error("Error checking family member tobacco status:", error)
    return false
  }
}
