/**
 * Utility functions for date handling and age calculations
 */

/**
 * Parses a date string in MM/DD/YYYY format
 * @param dateString Date string in MM/DD/YYYY format
 * @returns Date object or null if invalid
 */
export function parseDateString(dateString: string): Date | null {
  // Check if the date string is in the correct format
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return null
  }

  const [month, day, year] = dateString.split("/").map(Number)

  // JavaScript months are 0-indexed
  const parsedDate = new Date(year, month - 1, day)

  // Check if the date is valid
  if (
    isNaN(parsedDate.getTime()) ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day ||
    parsedDate.getFullYear() !== year
  ) {
    return null
  }

  return parsedDate
}

/**
 * Formats a date input string with slashes (MM/DD/YYYY)
 * @param value Input string
 * @returns Formatted date string
 */
export function formatDateOfBirth(value: string): string {
  // Only allow digits and limit to 8 characters (not counting slashes)
  const cleaned = value.replace(/[^\d/]/g, "").replace(/\//g, "")
  const digits = cleaned.substring(0, 8) // Limit to 8 digits

  // Format with slashes for display
  let formatted = ""
  if (digits.length > 0) {
    formatted = digits.substring(0, Math.min(2, digits.length))

    if (digits.length > 2) {
      formatted += "/" + digits.substring(2, Math.min(4, digits.length))

      if (digits.length > 4) {
        formatted += "/" + digits.substring(4, 8)
      }
    }
  }

  return formatted
}

/**
 * Calculates age based on date of birth
 * @param dob Date of birth
 * @returns Age in years
 */
export function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDifference = today.getMonth() - dob.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return age
}

/**
 * Validates age restrictions for health insurance
 * @param dob Date of birth
 * @returns Object with age restriction flags
 */
export function validateAgeRestrictions(dob: Date): { isUnder19: boolean; isOver65: boolean; age: number } {
  const age = calculateAge(dob)
  return {
    isUnder19: age < 19,
    isOver65: age > 65,
    age,
  }
}
